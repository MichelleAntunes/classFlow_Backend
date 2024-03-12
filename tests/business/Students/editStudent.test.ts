import { StudentBusiness } from "../../../src/business/StudentsBusiness";

import { EditStudentSchema } from "../../../src/dtos/student/editStudent.dto";

import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { StudentDatabaseMock } from "../../mocks/StudentDatabaseMock";

describe("Testing editStudent", () => {
  const studentBusiness = new StudentBusiness(
    new StudentDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  );

  test("should edit a student", async () => {
    // Arrange
    const input = EditStudentSchema.parse({
      idToEdit: "id-student-mock1",
      token: "token-mock-teacher",
      name: "Edited Student Name",
      email: "edited.student@mock.com",
      phone: "87654321",
      age: 25,
    });

    // Act
    const output = await studentBusiness.editStudent(input);

    // Assert
    expect(output).toEqual({
      message: "Edition successfully completed",
    });
  });
});
