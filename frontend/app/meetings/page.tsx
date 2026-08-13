'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { MeetingCard } from '@/components/meetings/MeetingCard';
import { MeetingFilters } from '@/components/meetings/MeetingFilters';
import { CreateMeetingModal } from '@/components/meetings/CreateMeetingModal';
import { EditMeetingModal } from '@/components/meetings/EditMeetingModal';
import { DeleteMeetingModal } from '@/components/meetings/DeleteMeetingModal';
import { MeetingCardSkeleton } from '@/components/ui/LoadingSkeleton';
import { Meeting } from '@/lib/types';
import { api } from '@/lib/api';
import { Video, Plus, SearchX } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function MeetingsLibraryPage() {
  const [rawMeetings, setRawMeetings] = useState<Meeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedParticipant, setSelectedParticipant] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);
  const [deletingMeeting, setDeletingMeeting] = useState<Meeting | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const fetchMeetings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.getMeetings({
        q: searchQuery,
        participant: selectedParticipant,
        sort_by: sortBy,
      });
      setRawMeetings(data);
    } catch (err: any) {
      console.error('Failed to fetch meetings library:', err);
      setError(err.message || 'Unable to connect to MeetFlow backend service.');
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedParticipant, sortBy]);

  useEffect(() => {
    fetchMeetings();
  }, [fetchMeetings]);

  const participantOptions = useMemo(() => {
    const set = new Set<string>();
    rawMeetings.forEach((m) => {
      m.participants?.forEach((p) => set.add(p.name));
    });
    return Array.from(set).sort();
  }, [rawMeetings]);

  // Dynamically derive available topics from actual meeting data
  const topicOptions = useMemo(() => {
    const set = new Set<string>();
    rawMeetings.forEach((m) => {
      m.topics?.forEach((t) => set.add(t.title));
    });
    return Array.from(set).sort();
  }, [rawMeetings]);

  // Combine topic filtering with existing search, participant, and sort criteria
  const meetings = useMemo(() => {
    if (!selectedTopic) return rawMeetings;
    return rawMeetings.filter((m) =>
      m.topics?.some((t) => t.title.toLowerCase() === selectedTopic.toLowerCase())
    );
  }, [rawMeetings, selectedTopic]);

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      <Sidebar 
        isMobileOpen={isMobileSidebarOpen} 
        setIsMobileOpen={setIsMobileSidebarOpen} 
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          title="Meetings Library"
          onOpenNewMeeting={() => setIsCreateOpen(true)}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs transition-colors">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Video className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Full Meetings Library</h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Browse and filter all recorded workspace sessions, transcripts, AI chapter topics, and takeaways.
              </p>
            </div>
            <Button onClick={() => setIsCreateOpen(true)} size="md" className="font-semibold shrink-0">
              <Plus className="w-4 h-4" /> New Meeting
            </Button>
          </div>

          {/* Search, Participant Filter, Topic Filter, and Sort Controls */}
          <MeetingFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedParticipant={selectedParticipant}
            onParticipantChange={setSelectedParticipant}
            selectedTopic={selectedTopic}
            onTopicChange={setSelectedTopic}
            sortBy={sortBy}
            onSortChange={setSortBy}
            participantOptions={participantOptions}
            topicOptions={topicOptions}
          />

          {/* Error Banner */}
          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 text-xs flex items-center justify-between shadow-2xs">
              <span>{error}</span>
              <Button size="sm" variant="outline" onClick={fetchMeetings}>
                Retry
              </Button>
            </div>
          )}

          {/* Loading Skeleton View */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <MeetingCardSkeleton />
              <MeetingCardSkeleton />
              <MeetingCardSkeleton />
              <MeetingCardSkeleton />
              <MeetingCardSkeleton />
              <MeetingCardSkeleton />
            </div>
          ) : meetings.length === 0 ? (
            /* Empty State */
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-3 shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500">
                <SearchX className="w-7 h-7 stroke-1.5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">No meetings found</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
                No meetings match your current search, participant, or topic filter criteria.
              </p>
              <Button onClick={() => setIsCreateOpen(true)} className="mt-2 font-semibold">
                <Plus className="w-4 h-4 mr-1.5" /> New Meeting
              </Button>
            </div>
          ) : (
            /* Meetings Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {meetings.map((meeting) => (
                <MeetingCard
                  key={meeting.id}
                  meeting={meeting}
                  onEdit={(m) => setEditingMeeting(m)}
                  onDelete={(m) => setDeletingMeeting(m)}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      <CreateMeetingModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={fetchMeetings}
      />

      <EditMeetingModal
        isOpen={!!editingMeeting}
        meeting={editingMeeting}
        onClose={() => setEditingMeeting(null)}
        onSuccess={fetchMeetings}
      />

      <DeleteMeetingModal
        isOpen={!!deletingMeeting}
        meeting={deletingMeeting}
        onClose={() => setDeletingMeeting(null)}
        onSuccess={fetchMeetings}
      />
    </div>
  );
}
