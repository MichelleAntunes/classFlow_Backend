import { GetStudentSchema } from "../../../src/dtos/student/getStudents.dto";
import { StudentDatabaseMock } from "../../mocks/StudentDatabaseMock";

describe("GetStudentSchema validation", () => {
  test("should validate a valid get student input", () => {
    const validInput = {
      token: "valid_token",
    };

    expect(GetStudentSchema.safeParse(validInput).success).toBe(true);
  });

  test("should fail validation for invalid get student input", () => {
    const invalidInput = {
      token: "", // invalid token
    };

    expect(GetStudentSchema.safeParse(invalidInput).success).toBe(false);
  });
});

describe("StudentDatabaseMock get students", () => {
  let studentDBMock: StudentDatabaseMock;

  beforeEach(() => {
    studentDBMock = new StudentDatabaseMock();
  });

  test("should get list of students", async () => {
    const students = await studentDBMock.getStudentsWithCreatorName();
    expect(students).toBeDefined();
    expect(Array.isArray(students)).toBe(true);
    expect(students.length).toBeGreaterThan(0);
  });
});
