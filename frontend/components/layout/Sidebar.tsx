'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Home, 
  Video, 
  UserCheck, 
  Settings, 
  Mic, 
  Sparkles,
  ChevronRight,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useApp } from '@/lib/context';

interface SidebarProps {
  isMobileOpen?: boolean;
  setIsMobileOpen?: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, setIsMobileOpen }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, initials } = useApp();

  const navItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Meetings', href: '/meetings', icon: Video },
    { label: 'My Meetings', href: '/my-meetings', icon: UserCheck },
    { label: 'Advanced Features', href: '/advanced-features', icon: Sparkles },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  const handleProfileClick = () => {
    if (setIsMobileOpen) setIsMobileOpen(false);
    router.push('/settings?tab=profile');
  };

  const content = (
    <div className="flex flex-col h-full bg-[#0b0f19] dark:bg-[#070a12] text-white w-64 p-4 border-r border-slate-800/80 transition-colors">
      {/* Brand Logo Header */}
      <div className="flex items-center justify-between px-2 py-3 mb-6">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-brand-500/30 group-hover:scale-105 transition-transform shrink-0">
            <Mic className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight text-white">MeetFlow</span>
              <span className="text-[10px] uppercase font-black bg-brand-500/20 text-brand-300 px-1.5 py-0.5 rounded-md border border-brand-500/40">AI</span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">AI Meeting Workspace</p>
          </div>
        </Link>

        {setIsMobileOpen && (
          <button 
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800/80 cursor-pointer"
            aria-label="Close Mobile Sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Main Navigation Items */}
      <nav className="flex-1 space-y-1.5">
        <div className="px-3 pb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Workspace Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname === item.href || pathname.startsWith(item.href + '/');

          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all group cursor-pointer select-none",
                isActive
                  ? "bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-md shadow-brand-600/30 font-bold"
                  : "text-slate-300 hover:bg-slate-800/70 hover:text-white"
              )}
            >
              <Icon className={cn("w-4 h-4 transition-colors", isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200")} />
              <span>{item.label}</span>
              {isActive && <ChevronRight className="w-4 h-4 ml-auto opacity-80" />}
            </Link>
          );
        })}
      </nav>

      {/* AI Assistant Banner */}
      <div className="mt-auto mb-4 p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950/80 border border-slate-800 shadow-md">
        <div className="flex items-center gap-2 text-xs font-bold text-brand-300 mb-1">
          <Sparkles className="w-4 h-4" />
          <span>MeetFlow AI Engine</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
          Smart transcript indexing, executive AI summaries & timestamp chapter seeking enabled.
        </p>
      </div>

      {/* Dynamic User Profile Footer Link */}
      <div
        onClick={handleProfileClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handleProfileClick()}
        title="View Profile Settings"
        className="pt-3 border-t border-slate-800/80 flex items-center gap-3 px-2 py-2 rounded-2xl hover:bg-slate-800/80 transition-colors cursor-pointer group"
      >
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-500 to-purple-500 text-white flex items-center justify-center font-extrabold text-sm shadow-md border border-slate-700 shrink-0 group-hover:scale-105 transition-transform">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-white truncate group-hover:text-brand-300 transition-colors">
            {profile.name}
          </p>
          <p className="text-[11px] text-slate-400 truncate font-medium">{profile.email}</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block h-screen sticky top-0 shrink-0 z-30">
        {content}
      </aside>

      {/* Mobile Drawer Sidebar */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div 
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
            onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
          />
          <div className="relative flex-1 max-w-xs w-full bg-[#0b0f19] animate-in slide-in-from-left duration-200">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
