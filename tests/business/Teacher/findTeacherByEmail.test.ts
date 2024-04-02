import { TeacherDB } from "../../../src/models/Teacher";
import { TeacherDatabaseMock } from "../../mocks/TeacherDatabaseMock";

describe("Testing findTeacherByEmail method", () => {
  const teacherDBMock = new TeacherDatabaseMock();

  test("should find teacher by email", async () => {
    const email = "teacher@mock.com";

    const foundTeacher: TeacherDB | undefined =
      await teacherDBMock.findTeacherByEmail(email);

    expect(foundTeacher).toBeDefined();

    expect(foundTeacher?.email).toBe(email);
  });

  test("should return undefined if teacher is not found", async () => {
    const email = "nonexistent@example.com";

    const foundTeacher: TeacherDB | undefined =
      await teacherDBMock.findTeacherByEmail(email);

    expect(foundTeacher).toBeUndefined();
  });
});
