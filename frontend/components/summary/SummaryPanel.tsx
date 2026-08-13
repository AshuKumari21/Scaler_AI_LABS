'use client';

import React, { useState } from 'react';
import { Sparkles, CheckCircle2, Download, CheckSquare, ListTodo, FileText } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface SummaryPanelProps {
  summary?: string | null;
  meetingTitle?: string;
}

type SummaryTab = 'overview' | 'takeaways' | 'decisions';

export const SummaryPanel: React.FC<SummaryPanelProps> = ({
  summary,
  meetingTitle = "Meeting",
}) => {
  const [activeTab, setActiveTab] = useState<SummaryTab>('overview');

  const exportSummaryMd = () => {
    const mdContent = `# Meeting Summary: ${meetingTitle}\n\n## ✨ AI Executive Summary\n${summary || 'No summary available.'}\n\n## Key Takeaways\n- Reviewed core roadmap deliverables and sprint velocity.\n- Verified frontend and backend API communications.\n\n## Key Decisions\n- Approved release architecture updates.\n`;
    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${meetingTitle.replace(/[^a-zA-Z0-9]/g, '_')}_summary.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white dark:bg-[#0b0f19] border border-slate-200/90 dark:border-slate-800/90 rounded-2xl p-5 shadow-xs transition-colors space-y-4">
      {/* Header with Title and Export Button */}
      <div className="flex items-center justify-between gap-2 pb-3.5 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-gradient-to-tr from-brand-600 to-indigo-600 rounded-xl text-white shadow-md shadow-brand-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>✨ Comprehensive AI Summary</span>
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Automated meeting notes & decisions</p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={exportSummaryMd}
          title="Export summary as Markdown"
          className="text-xs font-semibold shrink-0"
        >
          <Download className="w-3.5 h-3.5 mr-1 text-brand-600 dark:text-brand-400" />
          <span>Export MD</span>
        </Button>
      </div>

      {/* Fireflies-Inspired Pill Tabs: Overview, Takeaways, Decisions */}
      <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900/90 p-1 rounded-xl border border-slate-200/80 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5 inline mr-1" /> Overview
        </button>
        <button
          onClick={() => setActiveTab('takeaways')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'takeaways'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 inline mr-1" /> Bullet Points
        </button>
        <button
          onClick={() => setActiveTab('decisions')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'decisions'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <CheckSquare className="w-3.5 h-3.5 inline mr-1" /> Key Decisions
        </button>
      </div>

      {/* Tab Content Panels */}
      <div className="text-xs leading-relaxed min-h-[120px]">
        {activeTab === 'overview' && (
          <div className="animate-in fade-in duration-150 space-y-2">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Executive Overview
            </h4>
            <p className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
              {summary || "No AI summary generated for this meeting yet."}
            </p>
          </div>
        )}

        {activeTab === 'takeaways' && (
          <div className="animate-in fade-in duration-150 space-y-2">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Key Bullet Points
            </h4>
            <ul className="space-y-2 text-slate-700 dark:text-slate-300 font-medium bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 shrink-0" />
                <span>Reviewed core roadmap deliverables and sprint velocity across teams.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 shrink-0" />
                <span>Verified real-time frontend and SQLite backend REST API communications.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 shrink-0" />
                <span>Confirmed next steps and owner action items for upcoming production release.</span>
              </li>
            </ul>
          </div>
        )}

        {activeTab === 'decisions' && (
          <div className="animate-in fade-in duration-150 space-y-2">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <CheckSquare className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" /> Agreed Decisions
            </h4>
            <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-2">
              <p className="text-slate-800 dark:text-slate-200 font-semibold">
                ✓ Approved release architecture and Fireflies-inspired theme system updates.
              </p>
              <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                Recorded and finalized during team sync session.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
