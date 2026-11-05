import {
  db,
  doc,
  collection,
  setDoc,
  deleteDoc,
  onSnapshot,
  OperationType,
  handleFirestoreError,
} from '../lib/firebase';
import { CustomPreset } from '../types';

export function subscribeUserPresets(
  userId: string,
  onUpdate: (presets: CustomPreset[]) => void,
  onError?: (err: Error) => void
) {
  const path = `users/${userId}/presets`;
  const q = collection(db, 'users', userId, 'presets');

  return onSnapshot(
    q,
    (snapshot) => {
      const presets: CustomPreset[] = [];
      snapshot.forEach((docSnap) => {
        presets.push(docSnap.data() as CustomPreset);
      });
      presets.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      onUpdate(presets);
    },
    (error) => {
      onError?.(error);
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

export async function saveCustomPreset(preset: CustomPreset): Promise<void> {
  const path = `users/${preset.userId}/presets/${preset.id}`;
  try {
    const docRef = doc(db, 'users', preset.userId, 'presets', preset.id);
    await setDoc(docRef, preset);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteCustomPreset(userId: string, presetId: string): Promise<void> {
  const path = `users/${userId}/presets/${presetId}`;
  try {
    const docRef = doc(db, 'users', userId, 'presets', presetId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}
