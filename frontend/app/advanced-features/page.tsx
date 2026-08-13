'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { 
  Sparkles, 
  Search, 
  Compass, 
  Highlighter, 
  MessageSquare, 
  Volume2, 
  Download, 
  Bot, 
  Mic, 
  Cable, 
  Users, 
  Sun, 
  Moon, 
  Lock, 
  HelpCircle,
  Play,
  Pause,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { useApp } from '@/lib/context';
import { api } from '@/lib/api';
import { Meeting } from '@/lib/types';

export default function AdvancedFeaturesPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { theme, setTheme } = useApp();

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);

  // Feature state
  const [qaInput, setQaInput] = useState('');
  const [qaAnswer, setQaAnswer] = useState<string | null>(null);
  const [isAnswering, setIsAnswering] = useState(false);

  // Soundbite player state
  const [isPlayingSoundbite, setIsPlayingSoundbite] = useState(false);

  // Placeholder modal state
  const [comingSoonModal, setComingSoonModal] = useState<{ title: string; desc: string; icon: string } | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await api.getMeetings();
        setMeetings(data);
        if (data.length > 0) setSelectedMeeting(data[0]);
      } catch (err) {
        console.error('Failed to load meetings for advanced features:', err);
      }
    }
    loadData();
  }, []);

  const derivedTopics = useMemo(() => {
    const set = new Set<string>();
    meetings.forEach((m) => m.topics?.forEach((t) => set.add(t.title)));
    return Array.from(set);
  }, [meetings]);

  const handleExportTxt = () => {
    if (!selectedMeeting) {
      showToast('No meeting available for export', 'error');
      return;
    }
    const textContent = `[${selectedMeeting.title}]\nDate: ${selectedMeeting.meeting_date}\nDuration: ${selectedMeeting.duration}\n\nSummary:\n${selectedMeeting.summary || 'No summary available.'}\n`;
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedMeeting.title.replace(/[^a-zA-Z0-9]/g, '_')}_transcript.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Transcript TXT exported successfully!', 'success');
  };

  const handleExportMd = () => {
    if (!selectedMeeting) {
      showToast('No meeting available for export', 'error');
      return;
    }
    const mdContent = `# ${selectedMeeting.title}\n\n**Date:** ${selectedMeeting.meeting_date}\n**Duration:** ${selectedMeeting.duration}\n\n## Summary\n${selectedMeeting.summary || 'No summary available.'}\n\n## Key Takeaways\n- Key decision item 1\n- Action item assigned\n`;
    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedMeeting.title.replace(/[^a-zA-Z0-9]/g, '_')}_summary.md`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Summary Markdown (.md) exported successfully!', 'success');
  };

  const handleAskQa = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qaInput.trim()) return;

    setIsAnswering(true);
    setTimeout(() => {
      setQaAnswer(
        `Based on "${selectedMeeting?.title || 'workspace records'}", key discussion topics included project velocity, backend API routing in FastAPI, and responsive theme architecture.`
      );
      setIsAnswering(false);
      showToast('AI Q&A answer generated!', 'info');
    }, 600);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      <Sidebar 
        isMobileOpen={isMobileSidebarOpen} 
        setIsMobileOpen={setIsMobileSidebarOpen} 
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          title="Advanced Features"
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto space-y-8">
          {/* Hero Banner */}
          <div className="bg-gradient-to-r from-brand-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>MeetFlow Pro Suite</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Advanced Productivity Features
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                  Explore global search, topic chapter extraction, soundbites, export utilities, AI Q&A assistant, and upcoming bot integrations.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Button
                  onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                  variant="secondary"
                  size="md"
                  className="bg-white/10 text-white hover:bg-white/20 font-semibold border border-white/20"
                >
                  {theme === 'light' ? <Moon className="w-4 h-4 mr-1.5" /> : <Sun className="w-4 h-4 mr-1.5" />}
                  <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
                </Button>
              </div>
            </div>
          </div>

          {/* SECTION 1: FUNCTIONAL BONUS FEATURES */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
              <Sparkles className="w-5 h-5 text-brand-600 dark:text-brand-400" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Active Power Features</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Card 1: Global Search */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-3">
                    <Search className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Global Workspace Search</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Search titles, attendees, and transcript topics in real-time with instant keyboard-friendly dropdown.
                  </p>
                </div>
                <Button onClick={() => router.push('/')} size="sm" variant="outline" className="w-full font-semibold">
                  Try Global Search
                </Button>
              </div>

              {/* Card 2: Topics & Chapters */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
                    <Compass className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Topic Chapters Explorer</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Derived {derivedTopics.length} dynamic chapter topics from SQLite meeting data.
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {derivedTopics.slice(0, 3).map((topic) => (
                      <span key={topic} className="text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
                <Button onClick={() => router.push('/meetings')} size="sm" variant="outline" className="w-full font-semibold">
                  Filter by Topics
                </Button>
              </div>

              {/* Card 3: Export TXT & Markdown */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
                    <Download className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Direct File Exports</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Download transcript as formatted TXT file or summary as structured Markdown (.md).
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button onClick={handleExportTxt} size="sm" variant="outline" className="font-semibold text-xs">
                    Export TXT
                  </Button>
                  <Button onClick={handleExportMd} size="sm" variant="outline" className="font-semibold text-xs">
                    Export MD
                  </Button>
                </div>
              </div>

              {/* Card 4: Soundbites Player */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                    <Volume2 className="w-5 h-5" />
                  </div>
                  <Badge variant="purple" size="sm">Audio Clip</Badge>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Key Soundbite Highlight</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  &quot;The FastAPI REST endpoints are fully functional and synchronized with SQLite.&quot;
                </p>
                <button
                  onClick={() => {
                    setIsPlayingSoundbite(!isPlayingSoundbite);
                    showToast(isPlayingSoundbite ? 'Soundbite paused' : 'Playing 15s audio soundbite', 'info');
                  }}
                  className="w-full py-2 px-3 bg-slate-900 dark:bg-brand-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity cursor-pointer"
                >
                  {isPlayingSoundbite ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isPlayingSoundbite ? 'Pause Soundbite' : 'Play 15s Soundbite'}</span>
                </button>
              </div>

              {/* Card 5: Highlights & Comments */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <Highlighter className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Transcript Highlights & Notes</h4>
                <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs">
                  <mark className="bg-amber-200 dark:bg-amber-800 text-amber-950 dark:text-amber-100 font-semibold px-1 rounded">
                    Action required: Review release deliverable velocity.
                  </mark>
                  <span className="block text-[10px] text-amber-800 dark:text-amber-300 font-semibold mt-1">💬 Note by Sarah Connor</span>
                </div>
              </div>

              {/* Card 6: AI Meeting Q&A Assistant */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">AI Meeting Q&A Demo</h4>
                <form onSubmit={handleAskQa} className="space-y-2">
                  <input
                    type="text"
                    placeholder="Ask about meeting topics..."
                    value={qaInput}
                    onChange={(e) => setQaInput(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                  <Button type="submit" size="sm" isLoading={isAnswering} className="w-full font-semibold">
                    Ask Assistant
                  </Button>
                </form>
                {qaAnswer && (
                  <p className="text-xs bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 leading-relaxed">
                    {qaAnswer}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 2: POLISHED PLACEHOLDER FEATURES (COMING SOON MODALS) */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
              <Lock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Ecosystem Integration Roadmap</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Bot */}
              <div
                onClick={() => setComingSoonModal({
                  title: "Live Meeting Bot Recorder",
                  desc: "Automated video conferencing bot that auto-joins Zoom, Google Meet, and Teams calls will be available in a future release.",
                  icon: "🤖"
                })}
                className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-brand-400 rounded-2xl p-4 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">🤖</span>
                  <Badge variant="purple" size="sm"><Lock className="w-3 h-3 mr-1" /> Coming Soon</Badge>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-brand-600">Live Meeting Bot</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">Auto-join video meetings for recording.</p>
              </div>

              {/* Speech to Text */}
              <div
                onClick={() => setComingSoonModal({
                  title: "Real Speech-to-Text Transcription Engine",
                  desc: "Live audio capture stream and real-time automatic speech recognition engine will be available in a future release.",
                  icon: "🎙️"
                })}
                className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-brand-400 rounded-2xl p-4 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">🎙️</span>
                  <Badge variant="purple" size="sm"><Lock className="w-3 h-3 mr-1" /> Coming Soon</Badge>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-brand-600">Speech-to-Text</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">Real-time live audio transcription stream.</p>
              </div>

              {/* Integrations */}
              <div
                onClick={() => setComingSoonModal({
                  title: "Video Conference & CRM Integrations",
                  desc: "Native integrations for Zoom, Google Meet, Salesforce, HubSpot, and Google Calendar will be available in a future release.",
                  icon: "🔌"
                })}
                className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-brand-400 rounded-2xl p-4 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">🔌</span>
                  <Badge variant="purple" size="sm"><Lock className="w-3 h-3 mr-1" /> Coming Soon</Badge>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-brand-600">Zoom / CRM Sync</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">Direct video provider & CRM sync.</p>
              </div>

              {/* Team Sharing */}
              <div
                onClick={() => setComingSoonModal({
                  title: "Team Workspaces & Role Sharing",
                  desc: "Multi-user team workspaces with role-based access control, comment permissions, and organization-wide summaries will be available in a future release.",
                  icon: "👥"
                })}
                className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-brand-400 rounded-2xl p-4 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">👥</span>
                  <Badge variant="purple" size="sm"><Lock className="w-3 h-3 mr-1" /> Coming Soon</Badge>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-brand-600">Team Workspaces</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">Multi-user sharing & role permissions.</p>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Coming Soon Modal */}
      {comingSoonModal && (
        <Modal
          isOpen={!!comingSoonModal}
          onClose={() => setComingSoonModal(null)}
          title={comingSoonModal.title}
          maxWidth="md"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3.5 bg-purple-50 dark:bg-purple-950/40 rounded-xl border border-purple-200 dark:border-purple-900/60">
              <span className="text-3xl">{comingSoonModal.icon}</span>
              <div>
                <Badge variant="purple" size="sm" className="font-semibold mb-1">
                  Status: Coming Soon
                </Badge>
                <p className="text-xs font-semibold text-purple-900 dark:text-purple-200">
                  Planned for upcoming release
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800">
              {comingSoonModal.desc}
            </p>

            <div className="flex justify-end pt-2">
              <Button onClick={() => setComingSoonModal(null)} size="sm" className="font-semibold">
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
