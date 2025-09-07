import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';

export default function GroupList({ onSelectGroup }) {
  const { currentUser } = useAuth();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    const groupsRef = collection(db, 'groups');
    const q = query(groupsRef, where('members', 'array-contains', currentUser.uid));
    const unsubscribe = onSnapshot(q, snapshot => {
      setGroups(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return unsubscribe;
  }, [currentUser]);

  if (loading) return <p>Loading groups...</p>;

  return (
    <div style={{ maxWidth: 400, margin: '1rem auto' }}>
      <h3>Your Groups</h3>
      {groups.length === 0 && <p>No groups found</p>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {groups.map(group => (
          <li key={group.id} onClick={() => onSelectGroup(group)} style={{ cursor: 'pointer', marginBottom: 8, padding: 10, backgroundColor: '#e0e7ff', borderRadius: 6 }}>
            <strong>{group.name}</strong><br />
            <small>{group.description}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
