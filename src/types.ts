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

export interface TPasswordResetData {
  id: number;
  user_id: string;
  token: string;
  expires_at: string;
}
