'use client';

import React from 'react';
import { Topic } from '@/lib/types';
import { formatSeconds } from '@/lib/utils';
import { Compass, Clock } from 'lucide-react';

interface TopicListProps {
  topics: Topic[];
  onSeek: (seconds: number) => void;
}

export const TopicList: React.FC<TopicListProps> = ({ topics, onSeek }) => {
  return (
    <div className="bg-white dark:bg-[#0b0f19] border border-slate-200/90 dark:border-slate-800/90 rounded-2xl p-5 shadow-xs transition-colors space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between gap-2 pb-3.5 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl text-white shadow-md shadow-blue-500/20">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Topics & Chapters</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{topics.length} interactive chapters</p>
          </div>
        </div>
      </div>

      {/* Numbered Chapter Cards */}
      <div className="space-y-2">
        {topics.length === 0 ? (
          <p className="text-xs text-slate-400 dark:text-slate-500 italic p-3 text-center">No discussion topics detected.</p>
        ) : (
          topics.map((topic, index) => (
            <div
              key={topic.id}
              onClick={() => onSeek(topic.start_time)}
              className="group p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-850 hover:bg-brand-50/90 dark:hover:bg-brand-950/70 hover:border-brand-300 dark:hover:border-brand-800 transition-all cursor-pointer flex items-center justify-between gap-3 shadow-2xs"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-xs font-black text-brand-600 dark:text-brand-400 font-mono shrink-0 bg-brand-50 dark:bg-brand-950/80 px-2 py-1 rounded-md border border-brand-200/60 dark:border-brand-900/60">
                  {(index + 1).toString().padStart(2, '0')}
                </span>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-brand-700 dark:group-hover:text-brand-300 truncate">
                    {topic.title}
                  </h4>
                  {topic.description && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate font-medium">
                      {topic.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Chapter Timestamp Badge */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSeek(topic.start_time);
                }}
                className="shrink-0 flex items-center gap-1 text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 group-hover:bg-brand-600 group-hover:text-white border border-slate-200 dark:border-slate-700 transition-colors shadow-2xs"
              >
                <Clock className="w-3 h-3" />
                <span>{formatSeconds(topic.start_time)}</span>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
