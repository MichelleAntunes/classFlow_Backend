import { ForbiddenError } from "../../src/errors/ForbiddenError";

describe("ForbiddenError", () => {
  test("should create a ForbiddenError with default message and status code 403", () => {
    const error = new ForbiddenError();
    expect(error).toBeInstanceOf(ForbiddenError);
    expect(error.statusCode).toBe(403);
    expect(error.message).toBe("Valid token, but not enough permissions");
  });

  test("should create a ForbiddenError with custom message and status code 403", () => {
    const customMessage = "Custom Forbidden Error Message";
    const error = new ForbiddenError(customMessage);
    expect(error).toBeInstanceOf(ForbiddenError);
    expect(error.statusCode).toBe(403);
    expect(error.message).toBe(customMessage);
  });
});
