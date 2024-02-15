import { StudentBusiness } from "../../../src/business/StudentsBusiness";

import { DeleteStudentSchema } from "../../../src/dtos/student/deleteStudent.dto";

import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { StudentDatabaseMock } from "../../mocks/StudentDatabaseMock";

describe("Testing deleteStudent", () => {
  const studentBusiness = new StudentBusiness(
    new StudentDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  );

  test("should delete a student", async () => {
    // Arrange
    const input = DeleteStudentSchema.parse({
      idToDelete: "id-student-mock1",
      token: "token-mock-teacher",
    });

    // Act
    const output = await studentBusiness.deleteStudent(input);

    // Assert
    expect(output).toEqual({
      message: "Estudante deletado com sucesso",
    });
  });
});
