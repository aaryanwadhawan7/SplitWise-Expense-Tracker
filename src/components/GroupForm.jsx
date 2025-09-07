import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';

export default function GroupForm({ onGroupCreated }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const { currentUser } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();

    const group = {
      name,
      description,
      members: [currentUser.uid],
      createdBy: currentUser.uid,
      createdAt: new Date(),
      totalExpenses: 0
    };

    try {
      await addDoc(collection(db, 'groups'), group);
      setName('');
      setDescription('');
      if (onGroupCreated) onGroupCreated();
    } catch (error) {
      console.error('Failed to create group:', error);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '2rem auto' }}>
      <h3>Create New Group</h3>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Group Name"
        required
        style={{ width: '100%', marginBottom: 10, padding: 10 }}
      />
      <textarea
        value={description}
        onChange={e => setDescription(e.target.value)}
        placeholder="Description (optional)"
        rows={3}
        style={{ width: '100%', marginBottom: 10, padding: 10 }}
      />
      <button type="submit" style={{ padding: 10, width: '100%', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: 4 }}>
        Create Group
      </button>
    </form>
  );
}
