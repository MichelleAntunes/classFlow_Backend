export enum USER_ROLES {
  NORMAL = "NORMAL",
  ADMIN = "ADMIN",
}
export interface TImageData {
  data: Buffer;
  mimeType?: "image/png" | "image/jpeg";
}
export interface TNote {
  id: string; // Add a unique identifier for each note
  note: string;
  // Add any other fields relevant to the note here
}
export interface TAnnotation {
  id: string; // Add a unique identifier for each note
  annotation: string;
  // Add any other fields relevant to the annotations here
}
export interface TokenPayload {
  id: string;
  name: string;
  role: USER_ROLES;
}
export interface TStudents {
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
}
export interface TStudentsModel {
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
  email_verified: string;
  created_at: string;
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
    private teacher_id: string,
    private class_id: string,
    private password: string | undefined,
    private email_verified: string,
    private created_at: string,
    private role: USER_ROLES
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
  public getTeacher_id(): string {
    return this.teacher_id;
  }

  public setTeacher_id(value: string): void {
    this.teacher_id = value;
  }
  public getClass_id(): string {
    return this.class_id;
  }
  public setClass_id(value: string): void {
    this.class_id = value;
  }
  public getPassword(): string | undefined {
    return this.password;
  }
  public setPassword(value: string): void {
    this.password = value;
  }
  public getEmailVerified(): string {
    return this.email_verified;
  }
  public setEmailVerified(value: string): void {
    this.email_verified = value;
  }
  public getCreatedAt(): string {
    return this.created_at;
  }
  public setCreatedAt(value: string): void {
    this.created_at = value;
  }
  public getRole(): USER_ROLES {
    return this.role;
  }
  public setRole(value: USER_ROLES): void {
    this.role = value;
  }

  public toDBModel(): TStudents {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      phone: this.phone,
      age: this.age,
      notes: this.notes,
      annotations: this.annotations,
      photo: this.photo,
      teacher_id: this.teacher_id,
      class_id: this.class_id,
      password: this.password,
      email_verified: this.email_verified,
      created_at: this.created_at,
      role: this.role,
    };
  }
  public toBusinessModel(): TStudentsModel {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      phone: this.phone,
      age: this.age,
      notes: this.notes,
      annotations: this.annotations,
      photo: this.photo,
      teacher_id: this.teacher_id,
      class_id: this.class_id,
      email_verified: this.email_verified,
      created_at: this.created_at,
      role: this.role,
    };
  }
}
