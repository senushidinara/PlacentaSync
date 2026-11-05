import React, { useState } from 'react';
import { EmbryoStage, SlicingSettings, ViewSettings, StructureLabel, GermLayer } from '../types';
import FirebaseNotesPanel from './FirebaseNotesPanel';
import FirebasePresetsPanel from './FirebasePresetsPanel';
import FirebaseDiscussionPanel from './FirebaseDiscussionPanel';
import { 
  Scissors, 
  RotateCw, 
  Eye, 
  EyeOff, 
  Layers, 
  Info, 
  Activity, 
  TrendingUp, 
  Sparkles,
  RefreshCw,
  BookOpen,
  Camera,
  MessageSquare,
  Microscope
} from 'lucide-react';

interface SidebarProps {
  stage: EmbryoStage;
  slicing: SlicingSettings;
  onChangeSlicing: (slicing: SlicingSettings) => void;
  viewSettings: ViewSettings;
  onChangeViewSettings: (settings: ViewSettings) => void;
  selectedStructureId: string | null;
  onSelectStructure: (id: string | null) => void;
  hoveredStructureId: string | null;
  onHoverStructure: (id: string | null) => void;
  onResetView: () => void;
}

type TabType = 'dissect' | 'notes' | 'presets' | 'discussion';

export default function Sidebar({
  stage,
  slicing,
  onChangeSlicing,
  viewSettings,
  onChangeViewSettings,
  selectedStructureId,
  onSelectStructure,
  hoveredStructureId,
  onHoverStructure,
  onResetView,
}: SidebarProps) {
  const [activeTab, setActiveTab] = useState<TabType>('dissect');

  // Find selected structure details
  const selectedStructure = stage.structures.find((s) => s.id === selectedStructureId);

  // Helper to get Germ Layer Styling
  const getGermLayerStyle = (layer: GermLayer) => {
    switch (layer) {
      case GermLayer.Ectoderm:
        return {
          bg: 'bg-blue-950/40 border-blue-800 text-blue-300',
          dot: 'bg-blue-500',
          name: 'Ectoderm (Outer)',
        };
      case GermLayer.Mesoderm:
        return {
          bg: 'bg-rose-950/40 border-rose-800 text-rose-300',
          dot: 'bg-rose-500',
          name: 'Mesoderm (Middle)',
        };
      case GermLayer.Endoderm:
        return {
          bg: 'bg-amber-950/40 border-amber-800 text-amber-300',
          dot: 'bg-amber-500',
          name: 'Endoderm (Inner)',
        };
      case GermLayer.Trophoblast:
        return {
          bg: 'bg-orange-950/40 border-orange-800 text-orange-300',
          dot: 'bg-orange-500',
          name: 'Trophoblast (Placenta)',
        };
      case GermLayer.Extraembryonic:
        return {
          bg: 'bg-purple-950/40 border-purple-800 text-purple-300',
          dot: 'bg-purple-500',
          name: 'Extraembryonic Structures',
        };
      default:
        return {
          bg: 'bg-gray-900 border-gray-700 text-gray-300',
          dot: 'bg-gray-400',
          name: 'Undifferentiated / Other',
        };
    }
  };

  return (
    <div className="flex flex-col gap-4 h-full text-gray-200">
      
      {/* Tab Navigation Controls */}
      <div className="grid grid-cols-4 gap-1 bg-gray-900/80 p-1.5 rounded-2xl border border-gray-800 backdrop-blur-md">
        <button
          onClick={() => setActiveTab('dissect')}
          className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2 px-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'dissect'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
          }`}
          title="3D Dissection and Anatomy"
        >
          <Microscope size={14} />
          <span className="hidden xs:inline">Anatomy</span>
        </button>

        <button
          onClick={() => setActiveTab('notes')}
          className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2 px-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'notes'
              ? 'bg-amber-600 text-white shadow-md'
              : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
          }`}
          title="Personal Lab & Research Notes"
        >
          <BookOpen size={14} />
          <span className="hidden xs:inline">Notes</span>
        </button>

        <button
          onClick={() => setActiveTab('presets')}
          className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2 px-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'presets'
              ? 'bg-cyan-600 text-white shadow-md'
              : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
          }`}
          title="Saved 3D View Snapshots"
        >
          <Camera size={14} />
          <span className="hidden xs:inline">Views</span>
        </button>

        <button
          onClick={() => setActiveTab('discussion')}
          className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2 px-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'discussion'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
          }`}
          title="Peer Discussion & Q&A"
        >
          <MessageSquare size={14} />
          <span className="hidden xs:inline">Q&A</span>
        </button>
      </div>

      {/* Tab 1: 3D Anatomy & Dissection View */}
      {activeTab === 'dissect' && (
        <div className="flex flex-col gap-4 animate-fadeIn">
          {/* 1. STAGE DESCRIPTION HEADER */}
          <div className="bg-gray-900/60 border border-gray-800/80 rounded-2xl p-5 shadow-lg backdrop-blur-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold px-2.5 py-1 bg-amber-500/10 text-amber-400 rounded-full border border-amber-500/20 font-mono">
                WEEK {stage.week} • DAY {stage.day}
              </span>
              <button 
                onClick={onResetView}
                className="text-gray-400 hover:text-white transition-colors p-1.5 hover:bg-gray-800 rounded-lg flex items-center gap-1 text-[11px] font-mono border border-gray-800 hover:border-gray-700 cursor-pointer"
                title="Reset 3D camera to default orientation"
              >
                <RefreshCw size={12} />
                RESET CAMERA
              </button>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight leading-snug">{stage.title}</h2>
            <p className="text-xs text-indigo-400 font-medium mb-3 tracking-wide uppercase">{stage.subtitle}</p>
            <p className="text-xs text-gray-300 leading-relaxed font-sans">{stage.overview}</p>
            
            {/* Educational Insight box */}
            <div className="mt-4 bg-indigo-950/20 border border-indigo-900/30 rounded-xl p-3 flex gap-2.5">
              <Sparkles className="text-indigo-400 shrink-0 mt-0.5" size={14} />
              <div>
                <h4 className="text-[10px] font-semibold text-indigo-300 uppercase tracking-widest font-mono">Educational Insight</h4>
                <p className="text-[11px] text-indigo-200 leading-relaxed mt-0.5">{stage.educationalInsight}</p>
              </div>
            </div>
          </div>

          {/* 2. SLICING / CUTTING ENGINE */}
          <div className="bg-gray-900/60 border border-gray-800/80 rounded-2xl p-5 shadow-lg backdrop-blur-md">
            <div className="flex items-center gap-2 mb-3.5 pb-2 border-b border-gray-800/60">
              <Scissors className="text-rose-500" size={18} />
              <h3 className="text-sm font-bold text-white tracking-wide uppercase">3D Slicing & Cross-Section</h3>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-300">Enable Slicing Plane</span>
                <button
                  onClick={() => onChangeSlicing({ ...slicing, enabled: !slicing.enabled })}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    slicing.enabled ? 'bg-rose-500' : 'bg-gray-800'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      slicing.enabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {slicing.enabled && (
                <div className="flex flex-col gap-4 pt-1 animate-fadeIn">
                  {/* Plane Orientation selection */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest font-mono">Slicing Orientation</span>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(['sagittal', 'transverse', 'coronal'] as const).map((plane) => (
                        <button
                          key={plane}
                          onClick={() => onChangeSlicing({ ...slicing, plane })}
                          className={`py-1.5 text-center rounded-lg text-xs font-mono font-medium border capitalize transition-all cursor-pointer ${
                            slicing.plane === plane
                              ? 'bg-rose-950/40 border-rose-500 text-rose-300 font-bold'
                              : 'bg-gray-950 border-gray-800 hover:border-gray-700 text-gray-400'
                          }`}
                        >
                          {plane}
                        </button>
                      ))}
                    </div>
                    <p className="text-[9px] text-gray-500 leading-normal mt-0.5">
                      {slicing.plane === 'sagittal' && 'Sagittal: Cuts vertically dividing Left and Right halves.'}
                      {slicing.plane === 'transverse' && 'Transverse: Cuts horizontally dividing Upper and Lower.'}
                      {slicing.plane === 'coronal' && 'Coronal: Cuts vertically dividing Front and Back.'}
                    </p>
                  </div>

                  {/* Slicing depth slider */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-[10px] font-mono font-semibold text-gray-400">
                      <span className="uppercase tracking-widest">Slice Depth</span>
                      <span className="text-rose-400">{(slicing.depth * 100).toFixed(0)}%</span>
                    </div>
                    <input
                      type="range"
                      min="-1.1"
                      max="1.1"
                      step="0.05"
                      value={slicing.depth}
                      onChange={(e) => onChangeSlicing({ ...slicing, depth: parseFloat(e.target.value) })}
                      className="w-full accent-rose-500 bg-gray-950 h-1.5 rounded-lg appearance-none cursor-pointer border border-gray-800"
                    />
                    <div className="flex justify-between text-[9px] text-gray-500 font-mono">
                      <span>OUTER EDGE</span>
                      <span>MIDPOINT</span>
                      <span>OUTER EDGE</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 3. VISUALIZATION CONTROLS */}
          <div className="bg-gray-900/60 border border-gray-800/80 rounded-2xl p-5 shadow-lg backdrop-blur-md">
            <div className="flex items-center gap-2 mb-3.5 pb-2 border-b border-gray-800/60">
              <Layers className="text-indigo-400" size={18} />
              <h3 className="text-sm font-bold text-white tracking-wide uppercase">Visualization Options</h3>
            </div>

            <div className="flex flex-col gap-3">
              {/* Transparent Outer Cells */}
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-gray-200">See-Through Outer Cells</span>
                  <span className="text-[10px] text-gray-400">Makes protective membranes translucent to reveal interior</span>
                </div>
                <button
                  onClick={() => onChangeViewSettings({ ...viewSettings, transparentOuterLayers: !viewSettings.transparentOuterLayers })}
                  className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                    viewSettings.transparentOuterLayers
                      ? 'bg-indigo-950/40 border-indigo-500 text-indigo-300'
                      : 'bg-gray-950 border-gray-800 text-gray-400 hover:border-gray-700'
                  }`}
                >
                  {viewSettings.transparentOuterLayers ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              </div>

              {/* Exploded View */}
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-gray-200">Exploded Anatomical View</span>
                  <span className="text-[10px] text-gray-400">Separates cell layers outwards to inspect gaps</span>
                </div>
                <button
                  onClick={() => onChangeViewSettings({ ...viewSettings, explodedView: !viewSettings.explodedView })}
                  className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                    viewSettings.explodedView
                      ? 'bg-indigo-950/40 border-indigo-500 text-indigo-300'
                      : 'bg-gray-950 border-gray-800 text-gray-400 hover:border-gray-700'
                  }`}
                >
                  <Activity size={16} />
                </button>
              </div>

              {/* Auto rotate */}
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-gray-200">Slow 3D Orbit Rotator</span>
                  <span className="text-[10px] text-gray-400">Continuously rotates the model for spatial depth</span>
                </div>
                <button
                  onClick={() => onChangeViewSettings({ ...viewSettings, autoRotate: !viewSettings.autoRotate })}
                  className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                    viewSettings.autoRotate
                      ? 'bg-indigo-950/40 border-indigo-500 text-indigo-300'
                      : 'bg-gray-950 border-gray-800 text-gray-400 hover:border-gray-700'
                  }`}
                >
                  <RotateCw size={16} className={viewSettings.autoRotate ? 'animate-spin' : ''} style={{ animationDuration: '6s' }} />
                </button>
              </div>

              {/* Label Visibility */}
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-gray-200">Anatomical Marker Flags</span>
                  <span className="text-[10px] text-gray-400">Renders clickable flag pointers in 3D scene</span>
                </div>
                <button
                  onClick={() => onChangeViewSettings({ ...viewSettings, showLabels: !viewSettings.showLabels })}
                  className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                    viewSettings.showLabels
                      ? 'bg-indigo-950/40 border-indigo-500 text-indigo-300'
                      : 'bg-gray-950 border-gray-800 text-gray-400 hover:border-gray-700'
                  }`}
                >
                  {viewSettings.showLabels ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              </div>
            </div>
          </div>

          {/* 4. SELECTED ANATOMICAL STRUCTURE EXPLORER */}
          <div className="bg-gray-900/60 border border-gray-800/80 rounded-2xl p-5 shadow-lg backdrop-blur-md grow flex flex-col min-h-[160px]">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-800/60">
              <Info className="text-amber-500" size={18} />
              <h3 className="text-sm font-bold text-white tracking-wide uppercase">Anatomical Detail</h3>
            </div>

            {selectedStructure ? (
              <div className="flex flex-col gap-3 h-full animate-fadeIn">
                <div>
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full border border-white" style={{ backgroundColor: selectedStructure.color }} />
                    {selectedStructure.name}
                  </h4>
                  
                  {/* Germ Layer details */}
                  <div className="mt-1.5">
                    <span className={`inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${getGermLayerStyle(selectedStructure.germLayer).bg}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${getGermLayerStyle(selectedStructure.germLayer).dot}`} />
                      {getGermLayerStyle(selectedStructure.germLayer).name}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-gray-300 leading-relaxed font-sans mt-1">
                  {selectedStructure.description}
                </p>
              </div>
            ) : (
              <div className="flex-grow flex flex-col items-center justify-center text-center p-4 bg-gray-950/40 border border-gray-800/60 rounded-xl border-dashed">
                <span className="text-gray-500 text-2xl">🔬</span>
                <p className="text-xs font-semibold text-gray-400 mt-2">No Structure Selected</p>
                <p className="text-[10px] text-gray-500 mt-1 max-w-[200px] leading-relaxed">
                  Hover over or click on any of the neon indicator flags in the 3D canvas or select a layer to investigate its role.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Firebase Notes */}
      {activeTab === 'notes' && (
        <div className="animate-fadeIn">
          <FirebaseNotesPanel
            stage={stage}
            selectedStructureId={selectedStructureId}
          />
        </div>
      )}

      {/* Tab 3: Firebase View Presets */}
      {activeTab === 'presets' && (
        <div className="animate-fadeIn">
          <FirebasePresetsPanel
            stage={stage}
            slicing={slicing}
            onChangeSlicing={onChangeSlicing}
            viewSettings={viewSettings}
            onChangeViewSettings={onChangeViewSettings}
          />
        </div>
      )}

      {/* Tab 4: Firebase Discussions */}
      {activeTab === 'discussion' && (
        <div className="animate-fadeIn">
          <FirebaseDiscussionPanel
            stage={stage}
            selectedStructureId={selectedStructureId}
          />
        </div>
      )}

    </div>
  );
}
