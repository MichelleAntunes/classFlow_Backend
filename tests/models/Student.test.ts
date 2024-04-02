import { Student, Notes, Annotation } from "../../src/models/Student";
import { USER_ROLES } from "../../src/models/Student";

describe("Student", () => {
  let student: Student;

  beforeEach(() => {
    student = new Student(
      "id-student-mock1",
      "Student Sal",
      "sal.student@mock.com",
      "01478525",
      30,
      [],
      [],
      "id-mock1",
      "Teacher Mock",
      new Date().toISOString().slice(0, -5),
      USER_ROLES.NORMAL,
      new Date().toISOString().slice(0, -5),
      null
    );
  });

  test("should create a new student", () => {
    expect(student).toBeDefined();
  });

  test("should get student details", () => {
    expect(student.getId()).toBe("id-student-mock1");
    expect(student.getName()).toBe("Student Sal");
    expect(student.getEmail()).toBe("sal.student@mock.com");
    expect(student.getPhone()).toBe("01478525");
    expect(student.getAge()).toBe(30);
    expect(student.getTeacherId()).toBe("id-mock1");
    expect(student.getTeacherName()).toBe("Teacher Mock");
    expect(student.getCreatedAt()).toBeDefined();
    expect(student.getRole()).toBe(USER_ROLES.NORMAL);
    expect(student.getUpdateAt()).toBeDefined();
    expect(student.getPhoto()).toBeNull();
  });

  describe("toDBModel", () => {
    test("should convert to DB model correctly", () => {
      const dbModel = student.toDBModel();
      expect(dbModel.id).toBe("id-student-mock1");
      expect(dbModel.name).toBe("Student Sal");
      expect(dbModel.email).toBe("sal.student@mock.com");
      expect(dbModel.phone).toBe("01478525");
      expect(dbModel.age).toBe(30);
      expect(dbModel.notes).toEqual([]);
      expect(dbModel.annotations).toEqual([]);
      expect(dbModel.teacher_id).toBe("id-mock1");
      expect(dbModel.created_at).toBeDefined();
      expect(dbModel.role).toBe(USER_ROLES.NORMAL);
      expect(dbModel.updated_at).toBeDefined();
      expect(dbModel.photo).toBeNull();
    });
  });

  describe("toBusinessModel", () => {
    test("should convert to business model correctly", () => {
      const businessModel = student.toBusinessModel();
      expect(businessModel.id).toBe("id-student-mock1");
      expect(businessModel.name).toBe("Student Sal");
      expect(businessModel.email).toBe("sal.student@mock.com");
      expect(businessModel.phone).toBe("01478525");
      expect(businessModel.age).toBe(30);
      expect(businessModel.notes).toEqual([]);
      expect(businessModel.annotations).toEqual([]);
      expect(businessModel.teacherId).toEqual({
        id: "id-mock1",
        name: "Teacher Mock",
      });
      expect(businessModel.createdAt).toBeDefined();
      expect(businessModel.role).toBe(USER_ROLES.NORMAL);
      expect(businessModel.updatedAt).toBeDefined();
      expect(businessModel.photo).toBeNull();
    });
  });
});

describe("Notes", () => {
  let note: Notes;

  beforeEach(() => {
    note = new Notes(
      "id-notesSal-mock",
      "id-student-mock1",
      "90",
      new Date().toISOString().slice(0, -5),
      new Date().toISOString().slice(0, -5),
      "id-mock1"
    );
  });

  test("should create a new note", () => {
    expect(note).toBeDefined();
  });

  test("should get note details", () => {
    expect(note.getNoteId()).toBe("id-notesSal-mock");
    expect(note.getStudentId()).toBe("id-student-mock1");
    expect(note.getNotes()).toBe("90");
    expect(note.getCreatedAt()).toBeDefined();
    expect(note.getUpdatedAt()).toBeDefined();
    expect(note.getTeacherId()).toBe("id-mock1");
  });

  describe("toDBModel", () => {
    test("should convert to DB model correctly", () => {
      const dbModel = note.toDBModel();
      expect(dbModel.id).toBe("id-notesSal-mock");
      expect(dbModel.student_id).toBe("id-student-mock1");
      expect(dbModel.notes).toBe("90");
      expect(dbModel.created_at).toBeDefined();
      expect(dbModel.updated_at).toBeDefined();
      expect(dbModel.teacher_id).toBe("id-mock1");
    });
  });
});

