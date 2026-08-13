'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { TranscriptSegment as SegmentType } from '@/lib/types';
import { TranscriptSegment } from './TranscriptSegment';
import { TranscriptSearch } from './TranscriptSearch';
import { MessageSquare, Download } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface TranscriptProps {
  segments: SegmentType[];
  currentTime: number;
  onSeek: (seconds: number) => void;
  meetingTitle?: string;
}

export const Transcript: React.FC<TranscriptProps> = ({
  segments,
  currentTime,
  onSeek,
  meetingTitle = "Meeting Transcript",
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Compute active segment ID
  const activeSegmentId = useMemo(() => {
    if (!segments || segments.length === 0) return null;
    let activeId = segments[0].id;
    for (let i = 0; i < segments.length; i++) {
      if (currentTime >= segments[i].timestamp_seconds) {
        activeId = segments[i].id;
      } else {
        break;
      }
    }
    return activeId;
  }, [segments, currentTime]);

  // Find segments matching search term
  const matchingSegmentIds = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const term = searchTerm.toLowerCase().trim();
    return segments
      .filter((s) => s.text.toLowerCase().includes(term) || s.speaker.toLowerCase().includes(term))
      .map((s) => s.id);
  }, [segments, searchTerm]);

  // Reset match index when search term changes
  useEffect(() => {
    setCurrentMatchIndex(0);
  }, [searchTerm]);

  // Auto-scroll active segment into view inside transcript box
  useEffect(() => {
    if (activeSegmentId && containerRef.current) {
      const activeEl = document.getElementById(`segment-${activeSegmentId}`);
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [activeSegmentId]);

  const handleNextMatch = () => {
    if (matchingSegmentIds.length === 0) return;
    const nextIdx = (currentMatchIndex + 1) % matchingSegmentIds.length;
    setCurrentMatchIndex(nextIdx);
    const targetId = matchingSegmentIds[nextIdx];
    const el = document.getElementById(`segment-${targetId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handlePrevMatch = () => {
    if (matchingSegmentIds.length === 0) return;
    const prevIdx = (currentMatchIndex - 1 + matchingSegmentIds.length) % matchingSegmentIds.length;
    setCurrentMatchIndex(prevIdx);
    const targetId = matchingSegmentIds[prevIdx];
    const el = document.getElementById(`segment-${targetId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const exportTranscriptTxt = () => {
    const textContent = segments
      .map((s) => `[${s.speaker}] (${s.timestamp_seconds}s):\n${s.text}\n`)
      .join('\n');
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${meetingTitle.replace(/[^a-zA-Z0-9]/g, '_')}_transcript.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col h-[560px] transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-brand-50 dark:bg-brand-950/50 rounded-lg text-brand-600 dark:text-brand-400">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Interactive Transcript</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">{segments.length} transcript segments</p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={exportTranscriptTxt}
          title="Export transcript as plain text file"
          className="text-xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Export TXT</span>
        </Button>
      </div>

      {/* Transcript Search Bar */}
      <div className="mb-3">
        <TranscriptSearch
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          matchCount={matchingSegmentIds.length}
          currentMatchIndex={currentMatchIndex}
          onNextMatch={handleNextMatch}
          onPrevMatch={handlePrevMatch}
        />
      </div>

      {/* Segments List Box */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto pr-1 space-y-2.5"
      >
        {segments.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 dark:text-slate-500">
            <MessageSquare className="w-8 h-8 mb-2 stroke-1" />
            <p className="text-xs font-medium">No transcript segments available for this meeting.</p>
          </div>
        ) : (
          segments.map((seg) => (
            <TranscriptSegment
              key={seg.id}
              segment={seg}
              isActive={seg.id === activeSegmentId}
              onSeek={onSeek}
              searchTerm={searchTerm}
            />
          ))
        )}
      </div>
    </div>
  );
};
