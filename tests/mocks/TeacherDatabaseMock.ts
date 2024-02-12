import { TeacherDB, USER_ROLES } from "../../src/models/Teacher";
import { BaseDatabase } from "../../src/database/BaseDatabase";

const teachersMock: TeacherDB[] = [
  {
    id: "id-mock1",
    name: "Professor Mock",
    email: "professor@mock.com",
    password: "hash-mock", //password: Mock-123
    created_at: new Date().toISOString(),
    photo: "",
    role: USER_ROLES.NORMAL,
  },
  {
    id: "id-mock2",
    name: "Professor Mock ADMIN",
    email: "professor2@mock.com",
    password: "hash-mock-adm", //password: MockAdm-123
    created_at: new Date().toISOString(),
    photo: "",
    role: USER_ROLES.ADMIN,
  },
];

export class TeacherDataBaseMock extends BaseDatabase {
  public insertTeacher = async (teacherDB: TeacherDB): Promise<void> => {};

  public findeTeacherByEmail = async (
    email: string
  ): Promise<TeacherDB | undefined> => {
    return teachersMock.filter((teacher) => teacher.email === email)[0];
  };
  public updatePasswordByEmail = async (
    email: string,
    newPassword: string
  ): Promise<void> => {
    const teacherIndex = teachersMock.findIndex(
      (teacher) => teacher.email === email
    );
    if (teacherIndex !== -1) {
      teachersMock[teacherIndex].password = newPassword;
    } else {
      throw new Error("Professor não encontrado");
    }
  };
}
