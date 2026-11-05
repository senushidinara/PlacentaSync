import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { requireAuth, AuthRequest } from './src/middleware/auth.ts';
import { getOrCreateUser } from './src/db/users.ts';
import { 
  getNotesForUser, 
  createNote, 
  deleteNote, 
  getPresetsForUser, 
  createPreset, 
  deletePreset, 
  getProgressForUser, 
  updateProgress, 
  getDiscussions, 
  createDiscussion 
} from './src/db/helpers.ts';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // User auth sync / profile
  app.post('/api/auth/sync', requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user?.uid;
      const email = req.user?.email || '';
      const name = req.body?.displayName || req.user?.name || '';
      if (!uid) {
        return res.status(400).json({ error: 'Missing UID' });
      }
      const user = await getOrCreateUser(uid, email, name);
      res.json({ status: 'synced', user });
    } catch (error: any) {
      console.error('Failed to sync user:', error);
      res.status(500).json({ error: error.message || 'Failed to sync user' });
    }
  });

  // Notes API
  app.get('/api/notes', requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user?.uid!;
      const notesList = await getNotesForUser(uid);
      res.json(notesList);
    } catch (error: any) {
      console.error('Failed to fetch notes:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch notes' });
    }
  });

  app.post('/api/notes', requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user?.uid!;
      const email = req.user?.email || '';
      const { stageId, title, content, tag, structureId } = req.body;
      if (!stageId || !title || !content) {
        return res.status(400).json({ error: 'Missing required note fields' });
      }
      const note = await createNote(uid, email, { stageId, title, content, tag, structureId });
      res.json(note);
    } catch (error: any) {
      console.error('Failed to create note:', error);
      res.status(500).json({ error: error.message || 'Failed to create note' });
    }
  });

  app.delete('/api/notes/:id', requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user?.uid!;
      const noteId = parseInt(req.params.id, 10);
      const result = await deleteNote(uid, noteId);
      res.json(result);
    } catch (error: any) {
      console.error('Failed to delete note:', error);
      res.status(500).json({ error: error.message || 'Failed to delete note' });
    }
  });

  // Presets API
  app.get('/api/presets', requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user?.uid!;
      const presetsList = await getPresetsForUser(uid);
      res.json(presetsList);
    } catch (error: any) {
      console.error('Failed to fetch presets:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch presets' });
    }
  });

  app.post('/api/presets', requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user?.uid!;
      const email = req.user?.email || '';
      const preset = await createPreset(uid, email, req.body);
      res.json(preset);
    } catch (error: any) {
      console.error('Failed to create preset:', error);
      res.status(500).json({ error: error.message || 'Failed to create preset' });
    }
  });

  app.delete('/api/presets/:id', requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user?.uid!;
      const presetId = parseInt(req.params.id, 10);
      const result = await deletePreset(uid, presetId);
      res.json(result);
    } catch (error: any) {
      console.error('Failed to delete preset:', error);
      res.status(500).json({ error: error.message || 'Failed to delete preset' });
    }
  });

  // Stage Progress API
  app.get('/api/progress', requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user?.uid!;
      const progress = await getProgressForUser(uid);
      res.json(progress);
    } catch (error: any) {
      console.error('Failed to fetch progress:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch progress' });
    }
  });

  app.post('/api/progress', requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user?.uid!;
      const email = req.user?.email || '';
      const { stageId, isMastered } = req.body;
      const progress = await updateProgress(uid, email, stageId, isMastered);
      res.json(progress);
    } catch (error: any) {
      console.error('Failed to update progress:', error);
      res.status(500).json({ error: error.message || 'Failed to update progress' });
    }
  });

  // Discussions API
  app.get('/api/discussions', async (req, res) => {
    try {
      const stageId = req.query.stageId as string | undefined;
      const list = await getDiscussions(stageId);
      res.json(list);
    } catch (error: any) {
      console.error('Failed to fetch discussions:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch discussions' });
    }
  });

  app.post('/api/discussions', requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user?.uid!;
      const name = req.user?.name || req.user?.email?.split('@')[0] || 'Peer Scholar';
      const { stageId, structureName, content } = req.body;
      if (!stageId || !content) {
        return res.status(400).json({ error: 'Missing required discussion fields' });
      }
      const item = await createDiscussion(uid, name, stageId, structureName, content);
      res.json(item);
    } catch (error: any) {
      console.error('Failed to create discussion:', error);
      res.status(500).json({ error: error.message || 'Failed to create discussion' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
