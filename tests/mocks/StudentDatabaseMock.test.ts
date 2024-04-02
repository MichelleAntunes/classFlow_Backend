import {
  AnnotationDB,
  NotesDB,
  StudentDB,
  USER_ROLES,
} from "../../src/models/Student";
import { StudentDatabaseMock } from "./StudentDatabaseMock";

describe("StudentDatabaseMock", () => {
  let studentDatabase: StudentDatabaseMock;

  beforeEach(() => {
    studentDatabase = new StudentDatabaseMock();
  });

  test("should find student by id", async () => {
    const studentId = "id-student-mock1";
    const student: StudentDB | undefined =
      await studentDatabase.findStudentById(studentId);
    expect(student).toBeDefined();
    if (student) {
      expect(student.id).toBe(studentId);
    }
  });

  test("should get students with creator name", async () => {
    const studentsWithCreatorName =
      await studentDatabase.getStudentsWithCreatorName();
    expect(studentsWithCreatorName.length).toBeGreaterThan(0);
    expect(studentsWithCreatorName[0].creator_name).toBe("Teacher Mock");
  });

  test("should update student", async () => {
    const studentId = "id-student-mock1";
    const updatedName = "Updated Student Name";
    const updatedStudent: StudentDB | undefined =
      await studentDatabase.findStudentById(studentId);
    expect(updatedStudent).toBeDefined();
    if (updatedStudent) {
      updatedStudent.name = updatedName;
      await studentDatabase.updateStudent(updatedStudent);
      const retrievedStudent = await studentDatabase.findStudentById(studentId);
      expect(retrievedStudent).toBeDefined();
      expect(retrievedStudent?.name).toBe(updatedName);
    }
  });

  test("should delete student by id", async () => {
    const studentId = "id-student-mock1";
    await studentDatabase.deleteStudentById(studentId);
    const deletedStudent = await studentDatabase.findStudentById(studentId);
    expect(deletedStudent).toBeUndefined();
  });

  test("should throw error if student not found when inserting notes", async () => {
    const newNoteDB: NotesDB = {
      id: "new-note-id",
      student_id: "non-existing-student-id",
      teacher_id: "teacher-id",
      notes: "New note text",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await expect(
      studentDatabase.insertNotesByStudentId(newNoteDB)
    ).rejects.toThrowError("Student not found");
  });

  test("should throw error if student not found when inserting annotations", async () => {
    const newAnnotationDB: AnnotationDB = {
      id: "new-annotation-id",
      student_id: "non-existing-student-id",
      teacher_id: "teacher-id",
      annotations: "New annotation text",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await expect(
      studentDatabase.insertAnnotationsByStudentId(newAnnotationDB)
    ).rejects.toThrowError("Student not found");
  });

  test("should throw error if student not found when moving to inactive", async () => {
    const studentId = "non-existing-student-id";

    await expect(
      studentDatabase.moveStudentToInactive(studentId)
    ).rejects.toThrowError("Student not found");
  });
});
