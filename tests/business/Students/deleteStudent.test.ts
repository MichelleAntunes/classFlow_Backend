import { StudentBusiness } from "../../../src/business/StudentsBusiness";

import { DeleteStudentSchema } from "../../../src/dtos/student/deleteStudent.dto";

import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { StudentDatabaseMock } from "../../mocks/StudentDatabaseMock";
import { USER_ROLES } from "../../../src/models/Student";
import { UnauthorizedError } from "../../../src/errors/UnauthorizedError";
import { ForbiddenError } from "../../../src/errors/ForbiddenError";
import { NotFoundError } from "../../../src/errors/NotFoundError";

describe("Testing deleteStudent", () => {
  const studentBusiness = new StudentBusiness(
    new StudentDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  );

  test("should delete a student", async () => {
    const input = DeleteStudentSchema.parse({
      idToDelete: "id-student-mock1",
      token: "token-mock-teacher",
    });

    const output = await studentBusiness.deleteStudent(input);

    expect(output).toEqual({
      message: "Estudante deletado com sucesso",
    });
  });
  test("should throw UnauthorizedError when token is invalid", async () => {
    const input = DeleteStudentSchema.parse({
      idToDelete: "id-student-mock1",
      token: "invalid-token",
    });

    try {
      await studentBusiness.deleteStudent(input);
      fail("Expected UnauthorizedError, but no error was thrown.");
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedError);
    }
  });

  test("search for and delete only students with a past id. ", async () => {
    const input = DeleteStudentSchema.parse({
      idToDelete: "id-different",
      token: "token-mock-teacher",
    });

    try {
      await studentBusiness.deleteStudent(input);
      fail("Expected NotFoundError, but no error was thrown.");
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundError);
    }
  });
});
