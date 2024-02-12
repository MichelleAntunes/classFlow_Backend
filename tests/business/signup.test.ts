import { TeacherBusiness } from "../../src/business/TeacherBusiness";
import { SignupSchema } from "../../src/dtos/teacher/signup.dto";
import { HashManagerMock } from "../mocks/HashManagerMock";
import { IdGeneratorMock } from "../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../mocks/TokenManagerMock";
import { TeacherDatabaseMock } from "../mocks/TeacherDatabaseMock";

describe("Testing signup", () => {
  const teacherBusiness = new TeacherBusiness(
    new TeacherDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock(),
    new HashManagerMock()
  );

  test("must generate token when registering", async () => {
    //controller
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
});
