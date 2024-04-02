import { HashManagerMock } from "./HashManagerMock";

describe("HashManagerMock", () => {
  let hashManager: HashManagerMock;

  beforeEach(() => {
    hashManager = new HashManagerMock();
  });

  test("should return 'hash-mock' when hashing 'Mock-123'", async () => {
    const plaintext = "Mock-123";
    const hashed = await hashManager.hash(plaintext);
    expect(hashed).toBe("hash-mock");
  });

  test("should return true when comparing 'Mock-123' with 'hash-mock'", async () => {
    const plaintext = "Mock-123";
    const hash = "hash-mock";
    const result = await hashManager.compare(plaintext, hash);
    expect(result).toBeTruthy();
  });

  test("should return false when comparing 'Mock-123' with 'hash-mock-adm'", async () => {
    const plaintext = "Mock-123";
    const hash = "hash-mock-adm";
    const result = await hashManager.compare(plaintext, hash);
    expect(result).toBeFalsy();
  });

  test("should return true when comparing 'MockAdm-123' with 'hash-mock-adm'", async () => {
    const plaintext = "MockAdm-123";
    const hash = "hash-mock-adm";
    const result = await hashManager.compare(plaintext, hash);
    expect(result).toBeTruthy();
  });

  test("should return false when comparing 'MockAdm-123' with 'hash-mock'", async () => {
    const plaintext = "MockAdm-123";
    const hash = "hash-mock";
    const result = await hashManager.compare(plaintext, hash);
    expect(result).toBeFalsy();
  });
});
