// export enum  {
// 	por enquanto não há nenhum enum neste projeto
// }
export type TImageData = {
  data: Buffer;
  mimeType: "image/png" | "image/jpeg";
};

export type TStudents = {
  id: string;
  name: string;
  email: string;
  phone: number | null;
  age: number | null;
  notes?: string[];
  annotations?: string[];
  photo?: TImageData | string | null;
  teacher_id: string;
  class_id: string;
};
export type TInactiveStudentsData = {
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
};
export type TCalendarData = {
  id: number;
  teacher_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
};

export type TPasswordResetData = {
  id: number;
  user_id: string;
  token: string;
  expires_at: string;
};

export type TNotesData = {
  id: number;
  student_id: string;
  teacher_id: string;
  note: string;
};

export type TChatData = {
  id: number;
  student_id: string;
  teacher_id: string;
  message: string;
  timestamp: string;
};
