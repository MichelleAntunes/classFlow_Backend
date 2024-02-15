import { StudentBusiness } from "../../../src/business/StudentsBusiness";
import { CreateStudentSchema } from "../../../src/dtos/student/createStudent.dto";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { StudentDatabaseMock } from "../../mocks/StudentDatabaseMock";
import { USER_ROLES } from "../../../src/models/Student";

describe("Testing createStudent", () => {
  const studentBusiness = new StudentBusiness(
    new StudentDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  );

  test("should create a new student", async () => {
    // Arrange
    const input = CreateStudentSchema.parse({
      name: "New Student",
      email: "new.student@mock.com",
      phone: "12345678",
      age: 20,
      role: USER_ROLES.NORMAL,
      token: "token-mock-teacher",
    });

    // Act
    const output = await studentBusiness.createStudent(input);

    // Assert
    expect(output).toEqual({
      message: "Student created successfully",
      studentName: "New Student",
    });
  });
});
