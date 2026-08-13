'use client';

import React from 'react';
import { Search, X, ChevronUp, ChevronDown } from 'lucide-react';

interface TranscriptSearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  matchCount: number;
  currentMatchIndex: number;
  onNextMatch?: () => void;
  onPrevMatch?: () => void;
}

export const TranscriptSearch: React.FC<TranscriptSearchProps> = ({
  searchTerm,
  onSearchChange,
  matchCount,
  currentMatchIndex,
  onNextMatch,
  onPrevMatch,
}) => {
  return (
    <div className="flex items-center gap-2 bg-slate-100/90 border border-slate-200 rounded-xl px-3 py-1.5 w-full">
      <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
      <input
        type="text"
        placeholder="Search inside transcript..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full bg-transparent text-xs text-slate-900 placeholder-slate-400 focus:outline-none"
      />
      {searchTerm && (
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[11px] font-medium text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
            {matchCount > 0 ? `${currentMatchIndex + 1} of ${matchCount}` : 'No matches'}
          </span>

          {matchCount > 0 && onPrevMatch && onNextMatch && (
            <div className="flex items-center gap-0.5">
              <button
                onClick={onPrevMatch}
                title="Previous match"
                className="p-1 hover:bg-slate-200 rounded text-slate-600"
              >
                <ChevronUp className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onNextMatch}
                title="Next match"
                className="p-1 hover:bg-slate-200 rounded text-slate-600"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <button
            onClick={() => onSearchChange('')}
            className="p-0.5 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-600"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
