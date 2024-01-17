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
export interface TeacherDB {
  id: string;
  name: string;
  email: string;
  password: string;
  created_at: string;
  photo?: ImageData | string | null | undefined;
  role: USER_ROLES;
}

// model serve para o front-end lidar com os teacher
export interface TeacherModel {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  role: USER_ROLES;
}

// no back precisamos de acesso a todos os dados, por isso nossa clase tem todos os dados

export class Teacher {
  constructor(
    private id: string,
    private name: string,
    private email: string,
    private password: string,
    private createdAt: string,
    private role: USER_ROLES,
    private photo?: ImageData | string | null | undefined
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

  public getPassword(): string {
    return this.password;
  }
  public setPassword(value: string): void {
    this.password = value;
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

  //criar um modelo para o back quando for criar um novo
  public toDBModel(): TeacherDB {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      password: this.password,
      created_at: this.createdAt,
      role: this.role,
    };
  }
  public toBusinessModel(): TeacherModel {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      createdAt: this.createdAt,
      role: this.role,
    };
  }
}
