import { StudentBusiness } from "../../../src/business/StudentsBusiness";
import { NotFoundError } from "../../../src/errors/NotFoundError";
import { UnauthorizedError } from "../../../src/errors/UnauthorizedError";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { StudentDatabaseMock } from "../../mocks/StudentDatabaseMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";

describe("Testing findStudentById", () => {
  const studentBusiness = new StudentBusiness(
    new StudentDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  );

  test("should throw NotFoundError when student id is not found", async () => {
    const id = "non-existing-id";
    const token = "token-mock-teacher";

    try {
      await studentBusiness.findStudentById(id, token);
      fail("Expected NotFoundError, but no error was thrown.");
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundError);
      expect((error as Error).message).toEqual(
        "There's no such thing as a student with this id"
      );
    }
  });

  test("should throw UnauthorizedError when token is invalid", async () => {
    const id = "id-student-mock1";
    const token = "invalid-token";

    try {
      await studentBusiness.findStudentById(id, token);
      fail("Expected UnauthorizedError, but no error was thrown.");
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedError);
    }
  });

  test("should return student when id and token are valid", async () => {
    const id = "id-student-mock1";
    const token = "token-mock-teacher";

    const student = await studentBusiness.findStudentById(id, token);

    expect(student).toBeDefined();
    expect(student!.getId()).toEqual(id);
  });
});
