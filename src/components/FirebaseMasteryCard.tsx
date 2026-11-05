import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { EmbryoStage, StageProgress } from '../types';
import { subscribeUserProgress, setStageMastery } from '../services/progressService';
import { 
  GraduationCap, 
  CheckCircle2, 
  Award, 
  HelpCircle, 
  ChevronRight, 
  RotateCcw,
  Sparkles,
  LogIn
} from 'lucide-react';

interface MasteryCardProps {
  stage: EmbryoStage;
}

export default function FirebaseMasteryCard({ stage }: MasteryCardProps) {
  const { user, signInWithGoogle } = useAuth();
  const [progressMap, setProgressMap] = useState<Record<string, StageProgress>>({});
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  // Subscribe to progress
  useEffect(() => {
    if (!user) {
      setProgressMap({});
      return;
    }

    const unsubscribe = subscribeUserProgress(
      user.uid,
      (map) => {
        setProgressMap(map);
      },
      (err) => {
        console.error('Progress subscribe error:', err);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const currentProgress = progressMap[stage.id];
  const isMastered = !!currentProgress?.isMastered;

  const toggleMastery = async () => {
    if (!user) return;
    try {
      setIsUpdating(true);
      await setStageMastery(user.uid, stage.id, !isMastered, 100);
    } catch (err) {
      console.error('Error updating mastery:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const masteredCount = (Object.values(progressMap) as StageProgress[]).filter((p) => p.isMastered).length;

  if (!user) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-emerald-950/30 to-indigo-950/30 border border-emerald-900/40 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div className={`p-2.5 rounded-xl border ${isMastered ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' : 'bg-gray-900 border-gray-800 text-gray-400'}`}>
          <GraduationCap size={20} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Stage Learning Mastery
            </h4>
            <span className="text-[10px] bg-emerald-950 border border-emerald-800 text-emerald-300 px-2 py-0.5 rounded-full font-mono font-semibold">
              {masteredCount}/7 Stages Mastered
            </span>
          </div>
          <p className="text-xs text-gray-300 mt-0.5">
            {isMastered 
              ? `You've marked ${stage.title.split(':')[0]} as mastered. Saved to your Firebase student profile.` 
              : `Review the anatomical keypoints and cross-sections for ${stage.title.split(':')[0]} and mark as complete.`}
          </p>
        </div>
      </div>

      <button
        onClick={toggleMastery}
        disabled={isUpdating}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md shrink-0 ${
          isMastered
            ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
            : 'bg-gray-900 hover:bg-gray-850 text-gray-300 border border-gray-700 hover:border-gray-600'
        }`}
      >
        <CheckCircle2 size={15} className={isMastered ? 'text-white' : 'text-gray-400'} />
        <span>{isMastered ? 'Mastered ✓' : 'Mark as Mastered'}</span>
      </button>
    </div>
  );
}
