import {
  Meeting,
  MeetingDetail,
  CreateMeetingPayload,
  UpdateMeetingPayload,
  ActionItem,
  CreateActionItemPayload,
  UpdateActionItemPayload,
  TranscriptSegment,
  Topic
} from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

async function fetcher<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!res.ok) {
      let errorMessage = `HTTP error! Status: ${res.status}`;
      try {
        const errorData = await res.json();
        if (errorData.detail) {
          errorMessage = typeof errorData.detail === 'string' ? errorData.detail : JSON.stringify(errorData.detail);
        }
      } catch {
        // Fallback to default message if response isn't JSON
      }
      throw new Error(errorMessage);
    }

    return await res.json();
  } catch (err: any) {
    console.error(`API Request Error [${endpoint}]:`, err);
    throw err;
  }
}

export const api = {
  // Meetings API
  getMeetings: async (params?: { q?: string; participant?: string; sort_by?: string }): Promise<Meeting[]> => {
    const searchParams = new URLSearchParams();
    if (params?.q) searchParams.set('q', params.q);
    if (params?.participant) searchParams.set('participant', params.participant);
    if (params?.sort_by) searchParams.set('sort_by', params.sort_by);
    
    const queryStr = searchParams.toString();
    return fetcher<Meeting[]>(`/meetings${queryStr ? `?${queryStr}` : ''}`);
  },

  getMeeting: async (id: string): Promise<MeetingDetail> => {
    return fetcher<MeetingDetail>(`/meetings/${id}`);
  },

  createMeeting: async (payload: CreateMeetingPayload): Promise<MeetingDetail> => {
    return fetcher<MeetingDetail>('/meetings', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  updateMeeting: async (id: string, payload: UpdateMeetingPayload): Promise<MeetingDetail> => {
    return fetcher<MeetingDetail>(`/meetings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  deleteMeeting: async (id: string): Promise<{ message: string; id: string }> => {
    return fetcher<{ message: string; id: string }>(`/meetings/${id}`, {
      method: 'DELETE',
    });
  },

  // Transcript API
  getTranscript: async (meetingId: string): Promise<TranscriptSegment[]> => {
    return fetcher<TranscriptSegment[]>(`/meetings/${meetingId}/transcript`);
  },

  // Action Items API
  createActionItem: async (meetingId: string, payload: CreateActionItemPayload): Promise<ActionItem> => {
    return fetcher<ActionItem>(`/meetings/${meetingId}/action-items`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  updateActionItem: async (actionItemId: string, payload: UpdateActionItemPayload): Promise<ActionItem> => {
    return fetcher<ActionItem>(`/action-items/${actionItemId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  deleteActionItem: async (actionItemId: string): Promise<{ message: string; id: string }> => {
    return fetcher<{ message: string; id: string }>(`/action-items/${actionItemId}`, {
      method: 'DELETE',
    });
  },

  // Topics API
  getTopics: async (meetingId: string): Promise<Topic[]> => {
    return fetcher<Topic[]>(`/meetings/${meetingId}/topics`);
  },
};
