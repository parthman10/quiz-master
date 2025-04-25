import { collection, addDoc, query, orderBy, limit, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

const LEADERBOARD_COLLECTION = 'leaderboard';

export const addLeaderboardEntry = async (entry) => {
  try {
    const docRef = await addDoc(collection(db, LEADERBOARD_COLLECTION), {
      ...entry,
      timestamp: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding leaderboard entry:', error);
    throw error;
  }
};

export const getTopLeaderboardEntries = async () => {
  try {
    const leaderboardRef = collection(db, LEADERBOARD_COLLECTION);
    const q = query(leaderboardRef, orderBy('score', 'desc'), limit(10));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting leaderboard entries:', error);
    throw error;
  }
};