'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { MeetingPlayer } from '@/components/player/MeetingPlayer';
import { Transcript } from '@/components/transcript/Transcript';
import { SummaryPanel } from '@/components/summary/SummaryPanel';
import { TopicList } from '@/components/summary/TopicList';
import { ActionItems } from '@/components/summary/ActionItems';
import { EditMeetingModal } from '@/components/meetings/EditMeetingModal';
import { DeleteMeetingModal } from '@/components/meetings/DeleteMeetingModal';
import { MeetingDetailSkeleton } from '@/components/ui/LoadingSkeleton';
import { MeetingDetail, Meeting } from '@/lib/types';
import { api } from '@/lib/api';
import { formatDate, parseDurationToSeconds, getAvatarColor, getInitials } from '@/lib/utils';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Pencil, 
  Trash2, 
  Share2,
  Users,
  Video,
  Radio
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';

export default function MeetingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const meetingId = params.id as string;

  const [meeting, setMeeting] = useState<MeetingDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Player state
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Modals state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const fetchMeetingDetail = useCallback(async () => {
    if (!meetingId) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.getMeeting(meetingId);
      setMeeting(data);
    } catch (err: any) {
      console.error('Failed to fetch meeting detail:', err);
      setError(err.message || 'Meeting not found or server error');
    } finally {
      setIsLoading(false);
    }
  }, [meetingId]);

  useEffect(() => {
    fetchMeetingDetail();
  }, [fetchMeetingDetail]);

  const totalDurationSeconds = useMemo(() => {
    if (!meeting) return 1800;
    return parseDurationToSeconds(meeting.duration);
  }, [meeting]);

  const handleSeek = (seconds: number) => {
    setCurrentTime(seconds);
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      showToast('Meeting workspace link copied to clipboard!', 'info');
      setIsShareModalOpen(true);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#070a12] transition-colors duration-200">
      <Sidebar 
        isMobileOpen={isMobileSidebarOpen} 
        setIsMobileOpen={setIsMobileSidebarOpen} 
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          title="Meeting Workspace"
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Fireflies-Inspired Workspace Top Breadcrumbs & Control Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-[#0b0f19] border border-slate-200/90 dark:border-slate-800/90 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center gap-3">
              <Link
                href="/meetings"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>All Meetings</span>
              </Link>

              {meeting && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400">/</span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[200px] sm:max-w-[300px]">
                    {meeting.title}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 uppercase tracking-wider">
                    <Radio className="w-3 h-3 animate-pulse" /> REC
                  </span>
                </div>
              )}
            </div>

            {meeting && (
              <div className="flex items-center gap-2 shrink-0">
                <Button variant="outline" size="sm" onClick={handleShare} className="font-semibold text-xs">
                  <Share2 className="w-3.5 h-3.5 mr-1" />
                  <span>Share Workspace</span>
                </Button>
                <Button variant="outline" size="sm" onClick={() => setIsEditOpen(true)} className="font-semibold text-xs">
                  <Pencil className="w-3.5 h-3.5 mr-1" />
                  <span>Edit</span>
                </Button>
                <Button variant="danger" size="sm" onClick={() => setIsDeleteOpen(true)} className="font-semibold text-xs">
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            )}
          </div>

          {/* Loading Skeleton */}
          {isLoading ? (
            <MeetingDetailSkeleton />
          ) : error || !meeting ? (
            <div className="bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800 rounded-2xl p-10 text-center space-y-3">
              <h3 className="text-base font-bold text-rose-600 dark:text-rose-400">Error Loading Meeting</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{error || 'Meeting not found'}</p>
              <Button onClick={() => router.push('/')} className="mt-2 font-semibold">
                Back to Dashboard
              </Button>
            </div>
          ) : (
            /* Meeting Workspace Layout */
            <div className="space-y-6">
              {/* Workspace Title & Attendees Card */}
              <div className="bg-white dark:bg-[#0b0f19] border border-slate-200/90 dark:border-slate-800/90 rounded-2xl p-6 shadow-xs space-y-4 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {meeting.title}
                  </h2>
                  <div className="flex items-center gap-2">
                    <Badge variant="default" size="sm" className="bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 font-bold border border-brand-200 dark:border-brand-900">
                      <Video className="w-3 h-3 mr-1 text-brand-600 dark:text-brand-400" />
                      Video Recording Sync
                    </Badge>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-400 font-medium">
                  <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/60 px-3 py-1 rounded-xl border border-slate-200/80 dark:border-slate-800">
                    <Calendar className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                    <span>{formatDate(meeting.meeting_date)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/60 px-3 py-1 rounded-xl border border-slate-200/80 dark:border-slate-800">
                    <Clock className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                    <span>{meeting.duration}</span>
                  </div>
                </div>

                {/* Attendees list */}
                <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mr-1">Attendees:</span>
                  {meeting.participants.map((p) => (
                    <div
                      key={p.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700"
                    >
                      <div
                        className={`w-4.5 h-4.5 rounded-full text-[9px] font-extrabold flex items-center justify-center ${getAvatarColor(
                          p.name
                        )}`}
                      >
                        {getInitials(p.name)}
                      </div>
                      <span>{p.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fireflies-Inspired Two-Column Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* LEFT / MAIN COLUMN: Audio Player & Interactive Transcript */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Media Player */}
                  <MeetingPlayer
                    currentTime={currentTime}
                    totalDurationSeconds={totalDurationSeconds}
                    onSeek={handleSeek}
                    isPlaying={isPlaying}
                    setIsPlaying={setIsPlaying}
                  />

                  {/* Interactive Transcript */}
                  <Transcript
                    segments={meeting.transcript_segments || []}
                    currentTime={currentTime}
                    onSeek={handleSeek}
                    meetingTitle={meeting.title}
                  />
                </div>

                {/* RIGHT COLUMN: AI Summary, Chapters, Action Items */}
                <div className="space-y-6">
                  {/* AI Executive Summary Panel */}
                  <SummaryPanel
                    summary={meeting.summary}
                    meetingTitle={meeting.title}
                  />

                  {/* Key Topics / Chapters List */}
                  <TopicList
                    topics={meeting.topics || []}
                    onSeek={handleSeek}
                  />

                  {/* Action Items Workspace */}
                  <ActionItems
                    meetingId={meeting.id}
                    actionItems={meeting.action_items || []}
                    onRefresh={fetchMeetingDetail}
                  />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Edit & Delete Modals */}
      {meeting && (
        <>
          <EditMeetingModal
            isOpen={isEditOpen}
            meeting={meeting as Meeting}
            onClose={() => setIsEditOpen(false)}
            onSuccess={fetchMeetingDetail}
          />

          <DeleteMeetingModal
            isOpen={isDeleteOpen}
            meeting={meeting as Meeting}
            onClose={() => setIsDeleteOpen(false)}
            onSuccess={() => router.push('/')}
          />
        </>
      )}

      {/* Team Sharing Placeholder Modal */}
      {isShareModalOpen && (
        <Modal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          title="Share Workspace Link"
          maxWidth="md"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3.5 bg-brand-50 dark:bg-brand-950/40 rounded-xl border border-brand-200 dark:border-brand-900/60">
              <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <Badge variant="purple" size="sm" className="font-semibold mb-1">
                  Status: Link Copied!
                </Badge>
                <p className="text-xs font-semibold text-brand-900 dark:text-brand-200">
                  Workspace link has been copied to your clipboard.
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 font-medium">
              Advanced Team Sharing, Workspace Role Access Control (Viewer/Editor permissions), and Slack Channel auto-posting will be available in a future release!
            </p>

            <div className="flex justify-end pt-2">
              <Button onClick={() => setIsShareModalOpen(false)} size="sm" className="font-semibold">
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
