export enum USER_ROLES {
  NORMAL = "NORMAL",
  ADMIN = "ADMIN",
}

export interface ImageData {
  data: Buffer;
  mimeType?: "image/png" | "image/jpeg";
}

export interface StudentsWithCreatorName {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  age: number | null;
  notes: Array<{
    notesId: string;
    notesText: string;
  }>;
  annotations: Array<{
    annotationsId: string;
    annotationsText: string;
  }>;
  photo?: ImageData | string | null | undefined;
  teacher_id: string;
  created_at: string;
  role: USER_ROLES;
  updated_at: string;
  creator_name: string;
}

export interface StudentDB {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  age: number | null;
  notes: Array<{
    notesId: string;
    notesText: string;
  }>;
  annotations: Array<{
    annotationsId: string;
    annotationsText: string;
  }>;
  photo: ImageData | string | null;
  teacher_id: string;
  created_at: string;
  role: USER_ROLES;
  updated_at: string;
}
export interface StudentModel {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  age: number | null;
  notes: Array<{
    id: string;
    notes: string;
  }>;
  annotations: Array<{
    annotationsId: string;
    annotationsText: string;
  }>;
  photo: ImageData | string | null;
  teacherId: {
    id: string;
    name: string;
  };
  updatedAt: string;
  createdAt: string;
  role: USER_ROLES;
}
export interface AnnotationDB {
  id: string;
  student_id: string;
  annotations: string;
  created_at: string;
  updated_at: string;
  teacher_id: string;
}
export class Annotation {
  constructor(
    private id: string,
    private studentId: string,
    private annotationText: string,
    private createdAt: string,
    private updatedAt: string,
    private teacherId: string
  ) {}

  public getAnnotationId(): string {
    return this.id;
  }
  public setAnnotationId(value: string): void {
    this.id = value;
  }
  public getStudentId(): string {
    return this.studentId;
  }
  public setStudentId(value: string): void {
    this.studentId = value;
  }
  public getAnnotation(): string {
    return this.annotationText;
  }
  public setAnnotationText(value: string): void {
    this.annotationText = value;
  }
  public getCreatedAt(): string {
    return this.createdAt;
  }
  public setCreatedAt(value: string): void {
    this.createdAt = value;
  }
  public getUpdatedAt(): string {
    return this.updatedAt;
  }
  public setUpdatedAt(value: string): void {
    this.updatedAt = value;
  }
  public getTeacherId(): string {
    return this.teacherId;
  }
  public setTeacherId(value: string): void {
    this.teacherId = value;
  }
  public toDBModel(): AnnotationDB {
    return {
      id: this.id,
      student_id: this.studentId,
      teacher_id: this.teacherId,
      created_at: this.createdAt,
      annotations: this.annotationText,
      updated_at: this.updatedAt,
    };
  }
}
export interface NotesDB {
  id: string;
  student_id: string;
  notes: string;
  created_at: string;
  updated_at: string;
  teacher_id: string;
}

export class Notes {
  constructor(
    private id: string,
    private studentId: string,
    private notesText: string,
    private createdAt: string,
    private updatedAt: string,
    private teacherId: string
  ) {}

  public getNoteId(): string {
    return this.id;
  }
  public setNoteId(value: string): void {
    this.id = value;
  }
  public getStudentId(): string {
    return this.studentId;
  }
  public setStudentId(value: string): void {
    this.studentId = value;
  }
  public getNotes(): string {
    return this.notesText;
  }
  public setNotesText(value: string): void {
    this.notesText = value;
  }
  public getCreatedAt(): string {
    return this.createdAt;
  }
  public setCreatedAt(value: string): void {
    this.createdAt = value;
  }
  public getUpdatedAt(): string {
    return this.updatedAt;
  }
  public setUpdatedAt(value: string): void {
    this.updatedAt = value;
  }
  public getTeacherId(): string {
    return this.teacherId;
  }
  public setTeacherId(value: string): void {
    this.teacherId = value;
  }
  public toDBModel(): NotesDB {
    return {
      id: this.id,
      student_id: this.studentId,
      teacher_id: this.teacherId,
      created_at: this.createdAt,
      notes: this.notesText,
      updated_at: this.updatedAt,
    };
  }
}

