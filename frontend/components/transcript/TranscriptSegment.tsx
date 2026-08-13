'use client';

import React from 'react';
import { TranscriptSegment as SegmentType } from '@/lib/types';
import { formatSeconds, getAvatarColor, getInitials } from '@/lib/utils';

interface TranscriptSegmentProps {
  segment: SegmentType;
  isActive: boolean;
  onSeek: (seconds: number) => void;
  searchTerm: string;
}

export const TranscriptSegment: React.FC<TranscriptSegmentProps> = ({
  segment,
  isActive,
  onSeek,
  searchTerm,
}) => {
  // Highlight matching search term in spoken text
  const renderHighlightedText = (text: string, term: string) => {
    if (!term || !term.trim()) return text;
    const parts = text.split(new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === term.toLowerCase() ? (
        <mark key={i} className="bg-amber-200 dark:bg-amber-900/80 text-amber-950 dark:text-amber-100 font-semibold px-0.5 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div
      id={`segment-${segment.id}`}
      className={`p-3.5 rounded-2xl border transition-all duration-200 flex items-start gap-3.5 ${
        isActive
          ? 'bg-brand-50/90 dark:bg-brand-950/70 border-brand-300 dark:border-brand-500/80 shadow-xs ring-1 ring-brand-400 dark:ring-brand-500'
          : 'bg-white dark:bg-[#0b0f19] border-slate-100 dark:border-slate-800/80 hover:border-slate-200 dark:hover:border-slate-700 hover:bg-slate-50/60 dark:hover:bg-slate-800/60'
      }`}
    >
      {/* Speaker Avatar */}
      <div
        className={`w-7 h-7 rounded-full text-[10px] font-extrabold flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700 shadow-2xs ${getAvatarColor(
          segment.speaker
        )}`}
      >
        {getInitials(segment.speaker)}
      </div>

      {/* Speaker Name, Fireflies Timestamp Badge, & Text */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-extrabold text-slate-900 dark:text-white">{segment.speaker}</span>
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">•</span>
          
          {/* Fireflies Timestamp Link Badge (Clickable seek button) */}
          <button
            onClick={() => onSeek(segment.timestamp_seconds)}
            title="Click to seek player to timestamp"
            className={`text-[11px] font-bold underline underline-offset-2 transition-colors cursor-pointer ${
              isActive
                ? 'text-brand-600 dark:text-brand-300 font-extrabold'
                : 'text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300'
            }`}
          >
            {formatSeconds(segment.timestamp_seconds)}
          </button>
        </div>

        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
          {renderHighlightedText(segment.text, searchTerm)}
        </p>
      </div>
    </div>
  );
};
