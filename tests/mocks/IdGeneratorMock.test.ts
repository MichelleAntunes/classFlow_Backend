import { IdGeneratorMock } from "./IdGeneratorMock";

describe("IdGeneratorMock", () => {
  let idGenerator: IdGeneratorMock;

  beforeEach(() => {
    idGenerator = new IdGeneratorMock();
  });

  test("should return 'id-mock' when generating an ID", () => {
    const generatedId = idGenerator.generate();
    expect(generatedId).toBe("id-mock");
  });
});
