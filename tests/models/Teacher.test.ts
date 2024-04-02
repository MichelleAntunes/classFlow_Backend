import {
  Teacher,
  USER_ROLES,
  ImageData,
  TeacherDB,
  TeacherModel,
} from "../../src/models/Teacher";

describe("Teacher", () => {
  let teacher: Teacher;

  beforeEach(() => {
    teacher = new Teacher(
      "id-mock",
      "Teacher Name",
      "teacher@example.com",
      "password123",
      "2024-04-02T12:00:00.000Z",
      USER_ROLES.NORMAL,
      {
        data: Buffer.from("mockImageData"),
        mimeType: "image/png",
      }
    );
  });

  test("should create a new teacher", () => {
    expect(teacher).toBeDefined();
  });

  test("should get teacher details", () => {
    expect(teacher.getId()).toBe("id-mock");
    expect(teacher.getName()).toBe("Teacher Name");
    expect(teacher.getEmail()).toBe("teacher@example.com");
    expect(teacher.getPassword()).toBe("password123");
    expect(teacher.getCreatedAt()).toBe("2024-04-02T12:00:00.000Z");
    expect(teacher.getRole()).toBe(USER_ROLES.NORMAL);
    expect(teacher.getPhoto()).toEqual({
      data: Buffer.from("mockImageData"),
      mimeType: "image/png",
    });
  });

  test("should set photo correctly", () => {
    const photoMock: ImageData = {
      data: Buffer.from("anotherMockImageData"),
      mimeType: "image/jpeg",
    };
    teacher.setPhoto(photoMock);
    expect(teacher.getPhoto()).toEqual(photoMock);
  });

  test("toDBModel should return correct DB model", () => {
    const expectedDBModel: TeacherDB = {
      id: "id-mock",
      name: "Teacher Name",
      email: "teacher@example.com",
      password: "password123",
      created_at: "2024-04-02T12:00:00.000Z",
      role: USER_ROLES.NORMAL,
    };
    expect(teacher.toDBModel()).toEqual(expectedDBModel);
  });

  test("toBusinessModel should return correct business model", () => {
    const expectedBusinessModel: TeacherModel = {
      id: "id-mock",
      name: "Teacher Name",
      email: "teacher@example.com",
      createdAt: "2024-04-02T12:00:00.000Z",
      role: USER_ROLES.NORMAL,
    };
    expect(teacher.toBusinessModel()).toEqual(expectedBusinessModel);
  });
});

describe("Teacher setters", () => {
  test("setId should set the id property correctly", () => {
    const teacher = new Teacher("", "", "", "", "", USER_ROLES.NORMAL);
    teacher.setId("teacherIdValue");
    expect(teacher.getId()).toBe("teacherIdValue");
  });

  test("setName should set the name property correctly", () => {
    const teacher = new Teacher("", "", "", "", "", USER_ROLES.NORMAL);
    teacher.setName("teacherNameValue");
    expect(teacher.getName()).toBe("teacherNameValue");
  });

  test("setEmail should set the email property correctly", () => {
    const teacher = new Teacher("", "", "", "", "", USER_ROLES.NORMAL);
    teacher.setEmail("teacher@example.com");
    expect(teacher.getEmail()).toBe("teacher@example.com");
  });

  test("setPassword should set the password property correctly", () => {
    const teacher = new Teacher("", "", "", "", "", USER_ROLES.NORMAL);
    teacher.setPassword("password123");
    expect(teacher.getPassword()).toBe("password123");
  });

  test("setCreatedAt should set the createdAt property correctly", () => {
    const teacher = new Teacher("", "", "", "", "", USER_ROLES.NORMAL);
    teacher.setCreatedAt("2024-04-02T12:00:00.000Z");
    expect(teacher.getCreatedAt()).toBe("2024-04-02T12:00:00.000Z");
  });

  test("setRole should set the role property correctly", () => {
    const teacher = new Teacher("", "", "", "", "", USER_ROLES.NORMAL);
    teacher.setRole(USER_ROLES.ADMIN);
    expect(teacher.getRole()).toBe(USER_ROLES.ADMIN);
  });
});
