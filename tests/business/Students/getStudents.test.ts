import { StudentBusiness } from "../../../src/business/StudentsBusiness";
import { GetStudentSchema } from "../../../src/dtos/student/getStudents.dto";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { StudentDatabaseMock } from "../../mocks/StudentDatabaseMock";
import { USER_ROLES } from "../../../src/models/Student";
import { UnauthorizedError } from "../../../src/errors/UnauthorizedError";

describe("Tasting getStudent", () => {
  const studentBusiness = new StudentBusiness(
    new StudentDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  );

  test("must return a list of all students", async () => {
    const input = GetStudentSchema.parse({
      token: "token-mock-teacher",
    });
    const output = await studentBusiness.getStudents(input);
    expect(output).toHaveLength(2);
    expect(output).toEqual([
      {
        id: "id-student-mock1",
        name: "Student Sal",
        email: "sal.student@mock.com",
        phone: "01478525",
        age: 30,
        notes: [
          {
            id: "id-notesSal-mock",
            notes: "90",
          },
        ],
        annotations: [
          {
            annotationsId: "id-annotationSal-mock",
            annotationsText: "First Annotation Sal",
          },
          {
            annotationsId: "id-annotationSal-mock2",
            annotationsText: "Second Annotation Sal",
          },
        ],
        photo: null,
        teacherId: {
          id: "id-mock1",
          name: "Teacher Mock",
        },
        createdAt: new Date().toISOString().slice(0, -5), // Remove the last 5 characters (the milliseconds)

        role: USER_ROLES.NORMAL,
        updatedAt: new Date().toISOString().slice(0, -5), // Remove the last 5 characters (the milliseconds)
      },
      {
        id: "id-student-mock2",
        name: "Student Mar",
        email: "mar.student@mock.com",
        phone: "45693012",
        age: 15,
        notes: [
          {
            id: "id-notesMar-mock",
            notes: "60",
          },
        ],
        annotations: [
          {
            annotationsId: "id-annotationMar-mock",
            annotationsText: "First Annotation Mar",
          },
          {
            annotationsId: "id-annotationMar-mock2",
            annotationsText: "Second Annotation Mar",
          },
        ],
        photo: null,
        teacherId: {
          id: "id-mock1",
          name: "Teacher Mock",
        },
        createdAt: new Date().toISOString().slice(0, -5), // Remove the last 5 characters (the milliseconds)

        role: USER_ROLES.NORMAL,
        updatedAt: new Date().toISOString().slice(0, -5), // Remove the last 5 characters (the milliseconds)
      },
    ]);
  });
  test("should throw UnauthorizedError when token is invalid", async () => {
    const input = GetStudentSchema.parse({
      name: "New Student",
      email: "new.student@mock.com",
      phone: "12345678",
      age: 20,
      role: USER_ROLES.NORMAL,
      token: "invalid-token",
    });

    try {
      await studentBusiness.getStudents(input);
      fail("Expected UnauthorizedError, but no error was thrown.");
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedError);
    }
  });
});
