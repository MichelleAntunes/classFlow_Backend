import { TeacherBusiness } from "../../src/business/TeacherBusiness";
import { ResetPasswordSchema } from "../../src/dtos/teacher/resetPassword.dto";
import { HashManagerMock } from "../mocks/HashManagerMock";
import { IdGeneratorMock } from "../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../mocks/TokenManagerMock";
import { TeacherDatabaseMock } from "../mocks/TeacherDatabaseMock";

describe("Testing resetPassword", () => {
  const teacherBusiness = new TeacherBusiness(
    new TeacherDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock(),
    new HashManagerMock()
  );

  test("should test password reset", async () => {
    //controller
    const input = ResetPasswordSchema.parse({
      email: "professor@mock.com",
      newPassword: "New-Mock-123",
      confirmPassword: "New-Mock-123",
    });

    const output = await teacherBusiness.resetPassword(input);
  });
});
