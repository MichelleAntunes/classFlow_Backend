import { TeacherDB, USER_ROLES } from "../../src/models/Teacher";
import { TeacherDatabaseMock } from "./TeacherDatabaseMock";

describe("TeacherDatabaseMock", () => {
  let teacherDatabase: TeacherDatabaseMock;

  beforeEach(() => {
    teacherDatabase = new TeacherDatabaseMock();
  });

  test("should find teacher by email", async () => {
    const teacherEmail = "teacher@mock.com";
    const teacher: TeacherDB | undefined =
      await teacherDatabase.findTeacherByEmail(teacherEmail);
    expect(teacher).toBeDefined();
    expect(teacher?.email).toBe(teacherEmail);
  });

  test("should update teacher password by email", async () => {
    const teacherEmail = "teacher@mock.com";
    const newPassword = "new-password";
    await teacherDatabase.updatePasswordByEmail(teacherEmail, newPassword);
    const updatedTeacher: TeacherDB | undefined =
      await teacherDatabase.findTeacherByEmail(teacherEmail);
    expect(updatedTeacher).toBeDefined();
    expect(updatedTeacher?.password).toBe(newPassword);
  });

  test("should throw error if teacher not found when updating password", async () => {
    const teacherEmail = "nonexistent@teacher.com";
    const newPassword = "new-password";
    await expect(
      teacherDatabase.updatePasswordByEmail(teacherEmail, newPassword)
    ).rejects.toThrow("Teacher not found");
  });
});
