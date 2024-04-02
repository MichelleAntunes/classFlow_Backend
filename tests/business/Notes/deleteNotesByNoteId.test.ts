import { StudentBusiness } from "../../../src/business/StudentsBusiness";
import { UnauthorizedError } from "../../../src/errors/UnauthorizedError";
import { NotFoundError } from "../../../src/errors/NotFoundError";
import { ForbiddenError } from "../../../src/errors/ForbiddenError";
import {
  DeleteNoteInputDTO,
  DeleteNoteSchema,
} from "../../../src/dtos/notes/deleteNote.dto";
import { StudentDatabaseMock } from "../../mocks/StudentDatabaseMock";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";

describe("Testing deleteNotesByNoteId", () => {
  const studentBusiness = new StudentBusiness(
    new StudentDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  );

  test("should delete a note by note id", async () => {
    const input = DeleteNoteSchema.parse({
      token: "token-mock-teacher",
      idToDelete: "id-notesSal-mock",
    });

    const output = await studentBusiness.deleteNotesByNoteId(input);

    expect(output).toEqual({
      message: "Note successfully deleted",
    });
  });

  test("should throw UnauthorizedError when token is invalid", async () => {
    const input: DeleteNoteInputDTO = {
      token: "invalid-token",
      idToDelete: "id-notesSal-mock",
    };

    try {
      await studentBusiness.deleteNotesByNoteId(input);
      fail("Expected UnauthorizedError, but no error was thrown.");
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedError);
    }
  });

  test("should throw NotFoundError when note id does not exist", async () => {
    const input: DeleteNoteInputDTO = {
      token: "token-mock-teacher",
      idToDelete: "invalid-note-id",
    };

    try {
      await studentBusiness.deleteNotesByNoteId(input);
      fail("Expected NotFoundError, but no error was thrown.");
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundError);
    }
  });

  //   test("should throw ForbiddenError when user does not have permission to delete the note", async () => {
  //     const input: DeleteNoteInputDTO = {
  //       token: "token-mock-teacher-adm",
  //       idToDelete: "invalid-note-id",
  //     };

  //     try {
  //       await studentBusiness.deleteNotesByNoteId(input);
  //       fail("Expected ForbiddenError, but no error was thrown.");
  //     } catch (error) {
  //       expect(error).toBeInstanceOf(ForbiddenError);
  //     }
  //   });
});
