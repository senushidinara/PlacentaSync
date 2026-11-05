import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogIn, LogOut, Cloud, CloudCheck, User as UserIcon, AlertCircle } from 'lucide-react';

export default function HeaderAuth() {
  const { user, loading, signInWithGoogle, signOutUser, firestoreConnected, authError, clearAuthError } = useAuth();

  return (
    <div className="flex items-center gap-3">
      {/* Cloud DB Status indicator */}
      <div 
        className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono border ${
          firestoreConnected 
            ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-400' 
            : 'bg-amber-950/40 border-amber-800/60 text-amber-400'
        }`}
        title={firestoreConnected ? 'Connected to Firebase Firestore' : 'Checking Firestore connection'}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${firestoreConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
        <span>{firestoreConnected ? 'Cloud Synced' : 'Syncing'}</span>
      </div>

      {authError && (
        <div className="flex items-center gap-1.5 bg-rose-950/80 border border-rose-800 text-rose-300 text-xs px-2.5 py-1 rounded-lg">
          <AlertCircle size={13} />
          <span className="truncate max-w-[150px]">{authError}</span>
          <button onClick={clearAuthError} className="text-rose-400 hover:text-white ml-1 text-xs">×</button>
        </div>
      )}

      {loading ? (
        <div className="h-8 w-24 bg-gray-800 animate-pulse rounded-lg" />
      ) : user ? (
        <div className="flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-xl px-2.5 py-1">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName || 'User'}
              className="w-6 h-6 rounded-full border border-indigo-500/50 object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white">
              {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
            </div>
          )}
          <div className="hidden md:flex flex-col text-left">
            <span className="text-xs font-semibold text-gray-200 leading-tight truncate max-w-[120px]">
              {user.displayName || user.email?.split('@')[0]}
            </span>
            <span className="text-[9px] text-emerald-400 font-mono leading-none">Firebase Active</span>
          </div>
          <button
            onClick={() => signOutUser()}
            className="p-1.5 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-rose-400 transition-colors ml-1 cursor-pointer"
            title="Sign out of Firebase"
          >
            <LogOut size={14} />
          </button>
        </div>
      ) : (
        <button
          onClick={() => signInWithGoogle()}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3.5 py-1.5 rounded-xl shadow-md transition-all cursor-pointer hover:shadow-indigo-500/20 active:scale-95"
        >
          <LogIn size={14} />
          <span>Sign In</span>
        </button>
      )}
    </div>
  );
}
