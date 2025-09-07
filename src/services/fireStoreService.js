import {
 collection,
 addDoc,
 updateDoc,
 deleteDoc,
 doc,
 getDocs,
 getDoc,
 query,
 where,
 orderBy,
 onSnapshot
 } from 'firebase/firestore';
 import { db } from '../firebase/config';
 export const firestoreService = {
 // Expenses
 async addExpense(expenseData) {
 try {
 const docRef = await addDoc(collection(db, 'expenses'), {
 ...expenseData,
 createdAt: new Date()
 });
 return docRef.id;
 } catch (error) {
 throw error;
 }
 },
async updateExpense(expenseId, updates) {
 try {
 await updateDoc(doc(db, 'expenses', expenseId), updates);
 } catch (error) {
 throw error;
 }
 },
 async deleteExpense(expenseId) {
 try {
 await deleteDoc(doc(db, 'expenses', expenseId));
 } catch (error) {
 throw error;
 }
 },
 // Real-time listener for expenses
 subscribeToExpenses(userId, callback) {
 const q = query(
 collection(db, 'expenses'),
 where('participants', 'array-contains', userId),
 orderBy('date', 'desc')
 );
 return onSnapshot(q, callback);
 },
 // Groups
 async createGroup(groupData) {
 try {
 const docRef = await addDoc(collection(db, 'groups'), {
 ...groupData,
 createdAt: new Date()
 });
 return docRef.id;
 } catch (error) {
 throw error;
 }
 },
 subscribeToGroups(userId, callback) {
 const q = query(
 collection(db, 'groups'),
 where('members', 'array-contains', userId)
 );
 return onSnapshot(q, callback);
 }
 };
