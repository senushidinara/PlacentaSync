import React from 'react';
import { EmbryoStage } from '../types';
import { Calendar, CheckCircle2 } from 'lucide-react';

interface TimelineProps {
  stages: EmbryoStage[];
  currentStageId: string;
  onSelectStage: (id: string) => void;
}

export default function Timeline({ stages, currentStageId, onSelectStage }: TimelineProps) {
  return (
    <div className="relative w-full bg-gray-900/40 border border-gray-800/60 p-4 rounded-2xl backdrop-blur-md">
      
      {/* Timeline Header */}
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
          <Calendar className="text-amber-500" size={16} />
          <h3 className="text-xs font-bold text-gray-200 tracking-wider uppercase font-mono">
            Human Development Timeline (Weeks 1 - 4)
          </h3>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-[10px] font-mono text-gray-400">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 bg-blue-500 rounded-sm inline-block" /> Week 1: Pre-Implantation
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 bg-green-500 rounded-sm inline-block" /> Week 2: Bilaminar Disc
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 bg-rose-500 rounded-sm inline-block" /> Week 3: Trilaminar / Neurulation
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 bg-purple-500 rounded-sm inline-block" /> Week 4: Folding & Organogenesis
          </span>
        </div>
      </div>

      {/* Progress horizontal tracks */}
      <div className="relative flex items-center justify-between gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
        {/* Connection guide line */}
        <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-gray-850 -translate-y-1/2 -z-10 hidden md:block" />

        {stages.map((stage, index) => {
          const isActive = stage.id === currentStageId;
          
          // Determine stage theme color based on week
          let colorClass = 'border-blue-500/20 hover:border-blue-500/50';
          let bgDotClass = 'bg-blue-500';
          let textColorClass = 'text-blue-400';
          let shadowClass = '';

          if (stage.week === 1) {
            colorClass = isActive 
              ? 'border-blue-500 bg-blue-950/20 shadow-[0_0_15px_rgba(59,130,246,0.15)]' 
              : 'border-blue-500/10 hover:border-blue-500/40 bg-gray-950/40';
            bgDotClass = 'bg-blue-500';
            textColorClass = 'text-blue-400';
          } else if (stage.week === 2) {
            colorClass = isActive 
              ? 'border-green-500 bg-green-950/20 shadow-[0_0_15px_rgba(34,197,94,0.15)]' 
              : 'border-green-500/10 hover:border-green-500/40 bg-gray-950/40';
            bgDotClass = 'bg-green-500';
            textColorClass = 'text-green-400';
          } else if (stage.week === 3) {
            colorClass = isActive 
              ? 'border-rose-500 bg-rose-950/20 shadow-[0_0_15px_rgba(239,68,68,0.15)]' 
              : 'border-rose-500/10 hover:border-rose-500/40 bg-gray-950/40';
            bgDotClass = 'bg-rose-500';
            textColorClass = 'text-rose-400';
          } else if (stage.week === 4) {
            colorClass = isActive 
              ? 'border-purple-500 bg-purple-950/20 shadow-[0_0_15px_rgba(168,85,247,0.15)]' 
              : 'border-purple-500/10 hover:border-purple-500/40 bg-gray-950/40';
            bgDotClass = 'bg-purple-500';
            textColorClass = 'text-purple-400';
          }

          return (
            <button
              key={stage.id}
              onClick={() => onSelectStage(stage.id)}
              className={`flex-1 min-w-[145px] max-w-[200px] text-left rounded-xl p-3 border-2 transition-all cursor-pointer ${colorClass}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-[10px] font-mono font-bold uppercase ${textColorClass}`}>
                  Day {stage.day} • Wk {stage.week}
                </span>
                {isActive && (
                  <CheckCircle2 size={12} className={textColorClass} />
                )}
              </div>
              <h4 className="text-xs font-bold text-white truncate">{stage.title.split(': ')[1] || stage.title}</h4>
              <p className="text-[10px] text-gray-400 truncate mt-0.5">{stage.subtitle}</p>

              {/* Progress visual dot indicator */}
              <div className="mt-2.5 flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${bgDotClass} ${isActive ? 'animate-ping' : ''}`} />
                <div className="h-1 bg-gray-800 rounded-full flex-grow overflow-hidden">
                  <div 
                    className={`h-full ${bgDotClass}`} 
                    style={{ width: `${((index + 1) / stages.length) * 100}%` }} 
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
