import { TokenPayload, USER_ROLES } from "../../src/models/Teacher";

export class TokenManagerMock {
  public createToken = (payload: TokenPayload): string => {
    if (payload.id === "id-mock") {
      // signup
      return "token-mock";
    } else if (payload.id === "id-mock1") {
      // login Professor Mock
      return "token-mock-professor";
    } else {
      // login Professor Mock (admin)
      return "token-mock-professor-adm";
    }
  };

  public getPayload = (token: string): TokenPayload | null => {
    if (token === "token-mock-professor") {
      return {
        id: "id-mock1",
        name: "Professor Mock",
        role: USER_ROLES.NORMAL,
      };
    } else if (token === "token-mock-professor-adm") {
      return {
        id: "id-mock2",
        name: "Professor Mock ADMIN",
        role: USER_ROLES.ADMIN,
      };
    } else {
      return null;
    }
  };
}
