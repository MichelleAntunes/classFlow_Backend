import { IdGenerator } from "../services/IdGenerator";

export enum USER_ROLES {
  NORMAL = "NORMAL",
  ADMIN = "ADMIN",
}

export interface TokenPayload {
  id: string;
  name: string;
  role: USER_ROLES;
}
export interface ImageData {
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
export interface StudentsWithCreatorName {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  age: number | null;
  notes?: TNote[]; // Array of note objects
  annotations?: TAnnotation[]; // Array of annotation objects
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
  notes?: TNote[]; // Array of note objects
  annotations?: TAnnotation[]; // Array of annotation objects
  photo?: ImageData | string | null | undefined;
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
  notes?: TNote[]; // Array of note objects
  annotations?: TAnnotation[]; // Array of annotation objects
  photo?: ImageData | string | null | undefined;
  teacherId: {
    id: string;
    name: string;
  };
  updatedAt: string;
  createdAt: string;
  role: USER_ROLES;
}

export class Student {
  constructor(
    private id: string,
    private name: string,
    private email: string,
    private phone: string | null,
    private age: number | null,
    private notes: TNote[],
    private annotations: TAnnotation[],
    private teacherId: string,
    private teacherName: string,
    private createdAt: string,
    private role: USER_ROLES,
    private updatedAt: string,
    private photo: ImageData | string | null
  ) {}
  public addNewAnnotations(
    newAnnotations: string[],
    idGenerator: IdGenerator
  ): void {
    const newAnnotationObjects: TAnnotation[] = newAnnotations.map(
      (annotation) => ({
        id: idGenerator.generate(),
        annotation,
      })
    );

    this.annotations = [...this.annotations, ...newAnnotationObjects];
  }

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
  public getPhoto(): ImageData | string | null {
    if (this.photo && typeof this.photo !== "string") {
      if ("data" in this.photo) {
        // Se 'data' está presente, é uma instância de TImageData
        const imageData = this.photo as ImageData;
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
    this.teacherId = value;
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
      notes: this.notes,
      annotations: this.annotations,
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
