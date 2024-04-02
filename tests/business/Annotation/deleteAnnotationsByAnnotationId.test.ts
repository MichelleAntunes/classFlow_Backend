import { StudentBusiness } from "../../../src/business/StudentsBusiness";
import { UnauthorizedError } from "../../../src/errors/UnauthorizedError";
import { NotFoundError } from "../../../src/errors/NotFoundError";
import { ForbiddenError } from "../../../src/errors/ForbiddenError";
import { USER_ROLES } from "../../../src/models/Student";
import { StudentDatabaseMock } from "../../mocks/StudentDatabaseMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { DeleteAnnotationSchema } from "../../../src/dtos/annotation/deleteAnnotation.dto";

describe("Testing deleteAnnotationsByAnnotationId", () => {
  const studentBusiness = new StudentBusiness(
    new StudentDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  );

  test("should delete an annotation by its id", async () => {
    const input = DeleteAnnotationSchema.parse({
      token: "token-mock-teacher",
      idToDelete: "id-annotationSal-mock",
    });

    const output = await studentBusiness.deleteAnnotationsByAnnotationId(input);

    expect(output).toEqual({
      message: "Annotation successfully deleted",
    });
  });

  test("should throw UnauthorizedError when token is invalid", async () => {
    const input = DeleteAnnotationSchema.parse({
      token: "invalid-token",
      idToDelete: "id-annotationSal-mock",
    });

    try {
      await studentBusiness.deleteAnnotationsByAnnotationId(input);
      fail("Expected UnauthorizedError, but no error was thrown.");
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedError);
    }
  });

  test("should throw NotFoundError when annotation id does not exist", async () => {
    const input = DeleteAnnotationSchema.parse({
      token: "token-mock-teacher",
      idToDelete: "invalid-annotation-id",
    });

    try {
      await studentBusiness.deleteAnnotationsByAnnotationId(input);
      fail("Expected NotFoundError, but no error was thrown.");
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundError);
    }
  });

  //   test("should throw ForbiddenError when user is not allowed to delete annotation", async () => {
  //     const input = DeleteAnnotationSchema.parse({
  //         token: "token-mock-teacher-adm",
  //         idToDelete: "id-annotationSal-mock",
  //       })

  //     try {
  //       await studentBusiness.deleteAnnotationsByAnnotationId(input);
  //       fail("Expected ForbiddenError, but no error was thrown.");
  //     } catch (error) {
  //       expect(error).toBeInstanceOf(ForbiddenError);
  //     }
  //   });
});
