import { CreateStudentSchema } from "../../../src/dtos/student/createStudent.dto";
import { StudentDatabaseMock } from "../../mocks/StudentDatabaseMock";

describe("CreateStudentSchema validation", () => {
  test("should validate a valid student input", () => {
    const validInput = {
      token: "valid_token",
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "1234567890",
      age: 25,
      role: "NORMAL",
      photo: "https://example.com/photo.jpg",
    };

    expect(CreateStudentSchema.safeParse(validInput).success).toBe(true);
  });

  test("should fail validation for invalid student input", () => {
    const invalidInput = {
      token: "", // invalid token
      name: "",
      email: "invalid-email", // invalid email
      phone: "not-a-phone-number", // invalid phone number
      age: 0, // invalid age
      role: "INVALID_ROLE", // invalid role
      photo: "invalid-url", // invalid photo URL
    };

    expect(CreateStudentSchema.safeParse(invalidInput).success).toBe(false);
  });
});

describe("StudentDatabaseMock", () => {
  let studentDBMock: StudentDatabaseMock;

  beforeEach(() => {
    studentDBMock = new StudentDatabaseMock();
  });

  test("should find a student by ID", async () => {
    const studentId = "id-student-mock1";
    const student = await studentDBMock.findStudentById(studentId);
    expect(student).toBeDefined();
    expect(student?.id).toBe(studentId);
  });

  test("should return undefined when student ID is not found", async () => {
    const studentId = "non-existent-id";
    const student = await studentDBMock.findStudentById(studentId);
    expect(student).toBeUndefined();
  });
});
