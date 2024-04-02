import { StudentBusiness } from "../../../src/business/StudentsBusiness";
import { EditStudentSchema } from "../../../src/dtos/student/editStudent.dto";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { StudentDatabaseMock } from "../../mocks/StudentDatabaseMock";
import { UnauthorizedError } from "../../../src/errors/UnauthorizedError";
import { ForbiddenError } from "../../../src/errors/ForbiddenError";
import { NotFoundError } from "../../../src/errors/NotFoundError";

describe("Testing editStudent", () => {
  const studentBusiness = new StudentBusiness(
    new StudentDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  );

  test("should edit a student", async () => {
    const input = EditStudentSchema.parse({
      idToEdit: "id-student-mock1",
      token: "token-mock-teacher",
      name: "Edited Student Name",
      email: "edited.student@mock.com",
      phone: "87654321",
      age: 25,
    });

    const output = await studentBusiness.editStudent(input);

    expect(output).toEqual({
      message: "Edition successfully completed",
    });
  });

  test("should throw UnauthorizedError when token is invalid", async () => {
    const input = EditStudentSchema.parse({
      idToEdit: "id-student-mock1",
      token: "invalid-token",
      name: "Edited Student Name",
      email: "edited.student@mock.com",
      phone: "87654321",
      age: 25,
    });

    try {
      await studentBusiness.editStudent(input);

      fail("Expected UnauthorizedError, but no error was thrown.");
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedError);
    }
  });

  test("should throw NotFoundError when student id does not exist", async () => {
    const input = EditStudentSchema.parse({
      idToEdit: "invalid-id",
      token: "token-mock-teacher",
      name: "Edited Student Name",
      email: "edited.student@mock.com",
      phone: "87654321",
      age: 25,
    });

    try {
      await studentBusiness.editStudent(input);

      fail("Expected NotFoundError, but no error was thrown.");
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundError);
    }
  });

  // test("should throw ForbiddenError when the user is not allowed to edit the student", async () => {
  //   const input = EditStudentSchema.parse({
  //     idToEdit: "id-student-mock1",
  //     token: "token-mock",
  //     name: "Edited Student Name",
  //     email: "edited.student@mock.com",
  //     phone: "87654321",
  //     age: 25,
  //   });

  //   try {
  //     await studentBusiness.editStudent(input);

  //     fail("Expected ForbiddenError, but no error was thrown.");
  //   } catch (error) {
  //     expect(error).toBeInstanceOf(ForbiddenError);
  //   }
  // });
});
