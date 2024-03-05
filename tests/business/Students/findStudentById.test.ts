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
  test("Return error if student id not found", async () => {
    const input = {
      id: "invalid-id",
      token: "token-mock-teacher",
    };

    try {
      await studentBusiness.findStudentById(input.id, input.token);
      fail("Expected NotFoundError, but no error was thrown. ");
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundError);
    }
  });
});
