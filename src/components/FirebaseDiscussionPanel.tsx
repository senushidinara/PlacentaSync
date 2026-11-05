import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { EmbryoStage, DiscussionPost } from '../types';
import { subscribeDiscussions, addDiscussionPost, deleteDiscussionPost } from '../services/discussionsService';
import { 
  MessageSquare, 
  Send, 
  Trash2, 
  LogIn, 
  User, 
  Clock, 
  Sparkles,
  HelpCircle
} from 'lucide-react';

interface DiscussionPanelProps {
  stage: EmbryoStage;
  selectedStructureId: string | null;
}

export default function FirebaseDiscussionPanel({ stage, selectedStructureId }: DiscussionPanelProps) {
  const { user, signInWithGoogle } = useAuth();
  const [posts, setPosts] = useState<DiscussionPost[]>([]);
  const [content, setContent] = useState<string>('');
  const [structureTag, setStructureTag] = useState<string>('');
  const [isPosting, setIsPosting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeDiscussions(
      stage.id,
      (newPosts) => {
        setPosts(newPosts);
      },
      (err) => {
        console.error('Discussion subscribe error:', err);
      }
    );

    return () => unsubscribe();
  }, [stage.id]);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!content.trim() || content.trim().length < 3) {
      setErrorMsg('Please enter a question or comment (min 3 characters).');
      return;
    }

    try {
      setIsPosting(true);
      setErrorMsg(null);
      const postId = `post_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const now = new Date().toISOString();

      const newPost: DiscussionPost = {
        id: postId,
        authorId: user.uid,
        authorName: user.displayName || user.email?.split('@')[0] || 'Medical Student',
        stageId: stage.id,
        structureName: structureTag || undefined,
        content: content.trim().substring(0, 1000),
        createdAt: now,
      };

      await addDiscussionPost(newPost);
      setContent('');
      setStructureTag('');
    } catch (err: any) {
      console.error('Error posting discussion:', err);
      setErrorMsg('Failed to post. Check connection.');
    } finally {
      setIsPosting(false);
    }
  };

  const handleDelete = async (postId: string) => {
    if (!user) return;
    try {
      await deleteDiscussionPost(postId);
    } catch (err) {
      console.error('Error deleting discussion post:', err);
    }
  };

  return (
    <div className="bg-gray-900/60 border border-gray-800/80 rounded-2xl p-5 shadow-lg backdrop-blur-md flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-800/60">
        <div className="flex items-center gap-2">
          <MessageSquare className="text-purple-400" size={18} />
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide uppercase">Peer Q&A & Clinical Discussion</h3>
            <span className="text-[10px] text-gray-400 font-mono">Community questions for {stage.title.split(':')[0]}</span>
          </div>
        </div>
        <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-purple-950/60 border border-purple-800/60 text-purple-300">
          {posts.length} {posts.length === 1 ? 'post' : 'posts'}
        </span>
      </div>

      {/* Post Submission Box */}
      {user ? (
        <form onSubmit={handlePost} className="bg-gray-950/80 border border-gray-800 rounded-xl p-3.5 flex flex-col gap-2.5">
          {errorMsg && (
            <div className="p-2 bg-rose-950/60 border border-rose-800 text-rose-300 text-xs rounded-lg">
              {errorMsg}
            </div>
          )}

          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-mono text-gray-400 uppercase">
              Posting as <strong className="text-purple-300">{user.displayName || user.email?.split('@')[0]}</strong>
            </span>
            <select
              value={structureTag}
              onChange={(e) => setStructureTag(e.target.value)}
              className="bg-gray-900 border border-gray-800 rounded-lg px-2 py-1 text-[11px] text-gray-300 focus:outline-none focus:border-purple-500 cursor-pointer"
            >
              <option value="">Tag: Whole Embryo</option>
              {stage.structures.map((s) => (
                <option key={s.id} value={s.name}>{s.name}</option>
              ))}
            </select>
          </div>

          <div className="relative">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Ask a question or share a clinical insight about this developmental stage..."
              rows={3}
              className="w-full bg-gray-900 border border-gray-800 rounded-lg p-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 leading-relaxed resize-none"
              maxLength={1000}
              required
            />
          </div>

          <div className="flex justify-between items-center">
            <span className="text-[10px] text-gray-500 font-mono">
              {content.length}/1000 chars
            </span>
            <button
              type="submit"
              disabled={isPosting || !content.trim()}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white shadow-md transition-all disabled:opacity-50 cursor-pointer"
            >
              <Send size={12} />
              <span>{isPosting ? 'Posting...' : 'Post Question'}</span>
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-gray-950/60 border border-gray-800 rounded-xl p-4 text-center flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-left">
            <h4 className="text-xs font-bold text-white">Join the Stage Discussion</h4>
            <p className="text-[11px] text-gray-400">Sign in with Google to post questions or answer peer observations.</p>
          </div>
          <button
            onClick={() => signInWithGoogle()}
            className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg shadow-md cursor-pointer shrink-0"
          >
            <LogIn size={13} />
            <span>Sign In to Post</span>
          </button>
        </div>
      )}

      {/* Discussions Feed */}
      <div className="flex flex-col gap-2.5 max-h-[350px] overflow-y-auto pr-1">
        {posts.length === 0 ? (
          <div className="text-center py-6 text-xs text-gray-500 border border-dashed border-gray-800/80 rounded-xl p-4">
            <p>No questions posted for {stage.title.split(':')[0]} yet.</p>
            <p className="text-[10px] text-gray-600 mt-1">Be the first student or researcher to start the discussion!</p>
          </div>
        ) : (
          posts.map((post) => {
            const isAuthor = user?.uid === post.authorId;
            return (
              <div
                key={post.id}
                className="bg-gray-950/50 border border-gray-800/80 rounded-xl p-3.5 flex flex-col gap-2 hover:border-gray-700 transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-purple-950 border border-purple-800 text-purple-300 flex items-center justify-center text-[10px] font-bold">
                      {post.authorName.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs font-semibold text-gray-200">{post.authorName}</span>
                    {post.structureName && (
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-indigo-950/80 border border-indigo-800 text-indigo-300">
                        {post.structureName}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[9px] text-gray-500 font-mono">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                    {isAuthor && (
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="p-1 text-gray-500 hover:text-rose-400 transition-colors"
                        title="Delete your post"
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-xs text-gray-300 leading-relaxed font-sans pl-8">
                  {post.content}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
