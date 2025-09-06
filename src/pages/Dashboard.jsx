import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';

export default function Dashboard() {
  const { currentUser } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">SplitWise - Dashboard</h1>
        <button
          onClick={handleSignOut}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Sign Out
        </button>
      </header>
      <main>
        <p>Welcome, {currentUser?.email}</p>
        {/* Future implementation: Render expenses, groups, charts here */}
      </main>
    </div>
  );
}
