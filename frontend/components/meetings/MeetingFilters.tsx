'use client';

import React from 'react';
import { Search, ArrowUpDown, User, Compass } from 'lucide-react';

interface MeetingFiltersProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedParticipant: string;
  onParticipantChange: (p: string) => void;
  selectedTopic: string;
  onTopicChange: (t: string) => void;
  sortBy: string;
  onSortChange: (s: string) => void;
  participantOptions: string[];
  topicOptions: string[];
}

export const MeetingFilters: React.FC<MeetingFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedParticipant,
  onParticipantChange,
  selectedTopic,
  onTopicChange,
  sortBy,
  onSortChange,
  participantOptions,
  topicOptions,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-xs mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 transition-colors">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[220px]">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
        <input
          type="text"
          placeholder="Filter by title or participant..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white dark:focus:bg-slate-800 transition-all font-medium"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Participant Filter Dropdown */}
        <div className="relative flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5">
          <User className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
          <select
            value={selectedParticipant}
            onChange={(e) => onParticipantChange(e.target.value)}
            className="bg-transparent text-xs text-slate-700 dark:text-slate-200 font-medium focus:outline-none cursor-pointer pr-2 max-w-[140px] truncate"
          >
            <option value="" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">All Attendees</option>
            {participantOptions.map((name) => (
              <option key={name} value={name} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                {name}
              </option>
            ))}
          </select>
        </div>

        {/* Topic / Tag Filter Dropdown */}
        <div className="relative flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5">
          <Compass className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
          <select
            value={selectedTopic}
            onChange={(e) => onTopicChange(e.target.value)}
            className="bg-transparent text-xs text-slate-700 dark:text-slate-200 font-medium focus:outline-none cursor-pointer pr-2 max-w-[140px] truncate"
          >
            <option value="" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">All Topics</option>
            {topicOptions.map((topic) => (
              <option key={topic} value={topic} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                {topic}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Dropdown */}
        <div className="relative flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="bg-transparent text-xs text-slate-700 dark:text-slate-200 font-medium focus:outline-none cursor-pointer pr-2"
          >
            <option value="newest" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Newest First</option>
            <option value="oldest" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Oldest First</option>
            <option value="duration" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Duration</option>
          </select>
        </div>
      </div>
    </div>
  );
};
