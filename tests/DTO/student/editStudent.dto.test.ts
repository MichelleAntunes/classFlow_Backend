import {
  EditStudentSchema,
  EditStudentInputDTO,
} from "../../../src/dtos/student/editStudent.dto";
import { USER_ROLES } from "../../../src/models/Student";
import { StudentDatabaseMock } from "../../mocks/StudentDatabaseMock";

describe("EditStudentSchema validation", () => {
  test("should validate a valid edit student input", () => {
    const validInput: EditStudentInputDTO = {
      name: "New Name",
      token: "valid_token",
      idToEdit: "valid_student_id",
      age: 30,
      email: "new.email@example.com",
      phone: "1234567890",
      photo: "https://example.com/new_photo.jpg",
    };

    expect(EditStudentSchema.safeParse(validInput).success).toBe(true);
  });

  test("should fail validation for invalid edit student input", () => {
    const invalidInput: EditStudentInputDTO = {
      name: "", // empty name
      token: "", // invalid token
      idToEdit: "", // invalid student id
      age: 0, // invalid age
      email: "invalid-email", // invalid email
      phone: "not-a-phone-number", // invalid phone number
      photo: "invalid-url", // invalid photo URL
    };

    expect(EditStudentSchema.safeParse(invalidInput).success).toBe(false);
  });
});

describe("StudentDatabaseMock edit student", () => {
  let studentDBMock: StudentDatabaseMock;

  beforeEach(() => {
    studentDBMock = new StudentDatabaseMock();
  });

  test("should edit a student by ID", async () => {
    const studentIdToEdit = "id-student-mock1";
    const updatedData = {
      id: studentIdToEdit, // incluir a propriedade id
      name: "Updated Name",
      age: 35,
      email: "updated.email@example.com",
      phone: "9876543210",
      photo: "https://example.com/updated_photo.jpg",
      notes: [
        {
          notesId: "id-notesSal-mock",
          notesText: "90",
        },
      ],
      annotations: [
        {
          annotationsId: "id-annotationSal-mock",
          annotationsText: "First Annotation Sal",
        },
        {
          annotationsId: "id-annotationSal-mock2",
          annotationsText: "Second Annotation Sal",
        },
      ],
      teacher_id: "id-mock1",
      created_at: new Date().toISOString().slice(0, -5),
      role: USER_ROLES.NORMAL,
      updated_at: new Date().toISOString().slice(0, -5),
    };

    await studentDBMock.updateStudent(updatedData);

    const updatedStudent = await studentDBMock.findStudentById(studentIdToEdit);
    expect(updatedStudent).toBeDefined();
    expect(updatedStudent?.name).toEqual(updatedData.name);
    expect(updatedStudent?.age).toEqual(updatedData.age);
    expect(updatedStudent?.email).toEqual(updatedData.email);
    expect(updatedStudent?.phone).toEqual(updatedData.phone);
    expect(updatedStudent?.photo).toEqual(updatedData.photo);
  });

  test("should throw error when student ID to edit is not found", async () => {
    const nonExistentStudentId = "non-existent-id";
    const updatedData = {
      id: nonExistentStudentId, // incluir a propriedade id
      name: "Updated Name",
      age: 35,
      email: "updated.email@example.com",
      phone: "9876543210",
      photo: "https://example.com/updated_photo.jpg",
      notes: [
        {
          notesId: "id-notesSal-mock",
          notesText: "90",
        },
      ],
      annotations: [
        {
          annotationsId: "id-annotationSal-mock",
          annotationsText: "First Annotation Sal",
        },
        {
          annotationsId: "id-annotationSal-mock2",
          annotationsText: "Second Annotation Sal",
        },
      ],
      teacher_id: "id-mock1",
      created_at: new Date().toISOString().slice(0, -5),
      role: USER_ROLES.NORMAL,
      updated_at: new Date().toISOString().slice(0, -5),
    };

    await expect(studentDBMock.updateStudent(updatedData)).rejects.toThrow(
      "Student not found"
    );
  });
});
