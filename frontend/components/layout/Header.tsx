'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Plus, 
  Bell, 
  Menu, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Bot, 
  Calendar, 
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { useApp } from '@/lib/context';
import { api } from '@/lib/api';
import { Meeting } from '@/lib/types';
import { formatDate } from '@/lib/utils';

interface HeaderProps {
  title?: string;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  onOpenNewMeeting?: () => void;
  onOpenMobileSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title = "Meetings Dashboard",
  onOpenNewMeeting,
  onOpenMobileSidebar,
}) => {
  const router = useRouter();
  const { initials } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);

  // Global search state
  const [globalQuery, setGlobalQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Meeting[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Live Bot Coming Soon Modal
  const [isBotModalOpen, setIsBotModalOpen] = useState(false);

  const notificationsList = [
    { id: '1', title: 'Weekly Product Sync transcript ready', time: '10m ago', icon: CheckCircle2 },
    { id: '2', title: 'New action item assigned by Sarah', time: '1h ago', icon: AlertCircle },
    { id: '3', title: 'SQLite database auto-seeded successfully', time: '2h ago', icon: CheckCircle2 },
  ];

  // Debounced search handler for global search
  useEffect(() => {
    if (!globalQuery.trim() || globalQuery.trim().length < 2) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await api.getMeetings({ q: globalQuery.trim() });
        setSearchResults(results);
        setShowSearchDropdown(true);
      } catch (err) {
        console.error('Global search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [globalQuery]);

  // Click outside to close search dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectSearchResult = (meetingId: string) => {
    setShowSearchDropdown(false);
    setGlobalQuery('');
    router.push(`/meetings/${meetingId}`);
  };

  const handleAvatarClick = () => {
    router.push('/settings?tab=profile');
  };

  return (
    <header className="sticky top-0 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 md:px-8 py-3.5 flex items-center justify-between gap-4 transition-colors">
      {/* Title & Mobile Toggle */}
      <div className="flex items-center gap-3">
        {onOpenMobileSidebar && (
          <button
            onClick={onOpenMobileSidebar}
            className="md:hidden text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">{title}</h1>
      </div>

      {/* Center/Right Controls: Global Search, Live Bot CTA, New Meeting, Notifications, User Avatar */}
      <div className="flex items-center gap-3 flex-1 max-w-3xl justify-end">
        {/* Interactive Global Search Input & Dropdown */}
        <div ref={searchRef} className="relative flex-1 max-w-md hidden sm:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Global search meetings, topics, attendees..."
              value={globalQuery}
              onChange={(e) => setGlobalQuery(e.target.value)}
              onFocus={() => globalQuery.length >= 2 && setShowSearchDropdown(true)}
              className="w-full pl-9 pr-8 py-2 bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white dark:focus:bg-slate-800 transition-all font-medium"
            />
            {globalQuery && (
              <button
                onClick={() => {
                  setGlobalQuery('');
                  setShowSearchDropdown(false);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Search Floating Dropdown */}
          {showSearchDropdown && (
            <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-2 z-50 max-h-80 overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Search Results ({searchResults.length})
              </div>

              {isSearching ? (
                <div className="p-4 text-center text-xs text-slate-400">Searching workspace...</div>
              ) : searchResults.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400">
                  No meetings found matching &quot;{globalQuery}&quot;.
                </div>
              ) : (
                <div className="space-y-1">
                  {searchResults.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => handleSelectSearchResult(m.id)}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors group"
                    >
                      <div className="flex-1 min-w-0 pr-2">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 truncate">
                          {m.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(m.meeting_date)}
                          </span>
                          <span>•</span>
                          <span>{m.participants.length} attendees</span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-brand-600" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Live Bot "Coming Soon" CTA Button */}
        <Button
          onClick={() => setIsBotModalOpen(true)}
          variant="outline"
          size="md"
          className="hidden md:inline-flex shadow-2xs font-semibold shrink-0"
        >
          <Bot className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          <span>Join Bot</span>
        </Button>

        {/* New Meeting Button */}
        {onOpenNewMeeting && (
          <Button onClick={onOpenNewMeeting} size="md" className="shadow-sm font-semibold shrink-0">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Meeting</span>
          </Button>
        )}

        {/* Notification Bell Popover */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications"
            title="System notifications"
            className="relative p-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors shrink-0 cursor-pointer"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-600 rounded-full ring-2 ring-white dark:ring-slate-900" />
          </button>

          {showNotifications && (
            <>
              <div 
                className="fixed inset-0 z-30" 
                onClick={() => setShowNotifications(false)} 
              />
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-4 z-40 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Notifications
                  </h4>
                  <button 
                    onClick={() => setShowNotifications(false)}
                    className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-2.5">
                  {notificationsList.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.id} className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs">
                        <Icon className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-800 dark:text-slate-200 leading-snug">{item.title}</p>
                          <span className="text-[10px] text-slate-400 mt-0.5 block">{item.time}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Profile Avatar in Header */}
        <button
          onClick={handleAvatarClick}
          title="View Profile Settings"
          aria-label="User Profile Settings"
          className="w-8 h-8 rounded-full bg-slate-900 dark:bg-brand-600 text-white flex items-center justify-center text-xs font-bold shrink-0 border border-slate-200 dark:border-slate-700 cursor-pointer shadow-xs hover:scale-105 hover:ring-2 hover:ring-brand-500 transition-all"
        >
          {initials}
        </button>
      </div>

      {/* Live Bot Recorder Modal */}
      {isBotModalOpen && (
        <Modal
          isOpen={isBotModalOpen}
          onClose={() => setIsBotModalOpen(false)}
          title="Live Meeting Bot Recorder"
          maxWidth="md"
        >
          <div className="space-y-4">
            {/* Header Box & Coming Soon Badge */}
            <div className="flex items-center gap-3.5 p-4 bg-brand-50 dark:bg-brand-950/50 rounded-2xl border border-brand-200 dark:border-brand-900/60">
              <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white flex items-center justify-center font-bold text-2xl shrink-0 shadow-md">
                🤖
              </div>
              <div>
                <Badge variant="purple" size="sm" className="font-semibold mb-1">
                  Coming Soon
                </Badge>
                <h4 className="text-sm font-bold text-brand-950 dark:text-brand-100">
                  Live Meeting Bot Recorder
                </h4>
              </div>
            </div>

            {/* Description & Roadmap info */}
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              Automatically join and record live meetings with the MeetFlow AI bot.
            </p>

            <p className="text-xs text-slate-500 dark:text-slate-400 italic">
              This feature is currently a placeholder for the future roadmap.
            </p>

            {/* Feature bullets list */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-2">
              <h5 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Coming Soon features:
              </h5>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 font-medium">
                <li className="flex items-center gap-2">
                  <span className="text-brand-600 dark:text-brand-400 font-bold">•</span> Automatically join meetings
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-brand-600 dark:text-brand-400 font-bold">•</span> Real-time meeting recording
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-brand-600 dark:text-brand-400 font-bold">•</span> Live transcription
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-brand-600 dark:text-brand-400 font-bold">•</span> Automatic meeting summary
                </li>
              </ul>
            </div>

            {/* Footer Close Button */}
            <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
              <Button onClick={() => setIsBotModalOpen(false)} size="md" className="font-semibold px-6">
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </header>
  );
};
