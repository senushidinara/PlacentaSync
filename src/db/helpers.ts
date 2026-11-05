import { db } from './index.ts';
import { notes, presets, stageProgress, discussions } from './schema.ts';
import { eq, desc } from 'drizzle-orm';
import { getOrCreateUser } from './users.ts';

// Notes helpers
export async function getNotesForUser(uid: string) {
  try {
    const user = await getOrCreateUser(uid, '');
    if (!user) return [];
    
    return await db.select().from(notes)
      .where(eq(notes.userId, user.id))
      .orderBy(desc(notes.createdAt));
  } catch (error) {
    console.error("Failed to get notes:", error);
    throw new Error("Failed to get notes.", { cause: error });
  }
}

export async function createNote(uid: string, email: string, data: { stageId: string; title: string; content: string; tag?: string; structureId?: string }) {
  try {
    const user = await getOrCreateUser(uid, email);
    const result = await db.insert(notes).values({
      userId: user.id,
      stageId: data.stageId,
      title: data.title,
      content: data.content,
      tag: data.tag || 'General',
      structureId: data.structureId || null,
    }).returning();
    return result[0];
  } catch (error) {
    console.error("Failed to create note:", error);
    throw new Error("Failed to create note.", { cause: error });
  }
}

export async function deleteNote(uid: string, noteId: number) {
  try {
    await db.delete(notes).where(eq(notes.id, noteId));
    return { success: true };
  } catch (error) {
    console.error("Failed to delete note:", error);
    throw new Error("Failed to delete note.", { cause: error });
  }
}

// Presets helpers
export async function getPresetsForUser(uid: string) {
  try {
    const user = await getOrCreateUser(uid, '');
    return await db.select().from(presets)
      .where(eq(presets.userId, user.id))
      .orderBy(desc(presets.createdAt));
  } catch (error) {
    console.error("Failed to get presets:", error);
    throw new Error("Failed to get presets.", { cause: error });
  }
}

export async function createPreset(uid: string, email: string, data: { stageId: string; name: string; sliceAxis?: string; slicePosition?: number; explodedView?: number; transparentOuterLayers?: boolean; showLabels?: boolean; autoRotate?: boolean }) {
  try {
    const user = await getOrCreateUser(uid, email);
    const result = await db.insert(presets).values({
      userId: user.id,
      stageId: data.stageId,
      name: data.name,
      sliceAxis: data.sliceAxis || 'none',
      slicePosition: data.slicePosition || 0,
      explodedView: data.explodedView || 0,
      transparentOuterLayers: !!data.transparentOuterLayers,
      showLabels: data.showLabels !== false,
      autoRotate: !!data.autoRotate,
    }).returning();
    return result[0];
  } catch (error) {
    console.error("Failed to create preset:", error);
    throw new Error("Failed to create preset.", { cause: error });
  }
}

export async function deletePreset(uid: string, presetId: number) {
  try {
    await db.delete(presets).where(eq(presets.id, presetId));
    return { success: true };
  } catch (error) {
    console.error("Failed to delete preset:", error);
    throw new Error("Failed to delete preset.", { cause: error });
  }
}

// Progress helpers
export async function getProgressForUser(uid: string) {
  try {
    const user = await getOrCreateUser(uid, '');
    return await db.select().from(stageProgress).where(eq(stageProgress.userId, user.id));
  } catch (error) {
    console.error("Failed to get progress:", error);
    throw new Error("Failed to get progress.", { cause: error });
  }
}

export async function updateProgress(uid: string, email: string, stageId: string, isMastered: boolean) {
  try {
    const user = await getOrCreateUser(uid, email);
    const existing = await db.select().from(stageProgress)
      .where(eq(stageProgress.userId, user.id));
    const current = existing.find(p => p.stageId === stageId);
    
    if (current) {
      const updated = await db.update(stageProgress)
        .set({ isMastered, updatedAt: new Date() })
        .where(eq(stageProgress.id, current.id))
        .returning();
      return updated[0];
    } else {
      const inserted = await db.insert(stageProgress).values({
        userId: user.id,
        stageId,
        isMastered,
      }).returning();
      return inserted[0];
    }
  } catch (error) {
    console.error("Failed to update progress:", error);
    throw new Error("Failed to update progress.", { cause: error });
  }
}

// Discussions
export async function getDiscussions(stageId?: string) {
  try {
    if (stageId) {
      return await db.select().from(discussions)
        .where(eq(discussions.stageId, stageId))
        .orderBy(desc(discussions.createdAt));
    }
    return await db.select().from(discussions).orderBy(desc(discussions.createdAt));
  } catch (error) {
    console.error("Failed to get discussions:", error);
    throw new Error("Failed to get discussions.", { cause: error });
  }
}

export async function createDiscussion(authorUid: string, authorName: string, stageId: string, structureName: string | undefined, content: string) {
  try {
    const result = await db.insert(discussions).values({
      authorUid,
      authorName,
      stageId,
      structureName: structureName || null,
      content,
    }).returning();
    return result[0];
  } catch (error) {
    console.error("Failed to create discussion:", error);
    throw new Error("Failed to create discussion.", { cause: error });
  }
}
