import { StudentBusiness } from "../../../src/business/StudentsBusiness";
import { UnauthorizedError } from "../../../src/errors/UnauthorizedError";
import { NotFoundError } from "../../../src/errors/NotFoundError";
import { ForbiddenError } from "../../../src/errors/ForbiddenError";
import {
  EditNoteInputDTO,
  EditNoteSchema,
} from "../../../src/dtos/notes/editNote.dto";
import { EditNoteOutputDTO } from "../../../src/dtos/notes/editNote.dto";
import { USER_ROLES } from "../../../src/models/Student";
import { StudentDatabaseMock } from "../../mocks/StudentDatabaseMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";

describe("Testing editNoteByNoteId", () => {
  const studentBusiness = new StudentBusiness(
    new StudentDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  );

  test("should edit a note for a student", async () => {
    const input = EditNoteSchema.parse({
      token: "token-mock-teacher",
      idToEdit: "id-notesSal-mock",
      note: "Updated note text",
    });

    const output = await studentBusiness.editNoteByNoteId(input);

    expect(output).toEqual({
      message: "Note successfully edited",
    });
  });

  test("should throw UnauthorizedError when token is invalid", async () => {
    const input = EditNoteSchema.parse({
      token: "invalid-token",
      idToEdit: "id-notesSal-mock",
      note: "Updated note text",
    });

    try {
      await studentBusiness.editNoteByNoteId(input);
      fail("Expected UnauthorizedError, but no error was thrown.");
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedError);
    }
  });

  test("should throw NotFoundError when note id does not exist", async () => {
    const input = EditNoteSchema.parse({
      token: "token-mock-teacher",
      idToEdit: "invalid-note-id",
      note: "Updated note text",
    });

    try {
      await studentBusiness.editNoteByNoteId(input);
      fail("Expected NotFoundError, but no error was thrown.");
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundError);
    }
  });

  //   test("should throw ForbiddenError when user is not allowed to edit the note", async () => {
  //     const input: EditNoteInputDTO = {
  //       token: "valid-token",
  //       idToEdit: "id-notesMar-mock",
  //       note: "Updated note text",
  //     };

  //     try {
  //       await studentBusiness.editNoteByNoteId(input);
  //       fail("Expected ForbiddenError, but no error was thrown.");
  //     } catch (error) {
  //       expect(error).toBeInstanceOf(ForbiddenError);
  //     }
  //   });
});