describe("Annotation", () => {
  let annotation: Annotation;

  beforeEach(() => {
    annotation = new Annotation(
      "id-annotationSal-mock",
      "id-student-mock1",
      "First Annotation Sal",
      new Date().toISOString().slice(0, -5),
      new Date().toISOString().slice(0, -5),
      "id-mock1"
    );
  });

  test("should create a new annotation", () => {
    expect(annotation).toBeDefined();
  });

  test("should get annotation details", () => {
    expect(annotation.getAnnotationId()).toBe("id-annotationSal-mock");
    expect(annotation.getStudentId()).toBe("id-student-mock1");
    expect(annotation.getAnnotation()).toBe("First Annotation Sal");
    expect(annotation.getCreatedAt()).toBeDefined();
    expect(annotation.getUpdatedAt()).toBeDefined();
    expect(annotation.getTeacherId()).toBe("id-mock1");
  });

  describe("toDBModel", () => {
    test("should convert to DB model correctly", () => {
      const dbModel = annotation.toDBModel();
      expect(dbModel.id).toBe("id-annotationSal-mock");
      expect(dbModel.student_id).toBe("id-student-mock1");
      expect(dbModel.annotations).toBe("First Annotation Sal");
      expect(dbModel.created_at).toBeDefined();
      expect(dbModel.updated_at).toBeDefined();
      expect(dbModel.teacher_id).toBe("id-mock1");
    });
  });
});

describe("Student setters", () => {
  test("setId should set the id property correctly", () => {
    const student = new Student(
      "",
      "",
      "",
      null,
      null,
      [],
      [],
      "",
      "",
      "",
      USER_ROLES.NORMAL,
      "",
      ""
    );
    student.setId("studentIdValue");
    expect(student.getId()).toBe("studentIdValue");
  });

  test("setAnnotations should set the annotations property correctly", () => {
    const student = new Student(
      "",
      "",
      "",
      null,
      null,
      [],
      [],
      "",
      "",
      "",
      USER_ROLES.NORMAL,
      "",
      ""
    );
    const annotationsMock = [
      new Annotation(
        "annotation1",
        "id-student-mock1",
        "Annotation 1",
        "",
        "",
        "teacherId"
      ),
    ];
    student.setAnnotations(annotationsMock);
    expect(student.getAnnotations()).toEqual(annotationsMock);
  });

  test("getPhoto should return correct ImageData or string or null value", () => {
    // Criar um objeto ImageData válido
    const photoMock = {
      data: Buffer.from("mockImageData"),
      mimeType: "image/png" as const, // Corrigindo o tipo para uma das opções válidas
    };
    const student = new Student(
      "",
      "",
      "",
      null,
      null,
      [],
      [],
      "",
      "",
      "",
      USER_ROLES.NORMAL,
      "",
      ""
    );
    student.setPhoto(photoMock);
    expect(student.getPhoto()).toEqual(photoMock);
  });

  test("setTeacherId should set the teacherId property correctly", () => {
    const student = new Student(
      "",
      "",
      "",
      null,
      null,
      [],
      [],
      "",
      "",
      "",
      USER_ROLES.NORMAL,
      "",
      ""
    );
    student.setTeacherId("teacherIdValue");
    expect(student.getTeacherId()).toBe("teacherIdValue");
  });

  test("setTeacherName should set the teacherName property correctly", () => {
    const student = new Student(
      "",
      "",
      "",
      null,
      null,
      [],
      [],
      "",
      "",
      "",
      USER_ROLES.NORMAL,
      "",
      ""
    );
    student.setTeacherName("teacherNameValue");
    expect(student.getTeacherName()).toBe("teacherNameValue");
  });

  test("setCreatedAt should set the createdAt property correctly", () => {
    const student = new Student(
      "",
      "",
      "",
      null,
      null,
      [],
      [],
      "",
      "",
      "",
      USER_ROLES.NORMAL,
      "",
      ""
    );
    student.setCreatedAt("createdAtValue");
    expect(student.getCreatedAt()).toBe("createdAtValue");
  });

  test("setRole should set the role property correctly", () => {
    const student = new Student(
      "",
      "",
      "",
      null,
      null,
      [],
      [],
      "",
      "",
      "",
      USER_ROLES.NORMAL,
      "",
      ""
    );
    student.setRole(USER_ROLES.ADMIN);
    expect(student.getRole()).toBe(USER_ROLES.ADMIN);
  });

  test("setUpdateAt should set the updatedAt property correctly", () => {
    const student = new Student(
      "",
      "",
      "",
      null,
      null,
      [],
      [],
      "",
      "",
      "",
      USER_ROLES.NORMAL,
      "",
      ""
    );
    student.setUpdateAt("updatedAtValue");
    expect(student.getUpdateAt()).toBe("updatedAtValue");
  });
});

