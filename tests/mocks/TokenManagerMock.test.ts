import { TokenPayload, USER_ROLES } from "../../src/models/Teacher";
import { TokenManagerMock } from "./TokenManagerMock";

describe("TokenManagerMock", () => {
  let tokenManager: TokenManagerMock;

  beforeEach(() => {
    tokenManager = new TokenManagerMock();
  });

  test("should create token for signup", () => {
    const payload: TokenPayload = {
      id: "id-mock",
      name: "Mock",
      role: USER_ROLES.NORMAL,
    };
    const token = tokenManager.createToken(payload);
    expect(token).toBe("token-mock");
  });

  test("should create token for login teacher Mock", () => {
    const payload: TokenPayload = {
      id: "id-mock1",
      name: "Teacher Mock",
      role: USER_ROLES.NORMAL,
    };
    const token = tokenManager.createToken(payload);
    expect(token).toBe("token-mock-teacher");
  });

  test("should create token for login teacher Mock (admin)", () => {
    const payload: TokenPayload = {
      id: "id-mock2",
      name: "Teacher Mock ADMIN",
      role: USER_ROLES.ADMIN,
    };
    const token = tokenManager.createToken(payload);
    expect(token).toBe("token-mock-teacher-adm");
  });

  test("should get payload from token for teacher Mock", () => {
    const token = "token-mock-teacher";
    const payload = tokenManager.getPayload(token);
    expect(payload).toEqual({
      id: "id-mock1",
      name: "token-mock-teacher",
      role: USER_ROLES.NORMAL,
    });
  });

  test("should get payload from token for teacher Mock (admin)", () => {
    const token = "token-mock-teacher-adm";
    const payload = tokenManager.getPayload(token);
    expect(payload).toEqual({
      id: "id-mock2",
      name: "Teacher Mock ADMIN",
      role: USER_ROLES.ADMIN,
    });
  });

  test("should return null payload for invalid token", () => {
    const token = "invalid-token";
    const payload = tokenManager.getPayload(token);
    expect(payload).toBeNull();
  });
});
