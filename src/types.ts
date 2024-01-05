export interface TInactiveStudentsData {
  id: string;
  name: string;
  email: string;
  phone?: number;
  age?: number;
  notes: string;
  annotations: string;
  photo: Buffer;
  teacher_id: string;
  class_id: string;
}
export interface TCalendarData {
  id: number;
  teacher_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
}

export interface TPasswordResetData {
  id: number;
  user_id: string;
  token: string;
  expires_at: string;
}

export interface TNotesData {
  id: number;
  student_id: string;
  teacher_id: string;
  note: string;
}

export interface TChatData {
  id: number;
  student_id: string;
  teacher_id: string;
  message: string;
  timestamp: string;
}
