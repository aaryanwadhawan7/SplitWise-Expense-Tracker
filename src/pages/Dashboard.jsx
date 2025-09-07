import React, { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, doc, query, orderBy, onSnapshot, deleteDoc } from "firebase/firestore";
import { auth, db } from '../firebase/config';
import { signOut } from 'firebase/auth';
import { useAuth } from '../contexts/AuthContext';
import ExpenseChart from '../components/charts/ExpenseChart';
import ExpenseFormHook from '../components/ExpenseFormHook';

export default function Dashboard() {
  const { currentUser, userProfile } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);

  useEffect(() => {
    if (!currentUser) return;

    const expensesRef = collection(db, "expenses");
    const q = query(expensesRef, orderBy("date", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setExpenses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, [currentUser]);

  async function handleSignOut() {
    await signOut(auth);
  }

  async function handleSaveExpense(data) {
    if (editingExpense) {
      // update existing expense
      const expenseDoc = doc(db, "expenses", editingExpense.id);
      await updateDoc(expenseDoc, data);
      setEditingExpense(null);
    } else {
      // add new expense
      await addDoc(collection(db, "expenses"), { ...data, createdBy: currentUser.uid, status: 'active' });
    }
  }

  async function handleEdit(expense) {
    setEditingExpense(expense);
  }

  async function handleDelete(id) {
    if (window.confirm("Delete this expense?")) {
      await deleteDoc(doc(db, "expenses", id));
      if (editingExpense?.id === id) setEditingExpense(null);
    }
  }

  return (
    <div style={{ maxWidth: 700, margin: 'auto', padding: 16 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Hello, {userProfile?.email}</h1>
        <button onClick={handleSignOut} style={{ backgroundColor: "#ef4444", color: "white", border: "none", padding: 10, borderRadius: 4 }}>Sign Out</button>
      </header>

      {userProfile?.role === 'admin' && (<div style={{ background: "#e0e7ff", padding: 12, borderRadius: 6, marginTop: 12 }}>Admin Panel</div>)}

      <ExpenseChart expenses={expenses} />

      <h2>{editingExpense ? "Edit Expense" : "Add Expense"}</h2>

      <ExpenseFormHook
        onSubmit={handleSaveExpense}
        defaultValues={editingExpense ?? {
          amount: '',
          description: '',
          category: '',
          date: new Date(),
        }}
      />

      <h2 style={{ marginTop: 20 }}>Your Expenses</h2>
      {expenses.length === 0 && <p>No expenses yet.</p>}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {expenses.map(exp => (
          <li key={exp.id} style={{ marginBottom: 10, padding: 10, background: "#f3f4f6", borderRadius: 6 }}>
            <div><b>{exp.description}</b> - {exp.category} - ${exp.amount} - {exp.date && new Date(exp.date.seconds ? exp.date.seconds * 1000 : exp.date).toLocaleDateString()}</div>
            <div style={{ marginTop: 6 }}>
              <button onClick={() => handleEdit(exp)} style={{ marginRight: 10 }}>Edit</button>
              <button onClick={() => handleDelete(exp.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
