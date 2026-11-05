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
import { StageProgress } from '../types';

export function subscribeUserProgress(
  userId: string,
  onUpdate: (progressMap: Record<string, StageProgress>) => void,
  onError?: (err: Error) => void
) {
  const path = `users/${userId}/progress`;
  const q = collection(db, 'users', userId, 'progress');

  return onSnapshot(
    q,
    (snapshot) => {
      const progressMap: Record<string, StageProgress> = {};
      snapshot.forEach((docSnap) => {
        const item = docSnap.data() as StageProgress;
        progressMap[item.stageId] = item;
      });
      onUpdate(progressMap);
    },
    (error) => {
      onError?.(error);
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

export async function setStageMastery(
  userId: string,
  stageId: string,
  isMastered: boolean,
  quizScore: number = 100
): Promise<void> {
  const path = `users/${userId}/progress/${stageId}`;
  try {
    const progress: StageProgress = {
      id: stageId,
      userId,
      stageId,
      isMastered,
      quizScore,
      updatedAt: new Date().toISOString(),
    };
    const docRef = doc(db, 'users', userId, 'progress', stageId);
    await setDoc(docRef, progress);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}
