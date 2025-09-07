import React, { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase/config';
import ExpenseForm from '../components/forms/ExpenseForm';
import { collection, addDoc, query, where, onSnapshot, orderBy } from 'firebase/firestore';

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);

  // Fetch expenses from Firestore in real time
  useEffect(() => {
    const expensesRef = collection(db, 'expenses');
    const q = query(expensesRef, orderBy('date', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setExpenses(snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })));
    });
    return unsubscribe;
  }, []);

  async function handleSignOut() {
    await signOut(auth);
  }

  async function handleAddExpense(data) {
    await addDoc(collection(db, 'expenses'), data);
  }

  return (
    <div style={{ maxWidth: 600, margin: "32px auto" }}>
      <h1 style={{ textAlign: "center" }}>Dashboard</h1>
      <button
        onClick={handleSignOut}
        style={{ float: "right", marginBottom: 16, padding: 8, background: "#ef4444", color: "#fff", border: "none", borderRadius: 4 }}
      >Sign Out</button>
      <ExpenseForm onSubmit={handleAddExpense} />
      <h2 style={{ marginTop: 32 }}>Expenses</h2>
      {expenses.map(expense => (
        <div key={expense.id} style={{ background: "#f3f4f6", padding: 10, borderRadius: 6, marginBottom: 8 }}>
          <b>{expense.description}</b> | {expense.category} | ${expense.amount} | {expense.date && new Date(expense.date.seconds ? expense.date.seconds * 1000 : expense.date).toLocaleDateString()}
        </div>
      ))}
    </div>
  );
}
