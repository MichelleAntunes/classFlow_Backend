import { TeacherBusiness } from "../../../src/business/TeacherBusiness";
import { SignupSchema } from "../../../src/dtos/teacher/signup.dto";
import { HashManagerMock } from "../../mocks/HashManagerMock";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { TeacherDatabaseMock } from "../../mocks/TeacherDatabaseMock";
import { ZodError } from "zod";
import { BadRequestError } from "../../../src/errors/BadRequestError";
import { BaseError } from "../../../src/errors/BaseError";

describe("Testing signup", () => {
  const teacherBusiness = new TeacherBusiness(
    new TeacherDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock(),
    new HashManagerMock()
  );

  test("must generate token when registering", async () => {
    const input = SignupSchema.parse({
      name: "New Teacher",
      email: "new@teacher.com",
      password: "New-teacher123",
    });

    const output = await teacherBusiness.signup(input);

    expect(output).toEqual({
      token: "token-mock",
    });
  });

  test("It should trigger an error if the name does not contain at least 2 characters.", async () => {
    expect.assertions(1);
    try {
      const input = SignupSchema.parse({
        name: "",
        email: "new@teacher.com",
        password: "New-teacher123",
      });
    } catch (error) {
      if (error instanceof ZodError) {
        expect(error.issues[0].message).toBe(
          "String must contain at least 2 character(s)"
        );
      }
    }
  });
  test("It should trigger an error if the e-mail is not valid", async () => {
    expect.assertions(1);
    try {
      const input = SignupSchema.parse({
        name: "New Teacher",
        email: "newteacher.com",
        password: "New-teacher123",
      });
    } catch (error) {
      if (error instanceof ZodError) {
        expect(error.issues[0].message).toBe("Invalid email");
      }
    }
  });
  test("It should trigger an error if the password is not valid", async () => {
    expect.assertions(1);
    try {
      const input = SignupSchema.parse({
        name: "New Teacher",
        email: "new@teacher.com",
        password: "teacher123",
      });
    } catch (error) {
      if (error instanceof ZodError) {
        expect(error.issues[0].message).toBe(
          "The password must contain at least one lowercase letter, one uppercase letter, one number and one special character."
        );
      }
    }
  });

  test("It should trigger an error if the e-mail already exists. ", async () => {
    // expect.assertions(2);
    try {
      const input = SignupSchema.parse({
        name: "Teacher Mock",
        email: "teacher@mock.com",
        password: "Mock-123",
      });
      const output = await teacherBusiness.signup(input);
    } catch (error) {
      if (error instanceof BaseError) {
        expect(error.statusCode).toBe(400);
        expect(error.message).toBe("E-mail already exists");
      }
    }
  });
});
