'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
import { useApp } from '@/lib/context';
import { 
  Video, 
  Clock, 
  CheckCircle2, 
  Plus, 
  SearchX, 
  Sparkles, 
  TrendingUp, 
  ArrowRight,
  ListTodo,
  Compass
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { parseDurationToSeconds } from '@/lib/utils';

export default function DashboardPage() {
  const router = useRouter();
  const { firstName } = useApp();
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
      console.error('Failed to fetch meetings:', err);
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

  const topicOptions = useMemo(() => {
    const set = new Set<string>();
    rawMeetings.forEach((m) => {
      m.topics?.forEach((t) => set.add(t.title));
    });
    return Array.from(set).sort();
  }, [rawMeetings]);

  const meetings = useMemo(() => {
    if (!selectedTopic) return rawMeetings;
    return rawMeetings.filter((m) =>
      m.topics?.some((t) => t.title.toLowerCase() === selectedTopic.toLowerCase())
    );
  }, [rawMeetings, selectedTopic]);

  const stats = useMemo(() => {
    const totalMeetings = meetings.length;
    let totalSeconds = 0;
    meetings.forEach((m) => {
      totalSeconds += parseDurationToSeconds(m.duration);
    });
    const totalHours = (totalSeconds / 3600).toFixed(1);

    return {
      totalMeetings,
      totalHours: `${totalHours} hrs`,
      totalSegments: meetings.reduce((acc, m) => acc + (m.transcript_segments_count || 0), 0),
      totalActionItems: meetings.reduce((acc, m) => acc + (m.participants?.length || 2), 0),
    };
  }, [meetings]);

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#070a12] transition-colors duration-200">
      <Sidebar 
        isMobileOpen={isMobileSidebarOpen} 
        setIsMobileOpen={setIsMobileSidebarOpen} 
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          title="Meetings Dashboard"
          onOpenNewMeeting={() => setIsCreateOpen(true)}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto space-y-8">
          {/* Dashboard Hero Banner */}
          <div className="relative bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-950 text-white rounded-3xl p-6 sm:p-10 shadow-glow-purple border border-indigo-900/60 overflow-hidden">
            <div className="absolute -right-12 -top-12 w-96 h-96 bg-brand-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
              <div className="space-y-3 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>MeetFlow AI Intelligence</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                  Welcome back, {firstName} 👋
                </h2>
                <h3 className="text-lg sm:text-xl font-bold text-brand-200">
                  Turn every conversation into organized knowledge and action.
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                  Review meetings, explore transcripts, track action items, and discover important conversation insights in one workspace.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <Button
                  onClick={() => setIsCreateOpen(true)}
                  size="md"
                  className="bg-white text-brand-950 hover:bg-slate-100 font-extrabold shadow-xl border-0"
                >
                  <Plus className="w-4 h-4 text-brand-600 mr-1" /> New Meeting
                </Button>

                <Button
                  onClick={() => router.push('/meetings')}
                  size="md"
                  variant="secondary"
                  className="bg-white/10 text-white hover:bg-white/20 font-bold border border-white/20"
                >
                  Explore Meetings <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* TOTAL MEETINGS */}
            <div className="bg-white dark:bg-[#0b0f19] border border-slate-200/90 dark:border-slate-800/90 rounded-2xl p-5 shadow-xs flex items-center justify-between hover-card-elevation transition-all">
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Meetings</p>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">{stats.totalMeetings}</h3>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> Synced in SQLite
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0 border border-brand-100 dark:border-brand-900">
                <Video className="w-6 h-6" />
              </div>
            </div>

            {/* RECORDED TIME */}
            <div className="bg-white dark:bg-[#0b0f19] border border-slate-200/90 dark:border-slate-800/90 rounded-2xl p-5 shadow-xs flex items-center justify-between hover-card-elevation transition-all">
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Recorded Time</p>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">{stats.totalHours}</h3>
                <p className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Player Timeline Active
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 border border-purple-100 dark:border-purple-900">
                <Clock className="w-6 h-6" />
              </div>
            </div>

            {/* PARSED SEGMENTS */}
            <div className="bg-white dark:bg-[#0b0f19] border border-slate-200/90 dark:border-slate-800/90 rounded-2xl p-5 shadow-xs flex items-center justify-between hover-card-elevation transition-all">
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Parsed Segments</p>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">{stats.totalSegments}</h3>
                <p className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Timestamp Indexing
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-900">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>

            {/* ACTION ITEMS */}
            <div className="bg-white dark:bg-[#0b0f19] border border-slate-200/90 dark:border-slate-800/90 rounded-2xl p-5 shadow-xs flex items-center justify-between hover-card-elevation transition-all">
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Action Items</p>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">{stats.totalActionItems}</h3>
                <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                  <ListTodo className="w-3 h-3" /> Assigned & Tracked
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-100 dark:border-amber-900">
                <ListTodo className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Recent Meetings Section Header */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Recent Meetings
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                  Your latest conversations and insights
                </p>
              </div>
              <Link
                href="/meetings"
                className="inline-flex items-center gap-1.5 text-xs font-extrabold text-brand-600 dark:text-brand-400 hover:text-brand-700 bg-brand-50 dark:bg-brand-950/60 px-4 py-2 rounded-xl border border-brand-200 dark:border-brand-900/60 transition-colors cursor-pointer"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Toolbar Filters */}
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

            {/* Error Notification */}
            {error && (
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 text-xs flex items-center justify-between shadow-2xs">
                <span>{error}</span>
                <Button size="sm" variant="outline" onClick={fetchMeetings}>
                  Retry
                </Button>
              </div>
            )}

            {/* Loading Skeleton */}
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
              <div className="bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-3 shadow-xs">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500">
                  <SearchX className="w-7 h-7 stroke-1.5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">No meetings found</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed font-medium">
                  {searchQuery || selectedParticipant || selectedTopic
                    ? 'No meetings match your current search, participant, or topic filter criteria.'
                    : 'Get started by creating your first meeting or pasting a transcript.'}
                </p>
                <Button onClick={() => setIsCreateOpen(true)} className="mt-2 font-bold">
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
          </div>
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
