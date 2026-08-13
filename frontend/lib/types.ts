export interface Participant {
  id: string;
  meeting_id: string;
  name: string;
  email?: string | null;
}

export interface TranscriptSegment {
  id: string;
  meeting_id: string;
  speaker: string;
  timestamp_seconds: number;
  text: string;
  sequence_number: number;
}

export interface ActionItem {
  id: string;
  meeting_id: string;
  task: string;
  assignee: string;
  due_date?: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface Topic {
  id: string;
  meeting_id: string;
  title: string;
  description?: string | null;
  start_time: number;
}

export interface Meeting {
  id: string;
  title: string;
  meeting_date: string;
  duration: string;
  summary?: string | null;
  created_at: string;
  updated_at: string;
  participants: Participant[];
  topics?: Topic[];
  transcript_segments_count: number;
}

export interface MeetingDetail extends Meeting {
  transcript_segments: TranscriptSegment[];
  action_items: ActionItem[];
  topics: Topic[];
}

export interface CreateMeetingPayload {
  title: string;
  meeting_date: string;
  duration: string;
  summary?: string;
  participants: string[];
  raw_transcript?: string;
}

export interface UpdateMeetingPayload {
  title?: string;
  meeting_date?: string;
  duration?: string;
  summary?: string;
  participants?: string[];
}

export interface CreateActionItemPayload {
  task: string;
  assignee?: string;
  due_date?: string;
  completed?: boolean;
}

export interface UpdateActionItemPayload {
  task?: string;
  assignee?: string;
  due_date?: string;
  completed?: boolean;
}
