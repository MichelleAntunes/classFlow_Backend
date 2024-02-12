import { TeacherBusiness } from "../../src/business/TeacherBusiness";
import { LoginSchema } from "../../src/dtos/teacher/login.dto";
import { HashManagerMock } from "../mocks/HashManagerMock";
import { IdGeneratorMock } from "../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../mocks/TokenManagerMock";
import { TeacherDatabaseMock } from "../mocks/TeacherDatabaseMock";

describe("Testando login", () => {
  const teacherBusiness = new TeacherBusiness(
    new TeacherDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock(),
    new HashManagerMock()
  );

  test("must generate token when logging in", async () => {
    const input = LoginSchema.parse({
      email: "professor@mock.com",
      password: "Mock-123",
    });

    const output = await teacherBusiness.login(input);

    expect(output).toEqual({
      token: "token-mock-professor",
    });
  });
});
