'use client';

import React, { useState } from 'react';
import { ActionItem } from '@/lib/types';
import { api } from '@/lib/api';
import { useToast } from '@/components/ui/Toast';
import { 
  CheckSquare, 
  Square, 
  Plus, 
  Trash2, 
  Pencil, 
  Calendar,
  ListTodo
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { getAvatarColor, getInitials } from '@/lib/utils';

interface ActionItemsProps {
  meetingId: string;
  actionItems: ActionItem[];
  onRefresh: () => void;
}

export const ActionItems: React.FC<ActionItemsProps> = ({
  meetingId,
  actionItems,
  onRefresh,
}) => {
  const { showToast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [newTask, setNewTask] = useState('');
  const [newAssignee, setNewAssignee] = useState('Unassigned');
  const [newDueDate, setNewDueDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTask, setEditTask] = useState('');
  const [editAssignee, setEditAssignee] = useState('');
  const [editDueDate, setEditDueDate] = useState('');

  const handleToggleComplete = async (item: ActionItem) => {
    try {
      await api.updateActionItem(item.id, { completed: !item.completed });
      showToast(
        !item.completed ? 'Action item completed!' : 'Action item marked pending',
        'success'
      );
      onRefresh();
    } catch (err: any) {
      showToast('Failed to update action item', 'error');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    setIsSubmitting(true);
    try {
      await api.createActionItem(meetingId, {
        task: newTask.trim(),
        assignee: newAssignee.trim() || 'Unassigned',
        due_date: newDueDate || undefined,
        completed: false,
      });

      showToast('Action item added', 'success');
      setNewTask('');
      setNewDueDate('');
      setIsAdding(false);
      onRefresh();
    } catch (err: any) {
      showToast('Failed to add action item', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartEdit = (item: ActionItem) => {
    setEditingId(item.id);
    setEditTask(item.task);
    setEditAssignee(item.assignee);
    setEditDueDate(item.due_date || '');
  };

  const handleSaveEdit = async (id: string) => {
    if (!editTask.trim()) return;
    try {
      await api.updateActionItem(id, {
        task: editTask.trim(),
        assignee: editAssignee.trim() || 'Unassigned',
        due_date: editDueDate || undefined,
      });
      showToast('Action item updated', 'success');
      setEditingId(null);
      onRefresh();
    } catch (err: any) {
      showToast('Failed to edit action item', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteActionItem(id);
      showToast('Action item deleted', 'success');
      onRefresh();
    } catch (err: any) {
      showToast('Failed to delete action item', 'error');
    }
  };

  return (
    <div className="bg-white dark:bg-[#0b0f19] border border-slate-200/90 dark:border-slate-800/90 rounded-2xl p-5 shadow-xs transition-colors space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 pb-3.5 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-gradient-to-tr from-emerald-600 to-teal-600 rounded-xl text-white shadow-md shadow-emerald-500/20">
            <ListTodo className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Action Items</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              {actionItems.filter((i) => i.completed).length} of {actionItems.length} completed
            </p>
          </div>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={() => setIsAdding(!isAdding)}
          className="text-xs font-semibold shrink-0"
        >
          <Plus className="w-3.5 h-3.5 mr-1 text-emerald-600 dark:text-emerald-400" />
          <span>Add Task</span>
        </Button>
      </div>

      {/* Inline Create Form */}
      {isAdding && (
        <form onSubmit={handleCreate} className="p-3.5 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2.5 animate-in fade-in duration-150 shadow-2xs">
          <input
            type="text"
            required
            placeholder="Action item task description..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Assignee name"
              value={newAssignee}
              onChange={(e) => setNewAssignee(e.target.value)}
              className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
            />
            <input
              type="date"
              value={newDueDate}
              onChange={(e) => setNewDueDate(e.target.value)}
              className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
            />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsAdding(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={isSubmitting} className="font-semibold">
              Save Task
            </Button>
          </div>
        </form>
      )}

      {/* Action Items List */}
      <div className="space-y-2">
        {actionItems.length === 0 ? (
          <p className="text-xs text-slate-400 dark:text-slate-500 italic p-3 text-center">No action items recorded for this meeting.</p>
        ) : (
          actionItems.map((item) => {
            const isEditing = editingId === item.id;
            return (
              <div
                key={item.id}
                className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                  item.completed
                    ? 'bg-slate-50/60 dark:bg-slate-900/40 border-slate-200/80 dark:border-slate-800/60 opacity-80'
                    : 'bg-slate-50/80 dark:bg-slate-850 border-slate-200/90 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {/* Checkbox */}
                  <button
                    onClick={() => handleToggleComplete(item)}
                    className="text-slate-400 hover:text-emerald-600 transition-colors shrink-0 cursor-pointer p-0.5"
                    aria-label="Toggle completion status"
                  >
                    {item.completed ? (
                      <CheckSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>

                  {/* Task Description or Edit Form */}
                  <div className="min-w-0 flex-1">
                    {isEditing ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={editTask}
                          onChange={(e) => setEditTask(e.target.value)}
                          className="w-full px-2.5 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded-lg dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 font-medium"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={editAssignee}
                            onChange={(e) => setEditAssignee(e.target.value)}
                            className="px-2.5 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded-lg dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                          />
                          <input
                            type="date"
                            value={editDueDate}
                            onChange={(e) => setEditDueDate(e.target.value)}
                            className="px-2.5 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded-lg dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                          />
                        </div>
                        <div className="flex gap-2 justify-end">
                          <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                            Cancel
                          </Button>
                          <Button size="sm" onClick={() => handleSaveEdit(item.id)}>
                            Save
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p
                        className={`text-xs font-bold leading-snug truncate ${
                          item.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-white'
                        }`}
                      >
                        {item.task}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right side: Assignee Badge & Edit/Delete controls */}
                {!isEditing && (
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                      <div
                        className={`w-3.5 h-3.5 rounded-full text-[8px] font-extrabold flex items-center justify-center ${getAvatarColor(
                          item.assignee
                        )}`}
                      >
                        {getInitials(item.assignee)}
                      </div>
                      <span>{item.assignee}</span>
                    </div>

                    <button
                      onClick={() => handleStartEdit(item)}
                      className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded hover:bg-slate-200/50 dark:hover:bg-slate-800 cursor-pointer"
                      title="Edit task"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded hover:bg-rose-50 dark:hover:bg-rose-950/50 cursor-pointer"
                      title="Delete task"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
