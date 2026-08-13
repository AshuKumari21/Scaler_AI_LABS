'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';
import { useToast } from '@/components/ui/Toast';
import { Sparkles, Info } from 'lucide-react';

interface CreateMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateMeetingModal: React.FC<CreateMeetingModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { showToast } = useToast();
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().substring(0, 16));
  const [duration, setDuration] = useState('30 mins');
  const [participants, setParticipants] = useState('John Doe <john.doe@meetflow.io>, Sarah Connor <sarah.c@meetflow.io>');
  const [rawTranscript, setRawTranscript] = useState(
`[00:00] John Doe:
Good morning everyone, welcome to our project alignment session.

[00:15] Sarah Connor:
Thanks John! Today we will review the new transcript player and action items.

[00:35] Mike Ross:
The backend REST APIs in FastAPI are fully functional and connected to SQLite.`
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Meeting title is required', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const partList = participants.split(',').map((p) => p.trim()).filter(Boolean);
      await api.createMeeting({
        title: title.trim(),
        meeting_date: new Date(date).toISOString(),
        duration: duration.trim(),
        participants: partList,
        raw_transcript: rawTranscript.trim(),
      });

      showToast('Meeting created successfully!', 'success', 'Transcript parsed and stored in database.');
      onSuccess();
      onClose();
    } catch (err: any) {
      showToast('Failed to create meeting', 'error', err.message || 'Server error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Meeting"
      subtitle="Import a meeting transcript or create a new session record"
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Meeting Title <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Q4 Executive Leadership Sync"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
          />
        </div>

        {/* Date & Duration Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Date & Time
            </label>
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Duration
            </label>
            <input
              type="text"
              placeholder="e.g. 30 mins, 45 mins"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
            />
          </div>
        </div>

        {/* Participants */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Participants (comma separated)
          </label>
          <input
            type="text"
            placeholder="John Doe <john@example.com>, Sarah Connor"
            value={participants}
            onChange={(e) => setParticipants(e.target.value)}
            className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
          />
        </div>

        {/* Raw Transcript Input */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Paste Transcript Text
            </label>
            <span className="text-[11px] text-brand-600 dark:text-brand-400 font-medium flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Auto-Parses Timestamps
            </span>
          </div>
          <textarea
            rows={5}
            placeholder={`[00:00] John:\nGood morning everyone.\n[00:15] Sarah:\nToday we will review project goals.`}
            value={rawTranscript}
            onChange={(e) => setRawTranscript(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 leading-relaxed"
          />
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
            <Info className="w-3 h-3 shrink-0 text-slate-400" />
            Format: <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-[10px]">[MM:SS] Speaker: text</code>
          </p>
        </div>

        {/* Form Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading} className="font-semibold">
            Create Meeting
          </Button>
        </div>
      </form>
    </Modal>
  );
};
