export enum USER_ROLES {
  NORMAL = "NORMAL",
  ADMIN = "ADMIN",
}

export interface TokenPayload {
  id: string;
  name: string;
  role: USER_ROLES;
}
export interface TImageData {
  data: Buffer;
  mimeType?: "image/png" | "image/jpeg";
}
export interface TNote {
  id: string; // Add a unique identifier for each note
  note?: string;
  // Add any other fields relevant to the note here
}
export interface TAnnotation {
  id: string; // Add a unique identifier for each note
  annotation?: string;
  // Add any other fields relevant to the annotations here
}

export interface StudentDB {
  id: string;
  name: string;
  email: string;
  phone: number | null;
  age: number | null;
  notes?: TNote[]; // Array of note objects
  annotations?: TAnnotation[]; // Array of annotation objects
  photo?: TImageData | string | null | undefined;
  teacher_id: string;
  class_id: string;
  password?: string;
  email_verified: string;
  created_at: string;
  role: USER_ROLES;
  email_sent: boolean;
  updated_at: string;
}
export interface StudentModel {
  id: string;
  name: string;
  email: string;
  phone: number | null;
  age: number | null;
  notes?: TNote[]; // Array of note objects
  annotations?: TAnnotation[]; // Array of annotation objects
  photo?: TImageData | string | null | undefined;
  teacherId: {
    id: string;
    name: string;
  };
  classId: {
    id: string;
    name: string;
  };
  emailVerified: string;
  createdAt: string;
  role: USER_ROLES;
}

export class Student {
  constructor(
    private id: string,
    private name: string,
    private email: string,
    private phone: number | null,
    private age: number | null,
    private notes: TNote[],
    private annotations: TAnnotation[],
    private photo: TImageData | string | null,
    private teacherId: string,
    private teacherName: string,
    private classId: string,
    private className: string,
    private password: string | undefined,
    private emailVerified: string,
    private createdAt: string,
    private role: USER_ROLES,
    private emailSent: boolean,
    private updatedAt: string
  ) {}

  public getId(): string {
    return this.id;
  }
  public setId(value: string): void {
    this.id = value;
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
  public getPhone(): number | null {
    return this.phone;
  }
  public setPhone(value: number): void {
    this.phone = value;
  }
  public getAge(): number | null {
    return this.age;
  }
  public setAge(value: number): void {
    this.age = value;
  }
  public getNotes(): TNote[] {
    return this.notes;
  }
  public setNotes(value: TNote[]): void {
    this.notes = value;
  }
  public getAnnotations(): TAnnotation[] {
    return this.annotations;
  }
  public setAnnotations(value: TAnnotation[]): void {
    this.annotations = value;
  }
  public getPhoto(): TImageData | string | null {
    if (this.photo && typeof this.photo !== "string") {
      if ("data" in this.photo) {
        // Se 'data' está presente, é uma instância de TImageData
        const imageData = this.photo as TImageData;
        return {
          data: Buffer.from(imageData.data), // Convertemos Uint8ClampedArray para Buffer
          mimeType: imageData.mimeType,
        };
      } else {
        // Caso contrário, pode ser uma instância de ImageData ou outro tipo não esperado
        // Faça o tratamento apropriado ou retorne null se não souber lidar com o tipo
        return null;
      }
    }
    return this.photo as string | null;
  }

  public setPhoto(value: TImageData | string | null): void {
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
    this.teacherId = value;
  }
  public getClassId(): string {
    return this.classId;
  }
  public setClassId(value: string): void {
    this.classId = value;
  }
  public getClassName(): string {
    return this.className;
  }
  public setClassName(value: string): void {
    this.className = value;
  }
  public getPassword(): string | undefined {
    return this.password;
  }
  public setPassword(value: string): void {
    this.password = value;
  }
  public getEmailVerified(): string {
    return this.emailVerified;
  }
  public setEmailVerified(value: string): void {
    this.emailVerified = value;
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
  public getEmailSent(): boolean {
    return this.emailSent;
  }
  public setEmailsent(value: boolean): void {
    this.emailSent = this.emailSent;
  }
  public getUpdateAt(): string {
    return this.updatedAt;
  }
  public setUpdateAte(value: string): void {
    this.updatedAt = this.updatedAt;
  }

  public toDBModel(): StudentDB {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      phone: this.phone,
      age: this.age,
      notes: this.notes,
      annotations: this.annotations,
      photo: this.photo,
      teacher_id: this.teacherId,
      class_id: this.classId,
      password: this.password,
      email_verified: this.emailVerified,
      created_at: this.createdAt,
      role: this.role,
      email_sent: this.emailSent,
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
      notes: this.notes,
      annotations: this.annotations,
      photo: this.photo,
      teacherId: {
        id: this.teacherId,
        name: this.teacherName,
      },
      classId: {
        id: this.classId,
        name: this.className,
      },
      emailVerified: this.emailVerified,
      createdAt: this.createdAt,
      role: this.role,
    };
  }
}
