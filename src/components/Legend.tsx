import React, { useState } from 'react';
import { GermLayer } from '../types';
import { Sparkles, Info, BookOpen } from 'lucide-react';

interface LegendProps {
  onSelectGermLayer: (layer: GermLayer | null) => void;
  selectedGermLayer: GermLayer | null;
}

interface LayerMetadata {
  id: GermLayer;
  name: string;
  color: string;
  borderColor: string;
  textColor: string;
  derivatives: string[];
  summary: string;
}

const LAYER_DETAILS: LayerMetadata[] = [
  {
    id: GermLayer.Ectoderm,
    name: 'Ectoderm',
    color: '#1d4ed8', // Darker Blue
    borderColor: 'border-blue-600',
    textColor: 'text-blue-300',
    summary: 'The outermost of the three primary germ layers that forms in gastrulation.',
    derivatives: ['Brain & Spinal Cord (Central Nervous System)', 'Epidermis of skin, hair, and nails', 'Sensory organs (eyes, ears)', 'Adrenal Medulla'],
  },
  {
    id: GermLayer.Mesoderm,
    name: 'Mesoderm',
    color: '#dc2626', // Red
    borderColor: 'border-rose-600',
    textColor: 'text-rose-300',
    summary: 'The middle germ layer, filling the space between the ectoderm and endoderm.',
    derivatives: ['Skeletal, cardiac, and smooth muscle', 'Bones, cartilage, and connective tissues', 'Cardiovascular system (heart & blood vessels)', 'Kidneys and gonads'],
  },
  {
    id: GermLayer.Endoderm,
    name: 'Endoderm',
    color: '#ca8a04', // Yellow/Gold
    borderColor: 'border-amber-600',
    textColor: 'text-amber-300',
    summary: 'The innermost of the three primary germ layers lining the embryo proper.',
    derivatives: ['Epithelial lining of gastrointestinal tract', 'Epithelial lining of respiratory tract (lungs)', 'Liver, gallbladder, and pancreas organs', 'Thyroid and thymus glands'],
  },
  {
    id: GermLayer.Trophoblast,
    name: 'Trophoblast',
    color: '#ea580c', // Orange
    borderColor: 'border-orange-600',
    textColor: 'text-orange-300',
    summary: 'The outer cell layer of the blastocyst that makes first contact with the womb.',
    derivatives: ['Fetal portion of the placenta', 'Amnion/Chorion supportive layers', 'Secretes hCG hormones'],
  },
  {
    id: GermLayer.Extraembryonic,
    name: 'Extraembryonic / Other',
    color: '#a78bfa', // Purple
    borderColor: 'border-purple-600',
    textColor: 'text-purple-300',
    summary: 'Supportive cavities and structures that reside outside the developing embryo proper.',
    derivatives: ['Yolk Sac (early blood factory)', 'Amniotic Fluid Cavity (cushion)', 'Umbilical cord connecting stalk'],
  }
];

export default function Legend() {
  const [activeLayer, setActiveLayer] = useState<GermLayer | null>(null);

  const handleToggle = (layer: GermLayer) => {
    if (activeLayer === layer) {
      setActiveLayer(null);
    } else {
      setActiveLayer(layer);
    }
  };

  return (
    <div className="bg-gray-900/40 border border-gray-800/60 rounded-2xl p-4 backdrop-blur-md flex flex-col gap-3.5 h-full">
      <div className="flex items-center gap-2 pb-2 border-b border-gray-800/60">
        <BookOpen className="text-amber-500" size={16} />
        <h3 className="text-xs font-bold text-gray-200 tracking-wider uppercase font-mono">
          Germ Layer Reference Key
        </h3>
      </div>

      <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
        Human embryonic development begins with undifferentiated stem cells that commit to specialized tissues. Click a layer below to discover its derivatives.
      </p>

      {/* Grid of interactive layers */}
      <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-5 gap-2">
        {LAYER_DETAILS.map((layer) => {
          const isSelected = activeLayer === layer.id;
          return (
            <button
              key={layer.id}
              onClick={() => handleToggle(layer.id)}
              className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border text-center transition-all cursor-pointer ${
                isSelected
                  ? `bg-gray-900 ${layer.borderColor} border-2 shadow-lg scale-[1.03]`
                  : 'bg-gray-950/40 border-gray-800/80 hover:border-gray-700'
              }`}
            >
              <span
                className="w-4 h-4 rounded-full border border-white/20 shadow-inner shrink-0"
                style={{ backgroundColor: layer.color }}
              />
              <span className={`text-xs font-semibold ${layer.textColor}`}>{layer.name.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Layer Detail Insight Drawer */}
      {activeLayer && (
        <div className="bg-gray-950/60 border border-gray-800/80 p-3.5 rounded-xl animate-fadeIn">
          {(() => {
            const detail = LAYER_DETAILS.find((d) => d.id === activeLayer)!;
            return (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: detail.color }} />
                  <h4 className={`text-xs font-bold uppercase tracking-wider ${detail.textColor}`}>{detail.name} Layer</h4>
                </div>
                <p className="text-[11px] text-gray-300 leading-relaxed">{detail.summary}</p>
                
                <div className="flex flex-col gap-1.5 mt-1 border-t border-gray-800/60 pt-2">
                  <span className="text-[9px] font-mono font-semibold text-gray-400 uppercase tracking-widest">Future Derivatives</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[10px] text-gray-300">
                    {detail.derivatives.map((deriv, i) => (
                      <span key={i} className="flex items-center gap-1">
                        <span className="text-amber-500 shrink-0">•</span>
                        {deriv}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
