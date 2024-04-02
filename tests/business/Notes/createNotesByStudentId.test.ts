import { StudentBusiness } from "../../../src/business/StudentsBusiness";
import { UnauthorizedError } from "../../../src/errors/UnauthorizedError";
import { NotFoundError } from "../../../src/errors/NotFoundError";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { StudentDatabaseMock } from "../../mocks/StudentDatabaseMock";
import { CreateNoteSchema } from "../../../src/dtos/notes/addNewNote.dto";

describe("Testing createNotesByStudentId", () => {
  const studentBusiness = new StudentBusiness(
    new StudentDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  );

  test("should create a note for a student", async () => {
    const input = CreateNoteSchema.parse({
      token: "token-mock-teacher",
      studentId: "id-student-mock1",
      notes: "New note text",
    });

    const output = await studentBusiness.createNotesByStudentId(input);

    expect(output).toEqual({
      message: "New note successfully added.",
    });
  });

  test("should throw UnauthorizedError when token is invalid", async () => {
    const input = CreateNoteSchema.parse({
      token: "invalid-token",
      studentId: "id-student-mock1",
      notes: "New note text 2",
    });

    try {
      await studentBusiness.createNotesByStudentId(input);
      fail("Expected UnauthorizedError, but no error was thrown.");
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedError);
    }
  });

  test("should throw NotFoundError when student id does not exist", async () => {
    const input = CreateNoteSchema.parse({
      token: "token-mock-teacher",
      studentId: "invalid-id",
      notes: "New note text",
    });

    try {
      await studentBusiness.createNotesByStudentId(input);
      fail("Expected NotFoundError, but no error was thrown.");
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundError);
    }
  });

  //   test("should throw ForbiddenError when the user is not allowed to create notes for the student", async () => {
  //     const input = CreateNoteSchema.parse({
  //       token: "token-mock-teacher",
  //       studentId: "invalid-id",
  //       notes: "New note text",
  //     });

  //     try {
  //       await studentBusiness.createNotesByStudentId(input);
  //       fail("Expected ForbiddenError, but no error was thrown.");
  //     } catch (error) {
  //       expect(error).toBeInstanceOf(ForbiddenError);
  //     }
  //   });
});
