import { TeacherBusiness } from "../../../src/business/TeacherBusiness";
import { LoginSchema } from "../../../src/dtos/teacher/login.dto";
import { HashManagerMock } from "../../mocks/HashManagerMock";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { TeacherDatabaseMock } from "../../mocks/TeacherDatabaseMock";
import { ZodError } from "zod";
import { BaseError } from "../../../src/errors/BaseError";

describe("Testing login", () => {
  const teacherBusiness = new TeacherBusiness(
    new TeacherDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock(),
    new HashManagerMock()
  );

  test("must generate token when logging in", async () => {
    const input = LoginSchema.parse({
      email: "teacher@mock.com",
      password: "Mock-123",
    });

    const output = await teacherBusiness.login(input);

    expect(output).toEqual({
      token: "token-mock-teacher",
    });
  });
  test("should throw BaseError if teacher is not found", async () => {
    // Arrange

    const email = "nonexistent@example.com";

    // Act
    try {
      await teacherBusiness.login({ email, password: "mock-password" });
      fail("Expected BaseError, but no error was thrown.");
    } catch (error: any) {
      // Assert
      expect(error).toBeInstanceOf(BaseError);
      expect(error.statusCode).toBe(400);
      expect(error.message).toBe("Invalid e-mail and/or password");
    }
  });

  test("should throw BaseError when logging in with invalid password", async () => {
    const input = LoginSchema.parse({
      email: "teacher@mock.com",
      password: "InvalidPpassword123!",
    });
    try {
      await teacherBusiness.login(input);
      fail("Expected ZodError, but no error was thrown.");
    } catch (error) {
      if (error instanceof BaseError) {
        expect(error).toBeInstanceOf(BaseError);
        expect(error.statusCode).toBe(400);
        expect(error.message).toBe("Invalid e-mail and/or password");
      }
    }
  });
  test("should throw BaseError when logging in with invalid email", async () => {
    try {
      const input = LoginSchema.parse({
        email: "invalid-email",
        password: "ValidPassword123!",
      });
      fail("Expected ZodError, but no error was thrown.");
    } catch (error: any) {
      expect(error).toBeInstanceOf(ZodError);
      if (error instanceof ZodError) {
        expect(error.errors).toHaveLength(1);
        expect(error.errors[0].message).toBe("Invalid email");
      }
    }
  });

  test("should throw BaseError when logging in with invalid password", async () => {
    try {
      const input = LoginSchema.parse({
        email: "teacher@mock.com",
        password: "invalid-password",
      });
      fail("Expected ZodError, but no error was thrown.");
    } catch (error: any) {
      expect(error).toBeInstanceOf(ZodError);
      if (error instanceof ZodError) {
        expect(error.errors).toHaveLength(1);
        expect(error.errors[0].message).toBe(
          "The password must contain at least one lowercase letter, one uppercase letter, one number and one special character."
        );
      }
    }
  });
});
