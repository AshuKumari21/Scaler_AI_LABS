'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'md',
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  const modalJSX = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-hidden">
      {/* Viewport Backdrop Overlay */}
      <div 
        className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Centered Modal Card Container */}
      <div 
        className={cn(
          "relative z-10 w-full flex flex-col max-h-[calc(100vh-24px)] sm:max-h-[calc(100vh-32px)] rounded-2xl bg-white dark:bg-[#0b0f19] p-5 sm:p-6 text-left align-middle shadow-2xl transition-all animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white",
          "w-[calc(100vw-24px)] sm:w-[calc(100vw-32px)]",
          maxWidthClasses[maxWidth]
        )}
        style={{ width: 'min(600px, calc(100vw - 32px))' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header (Always Visible at Top) */}
        <div className="flex items-start justify-between pb-3.5 mb-3.5 border-b border-slate-100 dark:border-slate-800/80 shrink-0">
          <div>
            {title && <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer shrink-0 ml-2"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4 min-h-0">
          {children}
        </div>
      </div>
    </div>
  );

  return createPortal(modalJSX, document.body);
};
