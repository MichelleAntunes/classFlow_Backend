export enum USER_ROLES {
  NORMAL = "NORMAL",
  ADMIN = "ADMIN",
}
export interface TokenPayload {
  id: string;
  name: string;
  role: USER_ROLES;
}

export interface TeacherDB {
  id: string;
  name: string;
  email: string;
  password?: string;
  email_verified: string;
  created_at: string;
  role: USER_ROLES;
}

// model serve para o front-end lidar com os teacher
export interface TeacherModel {
  id: string;
  name: string;
  email: string;
  emailVerified: string;
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
    private emailVerified: string,
    private createdAt: string,
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

  public getPassword(): string {
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

  //criar um modelo para o back quando for criar um novo
  public toDBModel(): TeacherDB {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      password: this.password,
      email_verified: this.emailVerified,
      created_at: this.createdAt,
      role: this.role,
    };
  }
  public toBusinessModel(): TeacherModel {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      emailVerified: this.emailVerified,
      createdAt: this.createdAt,
      role: this.role,
    };
  }
}
