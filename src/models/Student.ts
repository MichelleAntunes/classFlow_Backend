import { TImageData, TNote, TAnnotation } from "../types";

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
    private class_id: string // private password: string
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
  // public getPassword(): string {
  //   return this.password;
  // }
  // public setPassword(value: string): void {
  //   this.password = value;
  // }
}
