// export enum  {
// 	por enquanto não há nenhum enum neste projeto
// }
interface TImageData {
  data: Buffer;
  mimeType: "image/png" | "image/jpeg";
}

interface TNote {
  id: string; // Add a unique identifier for each note
  note: string;
  // Add any other fields relevant to the note here
}

interface TAnnotation {
  id: string; // Add a unique identifier for each note
  annotation: string;
  // Add any other fields relevant to the annotations here
}

interface TStudents {
  id: string;
  name: string;
  email: string;
  phone: number | null;
  age: number | null;
  notes?: TNote[]; // Array of note objects
  annotations?: TAnnotation[]; // Array of annotation objects
  photo?: TImageData | string | null;
  teacher_id: string;
  class_id: string;
}
interface TInactiveStudentsData {
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
interface TCalendarData {
  id: number;
  teacher_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
}

interface TPasswordResetData {
  id: number;
  user_id: string;
  token: string;
  expires_at: string;
}

interface TNotesData {
  id: number;
  student_id: string;
  teacher_id: string;
  note: string;
}

interface TChatData {
  id: number;
  student_id: string;
  teacher_id: string;
  message: string;
  timestamp: string;
}
