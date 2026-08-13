'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Meeting } from '@/lib/types';
import { api } from '@/lib/api';
import { useToast } from '@/components/ui/Toast';
import { AlertTriangle } from 'lucide-react';

interface DeleteMeetingModalProps {
  isOpen: boolean;
  meeting: Meeting | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const DeleteMeetingModal: React.FC<DeleteMeetingModalProps> = ({
  isOpen,
  meeting,
  onClose,
  onSuccess,
}) => {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  if (!meeting) return null;

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await api.deleteMeeting(meeting.id);
      showToast('Meeting deleted successfully', 'success');
      onSuccess();
      onClose();
    } catch (err: any) {
      showToast('Failed to delete meeting', 'error', err.message || 'Server error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Meeting"
      maxWidth="md"
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3.5 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900/60 text-rose-800 dark:text-rose-200">
          <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed">
            <p className="font-semibold text-rose-900 dark:text-rose-100 mb-1">
              Are you sure you want to delete &quot;{meeting.title}&quot;?
            </p>
            <p className="text-rose-700 dark:text-rose-300">
              This action cannot be undone. All associated transcript segments, action items, participants, and chapter topics will be permanently removed from SQLite.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            isLoading={isLoading}
            onClick={handleDelete}
            className="font-semibold"
          >
            Delete Meeting
          </Button>
        </div>
      </div>
    </Modal>
  );
};
