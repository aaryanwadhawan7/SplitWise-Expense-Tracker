import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "../firebase/config";
import { signOut } from "firebase/auth";
import ExpenseChart from "../components/charts/ExpenseChart";
import ExpenseFormHook from "../components/ExpenseFormHook";
import GroupForm from "../components/GroupForm";
import GroupList from "../components/GroupList";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";

function calculateBalances(expenses) {
  const netBalances = {};
  expenses.forEach((expense) => {
    const amount = Number(expense.amount);
    const splits = expense.splits || {};
    Object.entries(splits).forEach(([uid, splitAmount]) => {
      if (!netBalances[uid]) netBalances[uid] = 0;
      if (uid === expense.createdBy) {
        netBalances[uid] += amount - splitAmount;
      } else {
        netBalances[uid] -= splitAmount;
      }
    });
  });
  return netBalances;
}

export default function Dashboard() {
  const { currentUser, userProfile } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);

  useEffect(() => {
    if (!currentUser) return;
    const groupsRef = collection(db, "groups");
    const q = query(groupsRef, orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setGroups(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, [currentUser]);

  useEffect(() => {
    if (!selectedGroup) return;
    const expensesRef = collection(db, "expenses");
    const qFiltered = query(
      expensesRef,
      orderBy("date", "desc"),
      where("groupId", "==", selectedGroup.id)
    );
    const unsubscribe = onSnapshot(qFiltered, (snapshot) => {
      setExpenses(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, [selectedGroup]);

  async function handleSignOut() {
    await signOut(auth);
  }

  async function handleSaveExpense(data) {
  if (!selectedGroup || !currentUser) return;

  // Calculate equal split among group members
  const splits = {};
  selectedGroup.members.forEach((uid) => {
    splits[uid] = Number(
      (data.amount / selectedGroup.members.length).toFixed(2)
    );
  });

  // Prepare data for Firestore
  const expenseData = {
    ...data,
    splits,
    groupId: selectedGroup.id,
    createdBy: currentUser.uid,
    status: "active",
    date: data.date || new Date(), // ensure date is set
  };

  // Save to Firestore
  await addDoc(collection(db, "expenses"), expenseData);
}

  function handleEdit(expense) {
    setEditingExpense(expense);
  }

  async function handleDelete(id) {
    if (window.confirm("Delete this expense?")) {
      await deleteDoc(doc(db, "expenses", id));
      if (editingExpense?.id === id) setEditingExpense(null);
    }
  }

  const balances = calculateBalances(expenses);

  function renderSettlements() {
    const owe = [],
      owed = [];
    Object.entries(balances).forEach(([uid, amount]) => {
      if (amount < 0) owe.push({ uid, amount: -amount });
      else if (amount > 0) owed.push({ uid, amount });
    });
    if (owe.length === 0 && owed.length === 0) return <p>All settled!</p>;

    return (
      <ul>
        {owe.map((person) => {
          const payTo = owed.find((o) => o.amount > 0);
          if (!payTo) return null;
          const settledAmount = Math.min(person.amount, payTo.amount);
          payTo.amount -= settledAmount;
          return (
            <li key={person.uid}>
              <strong style={{ color: isDarkMode ? "#3b82f6" : "#111" }}>
                {person.uid}
              </strong>{" "}
              owes{" "}
              <strong style={{ color: isDarkMode ? "#3b82f6" : "#111" }}>
                {payTo.uid}
              </strong>
              &nbsp;
              <span style={{ color: isDarkMode ? "#3b82f6" : "#111" }}>
                ${settledAmount.toFixed(2)}
              </span>
            </li>
          );
        })}
      </ul>
    );
  }

  const mainTextColor = isDarkMode ? "#3b82f6" : "#111";
  const secondaryTextColor = isDarkMode ? "#60a5fa" : "#555"; // lighter blue for secondary text

  return (
    <div
      style={{
        maxWidth: 800,
        margin: "2rem auto",
        padding: 20,
        backgroundColor: isDarkMode ? "#1f2937" : "#fff",
        color: mainTextColor,
        minHeight: "100vh",
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
    >
      {/* Header */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <h1 style={{ color: mainTextColor }}>
          Welcome, {userProfile?.email}{" "}
          {userProfile?.role === "admin" && (
            <span style={{ color: secondaryTextColor }}> (Admin) </span>
          )}
        </h1>
        <button
          onClick={handleSignOut}
          style={{
            backgroundColor: isDarkMode ? "#dc2626" : "#ef4444",
            color: "#fff",
            padding: "8px 16px",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Sign Out
        </button>
      </header>

      {/* Dark Mode Toggle */}
      <button
        onClick={toggleTheme}
        style={{
          marginBottom: 30,
          backgroundColor: isDarkMode ? "#374151" : "#d1d5db",
          color: mainTextColor,
          border: "none",
          padding: "6px 12px",
          borderRadius: 4,
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        Switch to {isDarkMode ? "Light" : "Dark"} Mode
      </button>

      {/* Group Management */}
      <GroupForm isDarkMode={isDarkMode} mainTextColor={mainTextColor} />
      <GroupList
        isDarkMode={isDarkMode}
        mainTextColor={mainTextColor}
        secondaryTextColor={secondaryTextColor}
        onSelectGroup={(group) => setSelectedGroup(group)}
      />
      {selectedGroup && (
        <p style={{ marginTop: 10, color: secondaryTextColor }}>
          Selected group: <b>{selectedGroup.name}</b>
        </p>
      )}

      {/* Chart */}
      <ExpenseChart expenses={expenses} isDarkMode={isDarkMode} mainTextColor={mainTextColor} />

      {/* Expense Form Add/Edit */}
      <h2 style={{ marginTop: 30, color: mainTextColor }}>
        {editingExpense ? "Edit Expense" : "Add Expense"}
      </h2>
      <ExpenseFormHook
        onSubmit={handleSaveExpense}
        defaultValues={
          editingExpense ?? {
            amount: "",
            description: "",
            category: "",
            date: new Date(),
          }
        }
        isDarkMode={isDarkMode}
        mainTextColor={mainTextColor}
      />

      {/* Expense List */}
      <h2 style={{ marginTop: 30, color: mainTextColor }}>Expenses</h2>
      {expenses.length === 0 ? (
        <p style={{ color: secondaryTextColor }}>No expenses found</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {expenses.map((exp) => (
            <li
              key={exp.id}
              style={{
                backgroundColor: isDarkMode ? "#374151" : "#f3f4f6",
                color: mainTextColor,
                marginBottom: 10,
                padding: 10,
                borderRadius: 6,
                border: "1px solid " + (isDarkMode ? "#4b5563" : "#e5e7eb"),
              }}
            >
              <div>
                <strong>{exp.description}</strong> • {exp.category} • $
                {exp.amount} • {exp.status}
                <br />
                <small style={{ color: secondaryTextColor }}>
                  {exp.date &&
                    new Date(exp.date.seconds * 1000).toLocaleDateString()}
                </small>
              </div>
              <div style={{ marginTop: 6 }}>
                <button
                  onClick={() => handleEdit(exp)}
                  style={{
                    marginRight: 10,
                    backgroundColor: isDarkMode ? "#2563eb" : "#3b82f6",
                    color: "#fff",
                    border: "none",
                    borderRadius: 4,
                    padding: "4px 10px",
                    cursor: "pointer",
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(exp.id)}
                  style={{
                    backgroundColor: isDarkMode ? "#dc2626" : "#ef4444",
                    color: "#fff",
                    border: "none",
                    borderRadius: 4,
                    padding: "4px 10px",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Settlements Display */}
      <h2 style={{ marginTop: 30, color: mainTextColor }}>Settlements</h2>
      {renderSettlements()}
    </div>
  );
}
