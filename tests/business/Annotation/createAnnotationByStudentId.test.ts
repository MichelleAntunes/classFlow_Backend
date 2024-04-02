import { StudentBusiness } from "../../../src/business/StudentsBusiness";
import { UnauthorizedError } from "../../../src/errors/UnauthorizedError";
import { NotFoundError } from "../../../src/errors/NotFoundError";
import { ForbiddenError } from "../../../src/errors/ForbiddenError";
import { StudentDatabaseMock } from "../../mocks/StudentDatabaseMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { CreateAnnotationSchema } from "../../../src/dtos/annotation/createNewAnnotation.dto";

describe("Testing createAnnotationByStudentId", () => {
  const studentBusiness = new StudentBusiness(
    new StudentDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  );

  test("should create an annotation for a student", async () => {
    const input = CreateAnnotationSchema.parse({
      token: "token-mock-teacher",
      studentId: "id-student-mock1",
      annotations: "New annotation text",
    });

    const output = await studentBusiness.createAnnotationByStudentId(input);

    expect(output).toEqual({
      message: "New annotation successfully added",
    });
  });

  test("should throw UnauthorizedError when token is invalid", async () => {
    const input = CreateAnnotationSchema.parse({
      token: "invalid-token",
      studentId: "id-student-mock1",
      annotations: "New annotation text",
    });

    try {
      await studentBusiness.createAnnotationByStudentId(input);
      fail("Expected UnauthorizedError, but no error was thrown.");
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedError);
    }
  });

  test("should throw NotFoundError when student id does not exist", async () => {
    const input = CreateAnnotationSchema.parse({
      token: "token-mock-teacher",
      studentId: "invalid-student-id",
      annotations: "New annotation text",
    });

    try {
      await studentBusiness.createAnnotationByStudentId(input);
      fail("Expected NotFoundError, but no error was thrown.");
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundError);
    }
  });

  //   test("should throw ForbiddenError when user is not allowed to create annotation for the student", async () => {
  //     const input = CreateAnnotationSchema.parse({
  //        token: "token-mock-teacher",
  //         studentId: "id-student-mock1",
  //         annotations: "New annotation text",
  //       });

  //     try {
  //       await studentBusiness.createAnnotationByStudentId(input);
  //       fail("Expected ForbiddenError, but no error was thrown.");
  //     } catch (error) {
  //       expect(error).toBeInstanceOf(ForbiddenError);
  //     }
  //   });
});
