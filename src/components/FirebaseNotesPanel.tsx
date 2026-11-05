import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { EmbryoStage, StudyNote } from '../types';
import { subscribeUserNotes, saveStudyNote, deleteStudyNote } from '../services/notesService';
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  X, 
  Tag, 
  LogIn, 
  Calendar, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';

interface NotesPanelProps {
  stage: EmbryoStage;
  selectedStructureId: string | null;
}

const TAG_OPTIONS = ['General', 'Anatomy', 'Clinical', 'Exam Prep', 'Molecular/Genetics'];

export default function FirebaseNotesPanel({ stage, selectedStructureId }: NotesPanelProps) {
  const { user, signInWithGoogle } = useAuth();
  const [notes, setNotes] = useState<StudyNote[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [tag, setTag] = useState<string>('Anatomy');
  const [structureId, setStructureId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Subscribe to notes when user or stage changes
  useEffect(() => {
    if (!user) {
      setNotes([]);
      return;
    }

    const unsubscribe = subscribeUserNotes(
      user.uid,
      (allNotes) => {
        // Filter notes for the current stage
        const stageNotes = allNotes.filter((n) => n.stageId === stage.id);
        setNotes(stageNotes);
      },
      (err) => {
        console.error('Notes subscription error:', err);
      }
    );

    return () => unsubscribe();
  }, [user, stage.id]);

  const handleStartNew = () => {
    setEditingId(null);
    setTitle('');
    setContent('');
    setTag('Anatomy');
    setStructureId(selectedStructureId || (stage.structures[0]?.id || ''));
    setIsEditing(true);
    setErrorMsg(null);
  };

  const handleStartEdit = (note: StudyNote) => {
    setEditingId(note.id);
    setTitle(note.title);
    setContent(note.content);
    setTag(note.tag || 'Anatomy');
    setStructureId(note.structureId || '');
    setIsEditing(true);
    setErrorMsg(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingId(null);
    setTitle('');
    setContent('');
    setErrorMsg(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!title.trim() || !content.trim()) {
      setErrorMsg('Please enter both a title and notes content.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg(null);
      const noteId = editingId || `note_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const now = new Date().toISOString();

      const existingNote = notes.find((n) => n.id === noteId);

      const noteData: StudyNote = {
        id: noteId,
        userId: user.uid,
        stageId: stage.id,
        title: title.trim().substring(0, 120),
        content: content.trim().substring(0, 3000),
        tag: tag || 'General',
        structureId: structureId || undefined,
        createdAt: existingNote ? existingNote.createdAt : now,
        updatedAt: now,
      };

      await saveStudyNote(noteData);
      setIsEditing(false);
      setEditingId(null);
      setTitle('');
      setContent('');
    } catch (err: any) {
      console.error('Error saving note:', err);
      setErrorMsg('Failed to save note to Firestore. Check permissions.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (noteId: string) => {
    if (!user) return;
    if (!confirm('Are you sure you want to delete this study note?')) return;
    try {
      await deleteStudyNote(user.uid, noteId);
    } catch (err) {
      console.error('Error deleting note:', err);
    }
  };

  if (!user) {
    return (
      <div className="bg-gray-900/60 border border-gray-800/80 rounded-2xl p-6 text-center backdrop-blur-md">
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-3">
          <BookOpen size={22} />
        </div>
        <h3 className="text-sm font-bold text-white mb-1">Personal Embryology Lab Notes</h3>
        <p className="text-xs text-gray-400 mb-4 max-w-xs mx-auto leading-relaxed">
          Sign in with Google to save private clinical annotations, exam flashcards, and structure research directly to Firebase Cloud.
        </p>
        <button
          onClick={() => signInWithGoogle()}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-md cursor-pointer"
        >
          <LogIn size={14} />
          <span>Sign In to Enable Notes</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/60 border border-gray-800/80 rounded-2xl p-5 shadow-lg backdrop-blur-md flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-800/60">
        <div className="flex items-center gap-2">
          <BookOpen className="text-amber-400" size={18} />
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide uppercase">Stage Lab Notes</h3>
            <span className="text-[10px] text-gray-400 font-mono">Cloud-synced for {stage.title.split(':')[0]}</span>
          </div>
        </div>
        {!isEditing && (
          <button
            onClick={handleStartNew}
            className="flex items-center gap-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold px-3 py-1.5 rounded-xl transition-all cursor-pointer"
          >
            <Plus size={13} />
            <span>Add Note</span>
          </button>
        )}
      </div>

      {/* Edit Form */}
      {isEditing && (
        <form onSubmit={handleSave} className="bg-gray-950/80 border border-gray-800 rounded-xl p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400 font-mono uppercase">
              {editingId ? 'Edit Study Note' : 'New Research Annotation'}
            </span>
            <button
              type="button"
              onClick={handleCancel}
              className="text-gray-400 hover:text-white p-1"
            >
              <X size={14} />
            </button>
          </div>

          {errorMsg && (
            <div className="p-2 bg-rose-950/60 border border-rose-800 text-rose-300 text-xs rounded-lg">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-[10px] font-mono uppercase text-gray-400 mb-1">Note Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Zona Pellucida hatching mechanics"
              className="w-full bg-gray-900 border border-gray-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-amber-500"
              maxLength={120}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-mono uppercase text-gray-400 mb-1">Category Tag</label>
              <select
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="w-full bg-gray-900 border border-gray-800 rounded-lg px-2.5 py-1.5 text-xs text-gray-200 focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                {TAG_OPTIONS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-mono uppercase text-gray-400 mb-1">Link Structure</label>
              <select
                value={structureId}
                onChange={(e) => setStructureId(e.target.value)}
                className="w-full bg-gray-900 border border-gray-800 rounded-lg px-2.5 py-1.5 text-xs text-gray-200 focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="">(None / Whole Embryo)</option>
                {stage.structures.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase text-gray-400 mb-1">Observation / Notes Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write clinical observations, exam mnemonics, or cell differentiation notes..."
              rows={4}
              className="w-full bg-gray-900 border border-gray-800 rounded-lg p-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-amber-500 leading-relaxed resize-none"
              maxLength={3000}
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={handleCancel}
              className="px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-white border border-gray-800 hover:border-gray-700 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-white shadow-md disabled:opacity-50 cursor-pointer"
            >
              <Save size={13} />
              <span>{isSubmitting ? 'Saving...' : 'Save to Cloud'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Notes List */}
      <div className="flex flex-col gap-2.5 max-h-[350px] overflow-y-auto pr-1">
        {notes.length === 0 && !isEditing ? (
          <div className="text-center py-6 text-xs text-gray-500 border border-dashed border-gray-800/80 rounded-xl p-4">
            <p>No study notes saved for {stage.title.split(':')[0]} yet.</p>
            <button
              onClick={handleStartNew}
              className="mt-2 text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer underline"
            >
              Create your first note
            </button>
          </div>
        ) : (
          notes.map((note) => {
            const linkedStructure = stage.structures.find((s) => s.id === note.structureId);
            return (
              <div
                key={note.id}
                className="bg-gray-950/50 border border-gray-800/80 rounded-xl p-3.5 flex flex-col gap-2 hover:border-gray-700 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-bold text-white">{note.title}</h4>
                    <div className="flex flex-wrap items-center gap-1.5 mt-1">
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-amber-950/60 border border-amber-800/60 text-amber-300">
                        {note.tag || 'General'}
                      </span>
                      {linkedStructure && (
                        <span 
                          className="text-[9px] font-mono px-2 py-0.5 rounded-full border"
                          style={{ borderColor: `${linkedStructure.color}40`, color: linkedStructure.color, backgroundColor: `${linkedStructure.color}15` }}
                        >
                          {linkedStructure.name}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleStartEdit(note)}
                      className="p-1 text-gray-400 hover:text-amber-400 rounded hover:bg-gray-800 transition-colors cursor-pointer"
                      title="Edit note"
                    >
                      <Edit3 size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(note.id)}
                      className="p-1 text-gray-400 hover:text-rose-400 rounded hover:bg-gray-800 transition-colors cursor-pointer"
                      title="Delete note"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-gray-300 leading-relaxed whitespace-pre-wrap font-sans">
                  {note.content}
                </p>

                <div className="text-[9px] text-gray-500 font-mono mt-1 pt-1.5 border-t border-gray-900 flex justify-between">
                  <span>Updated: {new Date(note.updatedAt).toLocaleDateString()}</span>
                  <span className="text-emerald-500 flex items-center gap-1">
                    <CheckCircle2 size={10} /> Saved to Firestore
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
