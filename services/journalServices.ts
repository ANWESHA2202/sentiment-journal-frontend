import { db } from "@/firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  DocumentData,
  getDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { Journal } from "@/typeDeclarations";

// Add Journal
export const addJournal = async ({
  userId,
  title,
  content,
  textContent,
  callback,
}: {
  userId: string;
  title: string;
  content: string;
  textContent: string;
  callback?: () => void;
}) => {
  const journalData: Journal = {
    userId,
    title,
    content,
    createdAt: new Date(),
    textContent,
  };
  try {
    await addDoc(collection(db, "journals"), journalData);
    callback?.();
  } catch (error) {
    console.error("Error adding journal:", error);
  }
};

// Get Journals
export const getJournals = async (userId: string): Promise<Journal[]> => {
  try {
    const q = query(collection(db, "journals"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    const journals: Journal[] = [];
    querySnapshot.forEach((doc) => {
      journals.push({ id: doc.id, ...(doc.data() as Journal) });
    });

    return journals;
  } catch (error) {
    console.error("Error getting journals:", error);
    return [];
  }
};

// Get Journal
export const getJournal = async (
  journalId: string
): Promise<Journal | null> => {
  try {
    const docRef = doc(db, "journals", journalId);
    const docSnap = await getDoc(docRef);
    return docSnap.data() as Journal;
  } catch (error) {
    console.error("Error getting journal:", error);
    return null;
  }
};

//update journal
export const updateJournal = async ({
  journalId,
  title,
  content,
  textContent,
  callback,
}: {
  journalId: string;
  title: string;
  content: string;
  textContent: string;
  callback?: () => void;
}) => {
  try {
    const docRef = doc(db, "journals", journalId);
    const journalData = { title, content, textContent };
    await updateDoc(docRef, journalData);
    callback?.();
  } catch (error) {
    console.error("Error updating journal:", error);
  }
};
