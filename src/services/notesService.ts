import {
  db,
  doc,
  collection,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  OperationType,
  handleFirestoreError,
} from '../lib/firebase';
import { StudyNote } from '../types';

export function subscribeUserNotes(
  userId: string,
  onUpdate: (notes: StudyNote[]) => void,
  onError?: (err: Error) => void
) {
  const path = `users/${userId}/notes`;
  const q = collection(db, 'users', userId, 'notes');

  return onSnapshot(
    q,
    (snapshot) => {
      const notes: StudyNote[] = [];
      snapshot.forEach((docSnap) => {
        notes.push(docSnap.data() as StudyNote);
      });
      // Sort by updatedAt descending
      notes.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      onUpdate(notes);
    },
    (error) => {
      onError?.(error);
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

export async function saveStudyNote(note: StudyNote): Promise<void> {
  const path = `users/${note.userId}/notes/${note.id}`;
  try {
    const docRef = doc(db, 'users', note.userId, 'notes', note.id);
    await setDoc(docRef, note);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteStudyNote(userId: string, noteId: string): Promise<void> {
  const path = `users/${userId}/notes/${noteId}`;
  try {
    const docRef = doc(db, 'users', userId, 'notes', noteId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}
