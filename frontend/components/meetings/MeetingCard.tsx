'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  Calendar, 
  Clock, 
  MoreVertical, 
  Pencil, 
  Trash2, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Meeting } from '@/lib/types';
import { formatDate, getAvatarColor, getInitials } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';

interface MeetingCardProps {
  meeting: Meeting;
  onEdit?: (meeting: Meeting) => void;
  onDelete?: (meeting: Meeting) => void;
}

export const MeetingCard: React.FC<MeetingCardProps> = ({
  meeting,
  onEdit,
  onDelete,
}) => {
  const router = useRouter();
  const [showMenu, setShowMenu] = React.useState(false);

  const handleCardClick = () => {
    router.push(`/meetings/${meeting.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative bg-white dark:bg-[#0b0f19] border border-slate-200/90 dark:border-slate-800/90 rounded-2xl p-5 shadow-xs hover-card-elevation flex flex-col justify-between cursor-pointer transition-all duration-200"
    >
      <div>
        {/* Top Status Row & 3-Dot Options Menu */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <Badge variant="default" size="sm" className="font-bold bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200 dark:border-brand-900/80">
              <Sparkles className="w-3 h-3 mr-1 text-brand-600 dark:text-brand-400" />
              Processed
            </Badge>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {meeting.transcript_segments_count} segments
            </span>
          </div>

          {/* Action Options Dropdown */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(false);
                  }}
                />
                <div className="absolute right-0 mt-1 w-40 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-20 animate-in fade-in zoom-in-95 duration-150">
                  {onEdit && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowMenu(false);
                        onEdit(meeting);
                      }}
                      className="w-full px-3.5 py-2 text-left text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                    >
                      <Pencil className="w-3.5 h-3.5 text-slate-500" />
                      Edit Details
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowMenu(false);
                        onDelete(meeting);
                      }}
                      className="w-full px-3.5 py-2 text-left text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 flex items-center gap-2 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                      Delete Meeting
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Meeting Title */}
        <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug line-clamp-1 mb-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
          {meeting.title}
        </h3>

        {/* Summary Snippet */}
        {meeting.summary && (
          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4 font-medium">
            {meeting.summary}
          </p>
        )}

        {/* Date & Duration Badges */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400 mb-4 font-medium">
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/60 px-2.5 py-1 rounded-xl border border-slate-200/80 dark:border-slate-800">
            <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
            <span>{formatDate(meeting.meeting_date)}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/60 px-2.5 py-1 rounded-xl border border-slate-200/80 dark:border-slate-800">
            <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
            <span>{meeting.duration}</span>
          </div>
        </div>
      </div>

      {/* Footer Row: Attendees & Open Button */}
      <div className="pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2 mt-auto">
        {/* Attendee Avatars */}
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2 overflow-hidden py-0.5">
            {meeting.participants.slice(0, 4).map((p) => (
              <div
                key={p.id}
                title={p.name}
                className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-[10px] font-bold border-2 border-white dark:border-slate-900 shadow-2xs ${getAvatarColor(p.name)}`}
              >
                {getInitials(p.name)}
              </div>
            ))}
            {meeting.participants.length > 4 && (
              <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold border-2 border-white dark:border-slate-900">
                +{meeting.participants.length - 4}
              </div>
            )}
          </div>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium hidden sm:inline">
            {meeting.participants.length} attendees
          </span>
        </div>

        {/* Open Button CTA */}
        <div className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 dark:text-brand-400 group-hover:text-white bg-brand-50 dark:bg-brand-950/60 group-hover:bg-brand-600 px-3 py-1.5 rounded-xl transition-all">
          <span>Open</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
};
