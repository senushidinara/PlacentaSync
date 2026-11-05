import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { EmbryoStage, SlicingSettings, ViewSettings, CustomPreset } from '../types';
import { subscribeUserPresets, saveCustomPreset, deleteCustomPreset } from '../services/presetsService';
import { 
  Camera, 
  Plus, 
  Trash2, 
  Play, 
  Check, 
  LogIn, 
  Scissors, 
  Layers, 
  Sparkles,
  Sliders
} from 'lucide-react';

interface PresetsPanelProps {
  stage: EmbryoStage;
  slicing: SlicingSettings;
  onChangeSlicing: (slicing: SlicingSettings) => void;
  viewSettings: ViewSettings;
  onChangeViewSettings: (settings: ViewSettings) => void;
}

export default function FirebasePresetsPanel({
  stage,
  slicing,
  onChangeSlicing,
  viewSettings,
  onChangeViewSettings,
}: PresetsPanelProps) {
  const { user, signInWithGoogle } = useAuth();
  const [presets, setPresets] = useState<CustomPreset[]>([]);
  const [presetName, setPresetName] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [showSaveInput, setShowSaveInput] = useState<boolean>(false);
  const [activeAppliedId, setActiveAppliedId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setPresets([]);
      return;
    }

    const unsubscribe = subscribeUserPresets(
      user.uid,
      (allPresets) => {
        const stagePresets = allPresets.filter((p) => p.stageId === stage.id);
        setPresets(stagePresets);
      },
      (err) => {
        console.error('Presets subscription error:', err);
      }
    );

    return () => unsubscribe();
  }, [user, stage.id]);

  const handleSaveCurrentView = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!presetName.trim()) return;

    try {
      setIsSaving(true);
      const presetId = `preset_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const now = new Date().toISOString();

      const newPreset: CustomPreset = {
        id: presetId,
        userId: user.uid,
        stageId: stage.id,
        name: presetName.trim().substring(0, 80),
        sliceAxis: slicing.enabled ? (slicing.plane === 'sagittal' ? 'x' : slicing.plane === 'transverse' ? 'y' : 'z') : 'none',
        slicePosition: slicing.depth,
        explodedView: viewSettings.explodedView ? 0.8 : 0.0,
        transparentOuterLayers: viewSettings.transparentOuterLayers,
        showLabels: viewSettings.showLabels,
        autoRotate: viewSettings.autoRotate,
        createdAt: now,
        updatedAt: now,
      };

      await saveCustomPreset(newPreset);
      setPresetName('');
      setShowSaveInput(false);
    } catch (err) {
      console.error('Error saving preset:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleApplyPreset = (preset: CustomPreset) => {
    setActiveAppliedId(preset.id);
    
    // Apply slicing
    if (preset.sliceAxis === 'none') {
      onChangeSlicing({
        enabled: false,
        plane: 'sagittal',
        depth: 0,
        showCap: true,
      });
    } else {
      const plane = preset.sliceAxis === 'x' ? 'sagittal' : preset.sliceAxis === 'y' ? 'transverse' : 'coronal';
      onChangeSlicing({
        enabled: true,
        plane,
        depth: preset.slicePosition,
        showCap: true,
      });
    }

    // Apply view settings
    onChangeViewSettings({
      ...viewSettings,
      transparentOuterLayers: preset.transparentOuterLayers,
      explodedView: preset.explodedView > 0.1,
      showLabels: preset.showLabels,
      autoRotate: preset.autoRotate,
    });

    setTimeout(() => {
      setActiveAppliedId(null);
    }, 1500);
  };

  const handleDeletePreset = async (presetId: string) => {
    if (!user) return;
    try {
      await deleteCustomPreset(user.uid, presetId);
    } catch (err) {
      console.error('Error deleting preset:', err);
    }
  };

  if (!user) {
    return (
      <div className="bg-gray-900/60 border border-gray-800/80 rounded-2xl p-6 text-center backdrop-blur-md">
        <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto mb-3">
          <Camera size={22} />
        </div>
        <h3 className="text-sm font-bold text-white mb-1">Custom Dissection Presets</h3>
        <p className="text-xs text-gray-400 mb-4 max-w-xs mx-auto leading-relaxed">
          Save custom slicing angles, cross-section depths, and transparency configurations to your Firebase cloud account.
        </p>
        <button
          onClick={() => signInWithGoogle()}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-md cursor-pointer"
        >
          <LogIn size={14} />
          <span>Sign In to Save Views</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/60 border border-gray-800/80 rounded-2xl p-5 shadow-lg backdrop-blur-md flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-800/60">
        <div className="flex items-center gap-2">
          <Camera className="text-cyan-400" size={18} />
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide uppercase">3D View Snapshots</h3>
            <span className="text-[10px] text-gray-400 font-mono">Saved camera & cutting angles</span>
          </div>
        </div>
        {!showSaveInput && (
          <button
            onClick={() => {
              setPresetName(`${stage.title.split(':')[0]} Angle ${presets.length + 1}`);
              setShowSaveInput(true);
            }}
            className="flex items-center gap-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-semibold px-3 py-1.5 rounded-xl transition-all cursor-pointer"
          >
            <Plus size={13} />
            <span>Snapshot Current</span>
          </button>
        )}
      </div>

      {/* Snapshot Name Input */}
      {showSaveInput && (
        <form onSubmit={handleSaveCurrentView} className="bg-gray-950/80 border border-gray-800 rounded-xl p-3.5 flex flex-col gap-2.5">
          <span className="text-xs font-bold text-cyan-400 font-mono uppercase">
            Save Current View Angle & Slicing
          </span>
          <div className="text-[10px] text-gray-400 bg-gray-900/80 p-2 rounded-lg border border-gray-800/60 flex flex-wrap gap-x-3 gap-y-1">
            <span>Slice: <strong className="text-white">{slicing.enabled ? `${slicing.plane} (${(slicing.depth * 100).toFixed(0)}%)` : 'Off'}</strong></span>
            <span>X-Ray: <strong className="text-white">{viewSettings.transparentOuterLayers ? 'On' : 'Off'}</strong></span>
            <span>Exploded: <strong className="text-white">{viewSettings.explodedView ? 'On' : 'Off'}</strong></span>
          </div>
          <input
            type="text"
            value={presetName}
            onChange={(e) => setPresetName(e.target.value)}
            placeholder="Preset Name (e.g. Mid-Sagittal Neural Tube)"
            className="w-full bg-gray-900 border border-gray-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500"
            maxLength={80}
            required
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowSaveInput(false)}
              className="px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-white border border-gray-800 hover:border-gray-700 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white shadow-md cursor-pointer disabled:opacity-50"
            >
              <span>{isSaving ? 'Saving...' : 'Save View'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Presets List */}
      <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-1">
        {presets.length === 0 && !showSaveInput ? (
          <div className="text-center py-5 text-xs text-gray-500 border border-dashed border-gray-800/80 rounded-xl p-4">
            <p>No custom view snapshots saved for this stage.</p>
            <p className="text-[10px] text-gray-600 mt-1">Adjust slicing or transparency, then snapshot the view!</p>
          </div>
        ) : (
          presets.map((preset) => {
            const isApplied = activeAppliedId === preset.id;
            return (
              <div
                key={preset.id}
                className="bg-gray-950/60 border border-gray-800/80 rounded-xl p-3 flex items-center justify-between gap-3 hover:border-gray-700 transition-colors"
              >
                <div className="flex flex-col flex-grow">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{preset.name}</span>
                    {isApplied && (
                      <span className="text-[9px] bg-emerald-950 border border-emerald-800 text-emerald-400 px-1.5 py-0.5 rounded font-mono animate-fadeIn">
                        Applied!
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-1 text-[10px] text-gray-400 font-mono">
                    <span className="flex items-center gap-1">
                      <Scissors size={10} className="text-rose-400" />
                      {preset.sliceAxis === 'none' ? 'No Slice' : `${preset.sliceAxis}-axis (${(preset.slicePosition * 100).toFixed(0)}%)`}
                    </span>
                    {preset.transparentOuterLayers && (
                      <span className="text-indigo-400">• X-Ray</span>
                    )}
                    {preset.explodedView > 0.1 && (
                      <span className="text-purple-400">• Exploded</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleApplyPreset(preset)}
                    className="flex items-center gap-1 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-800/80 text-cyan-300 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-all cursor-pointer"
                    title="Apply this camera and slicing configuration"
                  >
                    <Play size={11} className="fill-current" />
                    <span>Apply</span>
                  </button>
                  <button
                    onClick={() => handleDeletePreset(preset.id)}
                    className="p-1.5 text-gray-500 hover:text-rose-400 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
                    title="Delete snapshot"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
