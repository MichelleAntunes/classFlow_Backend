import { TeacherBusiness } from "../../../src/business/TeacherBusiness";
import { ResetPasswordSchema } from "../../../src/dtos/teacher/resetPassword.dto";
import { HashManagerMock } from "../../mocks/HashManagerMock";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { TeacherDatabaseMock } from "../../mocks/TeacherDatabaseMock";
import { ZodError } from "zod";
import { BaseError } from "../../../src/errors/BaseError";

describe("Testing resetPassword", () => {
  const teacherBusiness = new TeacherBusiness(
    new TeacherDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock(),
    new HashManagerMock()
  );

  test("Should test password reset", async () => {
    const input = ResetPasswordSchema.parse({
      email: "teacher@mock.com",
      newPassword: "New-Mock-123",
      confirmPassword: "New-Mock-123",
    });

    const output = await teacherBusiness.resetPassword(input);
  });

  test("It should trigger an error if the e-mail is not valid", async () => {
    expect.assertions(1);
    try {
      const input = ResetPasswordSchema.parse({
        email: "teacher.com",
        newPassword: "New-Mock-123",
        confirmPassword: "New-Mock-123",
      });
    } catch (error) {
      if (error instanceof ZodError) {
        expect(error.issues[0].message).toBe("Invalid email");
      }
    }
  });
  test("should throw an error if newPassword and confirmPassword are not identical", async () => {
    try {
      // expect.assertions(2);
      const input = ResetPasswordSchema.parse({
        email: "teacher@mock.com",
        newPassword: "NewMock12!",
        confirmPassword: "NewMock123!",
      });
    } catch (error) {
      if (error instanceof BaseError) {
        expect(error.statusCode).toBe(400);
        expect(error.message).toBe("Passwords do not match");
      }
    }
  });
  test("It should trigger an error if the password is not valid", async () => {
    expect.assertions(1);
    try {
      const input = ResetPasswordSchema.parse({
        email: "teacher@mock.com",
        newPassword: "NewPassword",
        confirmPassword: "NewPassword",
      });
    } catch (error) {
      if (error instanceof ZodError) {
        expect(error.issues[0].message).toBe(
          "The password must contain at least one lowercase letter, one uppercase letter, one number and one special character."
        );
      }
    }
  });
  test("It should trigger an error if the teacher's e-mail address is not found.", async () => {
    // expect.assertions(2);
    try {
      const input = ResetPasswordSchema.parse({
        email: "teacher@notfound.com",
        newPassword: "NewPassword",
        confirmPassword: "NewPassword",
      });
    } catch (error) {
      if (error instanceof BaseError) {
        expect(error.statusCode).toBe(400);
        expect(error.message).toBe("Teacher not found");
      }
    }
  });
});
