export class HashManagerMock {
  public hash = async (plaintext: string): Promise<string> => {
    return "hash-mock";
  };

  public compare = async (
    plaintext: string,
    hash: string
  ): Promise<boolean> => {
    switch (plaintext) {
      case "Mock123":
        return hash === "hash-mock";

      case "MockAdm-123":
        return hash === "hash-mock-adm";

      default:
        return false;
    }
  };
}
