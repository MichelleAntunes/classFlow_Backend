import { TokenPayload, USER_ROLES } from "../../src/models/Teacher";

export class TokenManagerMock {
  public createToken = (payload: TokenPayload): string => {
    if (payload.id === "id-mock") {
      // signup
      return "token-mock";
    } else if (payload.id === "id-mock1") {
      // login teacher Mock
      return "token-mock-teacher";
    } else {
      // login teacher Mock (admin)
      return "token-mock-teacher-adm";
    }
  };

  public getPayload = (token: string): TokenPayload | null => {
    if (token === "token-mock-teacher") {
      return {
        id: "id-mock1",
        name: "token-mock-teacher",
        role: USER_ROLES.NORMAL,
      };
    } else if (token === "token-mock-teacher-adm") {
      return {
        id: "id-mock2",
        name: "Teacher Mock ADMIN",
        role: USER_ROLES.ADMIN,
      };
    } else {
      return null;
    }
  };
}