describe("Student setters", () => {
  const photoMock = {
    data: Buffer.from("mockImageData"),
    mimeType: "image/png" as const, // Corrigindo o tipo para uma das opções válidas
  };
  test("setNotes should set the notes property correctly", () => {
    const notesMock = [
      new Notes(
        "noteId1",
        "studentId1",
        "Note 1",
        "createdAt1",
        "updatedAt1",
        "teacherId1"
      ),
      new Notes(
        "noteId2",
        "studentId1",
        "Note 2",
        "createdAt2",
        "updatedAt2",
        "teacherId1"
      ),
    ];
    const student = new Student(
      "",
      "",
      "",
      null,
      null,
      [],
      [],
      "",
      "",
      "",
      USER_ROLES.NORMAL,
      "",
      ""
    );
    student.setNotes(notesMock);
    expect(student.getNotes()).toEqual(notesMock);
  });

  test("getNotes should return correct notes property value", () => {
    const notesMock = [
      new Notes(
        "noteId1",
        "studentId1",
        "Note 1",
        "createdAt1",
        "updatedAt1",
        "teacherId1"
      ),
      new Notes(
        "noteId2",
        "studentId1",
        "Note 2",
        "createdAt2",
        "updatedAt2",
        "teacherId1"
      ),
    ];
    const student = new Student(
      "",
      "",
      "",
      null,
      null,
      notesMock,
      [],
      "",
      "",
      "",
      USER_ROLES.NORMAL,
      "",
      ""
    );
    expect(student.getNotes()).toEqual(notesMock);
  });

  test("setPhoto should set the photo property correctly", () => {
    const photoMock = {
      data: Buffer.from("mockImageData"),
      mimeType: "image/png" as const, // Corrigindo o tipo para uma das opções válidas
    };

    const student = new Student(
      "",
      "",
      "",
      null,
      null,
      [],
      [],
      "",
      "",
      "",
      USER_ROLES.NORMAL,
      "",
      ""
    );
    student.setPhoto(photoMock);
    expect(student.getPhoto()).toEqual(photoMock);
  });

  test("toDBModel should return correct DB model", () => {
    const photoMock = {
      data: Buffer.from("mockImageData"),
      mimeType: "image/png" as const, // Corrigindo o tipo para uma das opções válidas
    };
    const notesMock = [
      new Notes(
        "noteId1",
        "studentId1",
        "Note 1",
        "createdAt1",
        "updatedAt1",
        "teacherId1"
      ),
      new Notes(
        "noteId2",
        "studentId1",
        "Note 2",
        "createdAt2",
        "updatedAt2",
        "teacherId1"
      ),
    ];
    const annotationsMock = [
      new Annotation(
        "annotationId1",
        "studentId1",
        "Annotation 1",
        "createdAt1",
        "updatedAt1",
        "teacherId1"
      ),
      new Annotation(
        "annotationId2",
        "studentId1",
        "Annotation 2",
        "createdAt2",
        "updatedAt2",
        "teacherId1"
      ),
    ];

    const student = new Student(
      "id",
      "name",
      "email",
      "phone",
      30,
      notesMock,
      annotationsMock,
      "teacherId",
      "teacherName",
      "createdAt",
      USER_ROLES.NORMAL,
      "updatedAt",
      photoMock
    );
    const expectedDBModel = {
      id: "id",
      name: "name",
      email: "email",
      phone: "phone",
      age: 30,
      notes: [
        { notesId: "noteId1", notesText: "Note 1" },
        { notesId: "noteId2", notesText: "Note 2" },
      ],
      annotations: [
        { annotationsId: "annotationId1", annotationsText: "Annotation 1" },
        { annotationsId: "annotationId2", annotationsText: "Annotation 2" },
      ],
      photo: {
        data: Buffer.from("mockImageData"),
        mimeType: "image/png",
      },
      teacher_id: "teacherId",
      created_at: "createdAt",
      role: USER_ROLES.NORMAL,
      updated_at: "updatedAt",
    };
    expect(student.toDBModel()).toEqual(expectedDBModel);
  });
});
