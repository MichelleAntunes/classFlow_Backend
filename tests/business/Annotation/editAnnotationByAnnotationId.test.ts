import { StudentBusiness } from "../../../src/business/StudentsBusiness";
import { UnauthorizedError } from "../../../src/errors/UnauthorizedError";
import { NotFoundError } from "../../../src/errors/NotFoundError";
import { ForbiddenError } from "../../../src/errors/ForbiddenError";

import { USER_ROLES } from "../../../src/models/Student";
import { StudentDatabaseMock } from "../../mocks/StudentDatabaseMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { EditAnnotationSchema } from "../../../src/dtos/annotation/editAnnotation.dto";

describe("Testing editAnnotationByAnnotationId", () => {
  const studentBusiness = new StudentBusiness(
    new StudentDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  );

  test("should edit an annotation by its id", async () => {
    const input = EditAnnotationSchema.parse({
      token: "token-mock-teacher",
      idToEdit: "id-annotationSal-mock",
      annotation: "Edited annotation text",
    });

    const output = await studentBusiness.editAnnotationByAnnotationId(input);

    expect(output).toEqual({
      message: "Annotation successfully edited",
    });
  });

  test("should throw UnauthorizedError when token is invalid", async () => {
    const input = EditAnnotationSchema.parse({
      token: "invalid-token",
      idToEdit: "id-annotationSal-mock",
      annotation: "Edited annotation text",
    });

    try {
      await studentBusiness.editAnnotationByAnnotationId(input);
      fail("Expected UnauthorizedError, but no error was thrown.");
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedError);
    }
  });

  test("should throw NotFoundError when annotation id does not exist", async () => {
    const input = EditAnnotationSchema.parse({
      token: "token-mock-teacher",
      idToEdit: "invalid-annotation-id",
      annotation: "Edited annotation text",
    });

    try {
      await studentBusiness.editAnnotationByAnnotationId(input);
      fail("Expected NotFoundError, but no error was thrown.");
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundError);
    }
  });

  //   test("should throw ForbiddenError when user is not allowed to edit annotation", async () => {
  //     const input: EditAnnotationInputDTO = {
  //       token: "valid-token",
  //       idToEdit: "id-annotationMar-mock2",
  //       annotation: "Edited annotation text",
  //     };

  //     try {
  //       await studentBusiness.editAnnotationByAnnotationId(input);
  //       fail("Expected ForbiddenError, but no error was thrown.");
  //     } catch (error) {
  //       expect(error).toBeInstanceOf(ForbiddenError);
  //     }
  //   });
});
