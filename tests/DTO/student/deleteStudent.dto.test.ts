import { StudentDatabaseMock } from "../../mocks/StudentDatabaseMock";

describe("StudentDatabaseMock delete student", () => {
  let studentDBMock: StudentDatabaseMock;

  beforeEach(() => {
    studentDBMock = new StudentDatabaseMock();
  });

  test("should delete a student by ID", async () => {
    const studentIdToDelete = "id-student-mock1";
    await expect(
      studentDBMock.deleteStudentById(studentIdToDelete)
    ).resolves.toBeUndefined();

    const deletedStudent = await studentDBMock.findStudentById(
      studentIdToDelete
    );
    expect(deletedStudent).toBeUndefined();
  });

  test("should throw error when student ID to delete is not found", async () => {
    const nonExistentStudentId = "non-existent-id";
    await expect(
      studentDBMock.deleteStudentById(nonExistentStudentId)
    ).rejects.toThrow("Student not found");
  });
});