export class Student {
  constructor(
    private id: string,
    private name: string,
    private email: string,
    private phone: string | null,
    private age: number | null,
    private notes: Notes[],
    private annotations: Annotation[],
    private teacherId: string,
    private teacherName: string,
    private createdAt: string,
    private role: USER_ROLES,
    private updatedAt: string,
    private photo: ImageData | string | null
  ) {}
  public getId(): string {
    return this.id;
  }
  public setId(value: string): void {
    this.id = value;
  }
  public getNotes(): Notes[] {
    return this.notes;
  }
  public setAnnotations(value: Annotation[]): void {
    this.annotations = value;
  }
  public getAnnotations(): Annotation[] {
    return this.annotations;
  }
  public setNotes(value: Notes[]): void {
    this.notes = value;
  }
  public getName(): string {
    return this.name;
  }
  public setName(value: string): void {
    this.name = value;
  }
  public getEmail(): string {
    return this.email;
  }
  public setEmail(value: string): void {
    this.email = value;
  }
  public getPhone(): string | null {
    return this.phone;
  }
  public setPhone(value: string): void {
    this.phone = value;
  }
  public getAge(): number | null {
    return this.age;
  }
  public setAge(value: number): void {
    this.age = value;
  }
  public getPhoto(): ImageData | string | null {
    if (this.photo && typeof this.photo !== "string") {
      if ("data" in this.photo) {
        const imageData = this.photo as ImageData;
        return {
          data: Buffer.from(imageData.data),
          mimeType: imageData.mimeType,
        };
      } else {
        return null;
      }
    }
    return this.photo as string | null;
  }
  public setPhoto(value: ImageData | string | null): void {
    this.photo = value;
  }
  public getTeacherId(): string {
    return this.teacherId;
  }
  public setTeacherId(value: string): void {
    this.teacherId = value;
  }
  public getTeacherName(): string {
    return this.teacherName;
  }
  public setTeacherName(value: string): void {
    this.teacherName = value;
  }
  public getCreatedAt(): string {
    return this.createdAt;
  }
  public setCreatedAt(value: string): void {
    this.createdAt = value;
  }
  public getRole(): USER_ROLES {
    return this.role;
  }
  public setRole(value: USER_ROLES): void {
    this.role = value;
  }
  public getUpdateAt(): string {
    return this.updatedAt;
  }
  public setUpdateAt(value: string): void {
    this.updatedAt = value;
  }
  public toDBModel(): StudentDB {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      phone: this.phone,
      age: this.age,
      notes: this.notes.map((note) => ({
        notesId: note.getNoteId(),
        notesText: note.getNotes(),
      })),
      annotations: this.annotations.map((annotation) => ({
        annotationsId: annotation.getAnnotationId(),
        annotationsText: annotation.getAnnotation(),
      })),
      photo: this.photo,
      teacher_id: this.teacherId,
      created_at: this.createdAt,
      role: this.role,
      updated_at: this.updatedAt,
    };
  }

  public toBusinessModel(): StudentModel {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      phone: this.phone,
      age: this.age,
      notes: this.notes.map((note) => ({
        id: note.getNoteId(),
        notes: note.getNotes(),
      })),
      annotations: this.annotations.map((annotation) => ({
        annotationsId: annotation.getAnnotationId(),
        annotationsText: annotation.getAnnotation(),
      })),
      photo: this.photo,
      teacherId: {
        id: this.teacherId,
        name: this.teacherName,
      },
      updatedAt: this.updatedAt,
      createdAt: this.createdAt,
      role: this.role,
    };
  }
}
