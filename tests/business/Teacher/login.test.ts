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
  test("It should trigger an error if the e-mail is not valid", async () => {
    try {
      const input = LoginSchema.parse({
        email: "teacherrmock.com",
        password: "Mock-123",
      });
    } catch (error) {
      if (error instanceof BaseError) {
        expect(error.statusCode).toBe(400);
        expect(error.message).toBe("Invalid e-mail and/or password");
      }
    }
  });
  test("It should trigger an error if the password is not valid", async () => {
    try {
      const input = LoginSchema.parse({
        email: "teacher@mock.com",
        password: "mock-123",
      });
    } catch (error) {
      if (error instanceof BaseError) {
        expect(error.statusCode).toBe(400);
        expect(error.message).toBe("Invalid e-mail and/or password");
      }
    }
  });
});
