'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { User, Bell, Palette, Cable, Sparkles, Check, Lock, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { useApp } from '@/lib/context';

type TabType = 'profile' | 'notifications' | 'appearance' | 'integrations';

interface IntegrationItem {
  id: string;
  name: string;
  desc: string;
  icon: string;
  status: string;
  detailedInfo: string;
}

function SettingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const { 
    profile, 
    updateProfile, 
    theme, 
    setTheme, 
    notifications, 
    updateNotification 
  } = useApp();

  const queryTab = searchParams.get('tab') as TabType;
  const [activeTab, setActiveTab] = useState<TabType>(
    queryTab && ['profile', 'notifications', 'appearance', 'integrations'].includes(queryTab)
      ? queryTab
      : 'profile'
  );

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Profile form state
  const [nameInput, setNameInput] = useState(profile.name);
  const [emailInput, setEmailInput] = useState(profile.email);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Integration Modal state
  const [selectedIntegration, setSelectedIntegration] = useState<IntegrationItem | null>(null);

  useEffect(() => {
    if (queryTab && ['profile', 'notifications', 'appearance', 'integrations'].includes(queryTab)) {
      setActiveTab(queryTab);
    }
  }, [queryTab]);

  useEffect(() => {
    setNameInput(profile.name);
    setEmailInput(profile.email);
  }, [profile]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    router.push(`/settings?tab=${tab}`);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) {
      showToast('Full name is required', 'error');
      return;
    }

    setIsSavingProfile(true);
    try {
      updateProfile(nameInput, emailInput);
      showToast('Profile updated successfully', 'success', 'User name and avatar initials updated across MeetFlow.');
    } catch (err: any) {
      showToast('Failed to update profile', 'error');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const integrationsList: IntegrationItem[] = [
    {
      id: 'zoom',
      name: 'Zoom Integration',
      desc: 'Auto-join Zoom meetings with Fireflies bot recorder',
      icon: '🎥',
      status: 'Coming Soon',
      detailedInfo: 'Automatic Zoom meeting join and real-time recording bot integration will be available in a future release.',
    },
    {
      id: 'meet',
      name: 'Google Meet Bot',
      desc: 'Capture Google Meet transcripts directly into MeetFlow',
      icon: '📹',
      status: 'Coming Soon',
      detailedInfo: 'Google Meet bot integration and live audio capture stream will be available in a future release.',
    },
    {
      id: 'slack',
      name: 'Slack Bot Sync',
      desc: 'Post automated meeting summaries directly to Slack channels',
      icon: '💬',
      status: 'Coming Soon',
      detailedInfo: 'Slack webhooks integration for posting AI takeaway summaries to designated channels will be available in a future release.',
    },
    {
      id: 'teams',
      name: 'Microsoft Teams',
      desc: 'Sync action items into Teams workspace tasks',
      icon: '👥',
      status: 'Coming Soon',
      detailedInfo: 'Microsoft Teams task sync and workspace assistant will be available in a future release.',
    },
    {
      id: 'zapier',
      name: 'Zapier Webhooks',
      desc: 'Trigger automated workflows on new transcript creation',
      icon: '⚡',
      status: 'Coming Soon',
      detailedInfo: 'Zapier webhook triggers and automated multi-app workflows will be available in a future release.',
    },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      <Sidebar 
        isMobileOpen={isMobileSidebarOpen} 
        setIsMobileOpen={setIsMobileSidebarOpen} 
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          title="Workspace Settings"
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-5xl w-full mx-auto space-y-6">
          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-px">
            <button
              onClick={() => handleTabChange('profile')}
              className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 cursor-pointer ${
                activeTab === 'profile'
                  ? 'border-brand-600 text-brand-600 dark:text-brand-400 bg-white dark:bg-slate-900 shadow-2xs'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <User className="w-4 h-4 inline mr-2" /> Profile
            </button>
            <button
              onClick={() => handleTabChange('notifications')}
              className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 cursor-pointer ${
                activeTab === 'notifications'
                  ? 'border-brand-600 text-brand-600 dark:text-brand-400 bg-white dark:bg-slate-900 shadow-2xs'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <Bell className="w-4 h-4 inline mr-2" /> Notifications
            </button>
            <button
              onClick={() => handleTabChange('appearance')}
              className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 cursor-pointer ${
                activeTab === 'appearance'
                  ? 'border-brand-600 text-brand-600 dark:text-brand-400 bg-white dark:bg-slate-900 shadow-2xs'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <Palette className="w-4 h-4 inline mr-2" /> Appearance
            </button>
            <button
              onClick={() => handleTabChange('integrations')}
              className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 cursor-pointer ${
                activeTab === 'integrations'
                  ? 'border-brand-600 text-brand-600 dark:text-brand-400 bg-white dark:bg-slate-900 shadow-2xs'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <Cable className="w-4 h-4 inline mr-2" /> Integrations
            </button>
          </div>

          {/* TAB 1: PROFILE */}
          {activeTab === 'profile' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">User Profile Settings</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Update your display name and email address. Changes propagate across the application in real-time.
                </p>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                  />
                </div>

                <div className="pt-2">
                  <Button type="submit" isLoading={isSavingProfile} className="font-semibold">
                    Save Profile
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Email & Alert Preferences</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Manage automated email notifications and app alert preferences. Settings persist across sessions.
                </p>
              </div>

              <div className="space-y-4 max-w-xl">
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">Email Summary Alerts</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Receive email notification when an AI meeting summary is processed</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.emailSummary}
                    onChange={(e) => updateNotification('emailSummary', e.target.checked)}
                    className="w-4 h-4 rounded accent-brand-600 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">Action Item Assignments</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Notify me when an action item task is assigned to my profile</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.actionItemAssigned}
                    onChange={(e) => updateNotification('actionItemAssigned', e.target.checked)}
                    className="w-4 h-4 rounded accent-brand-600 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">Weekly Productivity Digest</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Receive weekly summary of meeting stats and completed tasks</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.weeklyDigest}
                    onChange={(e) => updateNotification('weeklyDigest', e.target.checked)}
                    className="w-4 h-4 rounded accent-brand-600 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: APPEARANCE */}
          {activeTab === 'appearance' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Theme & Visual Mode</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Choose your preferred workspace theme. Light mode provides a clean white UI with blue accents; Dark mode provides a sleek dark slate UI with blue accents.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-xl">
                {/* Light Theme Card */}
                <div
                  onClick={() => setTheme('light')}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                    theme === 'light'
                      ? 'border-brand-600 bg-white shadow-md ring-2 ring-brand-500/20'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                      <Sun className="w-5 h-5" />
                    </div>
                    {theme === 'light' && (
                      <Badge variant="default" size="sm" className="font-semibold bg-brand-50 text-brand-700 border-brand-200">
                        <Check className="w-3 h-3 mr-1" /> Active
                      </Badge>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Light Theme</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Clean, crisp white interface with vibrant blue primary accents and high contrast text.
                  </p>
                </div>

                {/* Dark Theme Card */}
                <div
                  onClick={() => setTheme('dark')}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                    theme === 'dark'
                      ? 'border-brand-500 bg-slate-900 text-white shadow-md ring-2 ring-brand-500/30'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-900/90 text-white hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 rounded-xl bg-indigo-900/80 text-brand-300">
                      <Moon className="w-5 h-5" />
                    </div>
                    {theme === 'dark' && (
                      <Badge variant="purple" size="sm" className="font-semibold bg-brand-500 text-white border-brand-400">
                        <Check className="w-3 h-3 mr-1" /> Active
                      </Badge>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-white">Dark Theme</h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Sleek, dark slate & black low-light aesthetic with blue accents for night productivity.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: INTEGRATIONS */}
          {activeTab === 'integrations' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-brand-900 to-indigo-900 text-white rounded-3xl p-6 shadow-md flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-brand-300" /> Integrations Ecosystem
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 max-w-xl">
                    Connect MeetFlow with your video conferencing tools and communication channels. Click any card to preview upcoming integration details.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {integrationsList.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedIntegration(item)}
                    className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-brand-300 dark:hover:border-brand-500 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex items-start justify-between gap-4 group"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="text-2xl p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl group-hover:scale-105 transition-transform">{item.icon}</div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">{item.name}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                    <Badge variant="purple" size="sm" className="shrink-0 font-semibold">
                      <Lock className="w-3 h-3 mr-1" />
                      {item.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Integration Detail Modal */}
      {selectedIntegration && (
        <Modal
          isOpen={!!selectedIntegration}
          onClose={() => setSelectedIntegration(null)}
          title={selectedIntegration.name}
          maxWidth="md"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-950/40 rounded-xl border border-purple-200 dark:border-purple-900/60">
              <span className="text-3xl">{selectedIntegration.icon}</span>
              <div>
                <Badge variant="purple" size="sm" className="font-semibold mb-1">
                  Status: {selectedIntegration.status}
                </Badge>
                <p className="text-xs font-semibold text-purple-900 dark:text-purple-200">
                  {selectedIntegration.desc}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800">
              {selectedIntegration.detailedInfo}
            </p>

            <div className="flex justify-end pt-2">
              <Button onClick={() => setSelectedIntegration(null)} size="sm" className="font-semibold">
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={
      <div className="p-8 text-center text-xs text-slate-500">Loading settings...</div>
    }>
      <SettingsContent />
    </Suspense>
  );
}
