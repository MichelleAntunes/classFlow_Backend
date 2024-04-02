// import { Annotation, AnnotationDB } from "../../src/models/Student";

// describe("Annotation class", () => {
//   const annotationData: AnnotationDB = {
//     id: "annotation-id",
//     student_id: "student-id",
//     teacher_id: "teacher-id",
//     annotations: "Test annotation",
//     created_at: "2024-04-01T12:00:00Z",
//     updated_at: "2024-04-01T12:00:00Z",
//   };

//   const annotation = new Annotation(
//     annotationData.id,
//     annotationData.student_id,
//     annotationData.annotations,
//     annotationData.created_at,
//     annotationData.updated_at,
//     annotationData.teacher_id
//   );

//   test("should get annotation id", () => {
//     expect(annotation.getAnnotationId()).toBe("annotation-id");
//   });

//   test("should set annotation id", () => {
//     annotation.setAnnotationId("new-annotation-id");
//     expect(annotation.getAnnotationId()).toBe("new-annotation-id");
//   });

//   test("should get student id", () => {
//     expect(annotation.getStudentId()).toBe("student-id");
//   });

//   test("should set student id", () => {
//     annotation.setStudentId("new-student-id");
//     expect(annotation.getStudentId()).toBe("new-student-id");
//   });

//   test("should get annotation text", () => {
//     expect(annotation.getAnnotation()).toBe("Test annotation");
//   });

//   test("should set annotation text", () => {
//     annotation.setAnnotationText("New test annotation");
//     expect(annotation.getAnnotation()).toBe("New test annotation");
//   });

//   test("should get created at", () => {
//     expect(annotation.getCreatedAt()).toBe("2024-04-01T12:00:00Z");
//   });

//   test("should set created at", () => {
//     annotation.setCreatedAt("2024-04-02T12:00:00Z");
//     expect(annotation.getCreatedAt()).toBe("2024-04-02T12:00:00Z");
//   });

//   test("should get updated at", () => {
//     expect(annotation.getUpdatedAt()).toBe("2024-04-01T12:00:00Z");
//   });

//   test("should set updated at", () => {
//     annotation.setUpdatedAt("2024-04-02T12:00:00Z");
//     expect(annotation.getUpdatedAt()).toBe("2024-04-02T12:00:00Z");
//   });

//   test("should convert to DB model correctly", () => {
//     const dbModel: AnnotationDB = annotation.toDBModel();
//     expect(dbModel.id).toBe("new-annotation-id");
//     expect(dbModel.student_id).toBe("new-student-id");
//     expect(dbModel.annotations).toBe("New test annotation");
//     expect(dbModel.created_at).toBe("2024-04-02T12:00:00Z");
//     expect(dbModel.updated_at).toBe("2024-04-02T12:00:00Z");
//     expect(dbModel.teacher_id).toBe("teacher-id");
//   });
// });

import { Annotation } from "../../src/models/Student";

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
  test("should set annotation id correctly", () => {
    annotation.setAnnotationId("new-id-annotation");
    expect(annotation.getAnnotationId()).toBe("new-id-annotation");
  });
  describe("Annotation setters", () => {
    test("setStudentId should set the studentId property correctly", () => {
      const annotation = new Annotation("1", "", "", "", "", "");
      annotation.setStudentId("studentIdValue");
      expect(annotation.getStudentId()).toBe("studentIdValue");
    });

    test("setCreatedAt should set the createdAt property correctly", () => {
      const annotation = new Annotation("1", "", "", "", "", "");
      annotation.setCreatedAt("createdAtValue");
      expect(annotation.getCreatedAt()).toBe("createdAtValue");
    });

    test("setUpdatedAt should set the updatedAt property correctly", () => {
      const annotation = new Annotation("1", "", "", "", "", "");
      annotation.setUpdatedAt("updatedAtValue");
      expect(annotation.getUpdatedAt()).toBe("updatedAtValue");
    });

    test("setTeacherId should set the teacherId property correctly", () => {
      const annotation = new Annotation("1", "", "", "", "", "");
      annotation.setTeacherId("teacherIdValue");
      expect(annotation.getTeacherId()).toBe("teacherIdValue");
    });
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
