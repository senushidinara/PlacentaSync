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
import { DiscussionPost } from '../types';

export function subscribeDiscussions(
  stageId: string,
  onUpdate: (posts: DiscussionPost[]) => void,
  onError?: (err: Error) => void
) {
  const path = 'discussions';
  const q = collection(db, 'discussions');

  return onSnapshot(
    q,
    (snapshot) => {
      const posts: DiscussionPost[] = [];
      snapshot.forEach((docSnap) => {
        const item = docSnap.data() as DiscussionPost;
        if (item.stageId === stageId) {
          posts.push(item);
        }
      });
      posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      onUpdate(posts);
    },
    (error) => {
      onError?.(error);
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

export async function addDiscussionPost(post: DiscussionPost): Promise<void> {
  const path = `discussions/${post.id}`;
  try {
    const docRef = doc(db, 'discussions', post.id);
    await setDoc(docRef, post);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteDiscussionPost(postId: string): Promise<void> {
  const path = `discussions/${postId}`;
  try {
    const docRef = doc(db, 'discussions', postId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}
