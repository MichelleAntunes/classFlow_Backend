import { StudentBusiness } from "../../../src/business/StudentsBusiness";
import { CreateStudentSchema } from "../../../src/dtos/student/createStudent.dto";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { StudentDatabaseMock } from "../../mocks/StudentDatabaseMock";
import { UnauthorizedError } from "../../../src/errors/UnauthorizedError";
import { USER_ROLES } from "../../../src/models/Student";

describe("Testing createStudent", () => {
  const studentBusiness = new StudentBusiness(
    new StudentDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  );

  test("should create a new student", async () => {
    const input = CreateStudentSchema.parse({
      name: "New Student",
      email: "new.student@mock.com",
      phone: "12345678",
      age: 20,
      role: USER_ROLES.NORMAL,
      token: "token-mock-teacher",
    });

    try {
      const output = await studentBusiness.createStudent(input);
      expect(output).toEqual({
        message: "Student created successfully",
        studentName: "New Student",
      });
    } catch (error) {
      fail("Unexpected error: " + error);
    }
  });

  test("should throw UnauthorizedError when token is invalid", async () => {
    const input = CreateStudentSchema.parse({
      name: "New Student",
      email: "new.student@mock.com",
      phone: "12345678",
      age: 20,
      role: USER_ROLES.NORMAL,
      token: "invalid-token",
    });

    try {
      await studentBusiness.createStudent(input);
      fail("Expected UnauthorizedError, but no error was thrown.");
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedError);
    }
  });
});
