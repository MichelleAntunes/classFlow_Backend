import { USER_ROLES } from "./Student";

export interface TokenPayload {
  id: string;
  name: string;
  role: USER_ROLES;
}

export interface TTeacher {
  id: string;
  name: string;
  email: string;
  password?: string;
  email_verified: string;
  created_at: string;
  role: USER_ROLES;
}
export interface TTeacherModel {
  id: string;
  name: string;
  email: string;
  email_verified: string;
  created_at: string;
  role: USER_ROLES;
}

export class Teacher {
  constructor(
    private id: string,
    private name: string,
    private email: string,
    private password: string,
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

  public getPassword(): string {
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

  public toDBModel(): TTeacher {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      password: this.password,
      email_verified: this.email_verified,
      created_at: this.created_at,
      role: this.role,
    };
  }
  public toBusinessModel(): TTeacherModel {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      email_verified: this.email_verified,
      created_at: this.created_at,
      role: this.role,
    };
  }
}
