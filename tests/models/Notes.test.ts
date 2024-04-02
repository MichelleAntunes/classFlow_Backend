// import { Notes, NotesDB } from "../../src/models/Student";

// describe("Notes class", () => {
//   const notesData: NotesDB = {
//     id: "notes-id",
//     student_id: "student-id",
//     teacher_id: "teacher-id",
//     notes: "Test notes",
//     created_at: "2024-04-01T12:00:00Z",
//     updated_at: "2024-04-01T12:00:00Z",
//   };

//   const notes = new Notes(
//     notesData.id,
//     notesData.student_id,
//     notesData.notes,
//     notesData.created_at,
//     notesData.updated_at,
//     notesData.teacher_id
//   );

//   test("should get note id", () => {
//     expect(notes.getNoteId()).toBe("notes-id");
//   });

//   test("should set note id", () => {
//     notes.setNoteId("new-notes-id");
//     expect(notes.getNoteId()).toBe("new-notes-id");
//   });

//   test("should get student id", () => {
//     expect(notes.getStudentId()).toBe("student-id");
//   });

//   test("should set student id", () => {
//     notes.setStudentId("new-student-id");
//     expect(notes.getStudentId()).toBe("new-student-id");
//   });

//   test("should get notes text", () => {
//     expect(notes.getNotes()).toBe("Test notes");
//   });

//   test("should set notes text", () => {
//     notes.setNotesText("New test notes");
//     expect(notes.getNotes()).toBe("New test notes");
//   });

//   test("should get created at", () => {
//     expect(notes.getCreatedAt()).toBe("2024-04-01T12:00:00Z");
//   });

//   test("should set created at", () => {
//     notes.setCreatedAt("2024-04-02T12:00:00Z");
//     expect(notes.getCreatedAt()).toBe("2024-04-02T12:00:00Z");
//   });

//   test("should get updated at", () => {
//     expect(notes.getUpdatedAt()).toBe("2024-04-01T12:00:00Z");
//   });

//   test("should set updated at", () => {
//     notes.setUpdatedAt("2024-04-02T12:00:00Z");
//     expect(notes.getUpdatedAt()).toBe("2024-04-02T12:00:00Z");
//   });

//   test("should convert to DB model correctly", () => {
//     const dbModel: NotesDB = notes.toDBModel();
//     expect(dbModel.id).toBe("new-notes-id");
//     expect(dbModel.student_id).toBe("new-student-id");
//     expect(dbModel.notes).toBe("New test notes");
//     expect(dbModel.created_at).toBe("2024-04-02T12:00:00Z");
//     expect(dbModel.updated_at).toBe("2024-04-02T12:00:00Z");
//     expect(dbModel.teacher_id).toBe("teacher-id");
//   });
// });

import { Notes } from "../../src/models/Student";

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
  describe("Notes setters", () => {
    test("setNoteId should set the id property correctly", () => {
      const note = new Notes("", "", "", "", "", "");
      note.setNoteId("noteIdValue");
      expect(note.getNoteId()).toBe("noteIdValue");
    });

    test("setStudentId should set the studentId property correctly", () => {
      const note = new Notes("", "", "", "", "", "");
      note.setStudentId("studentIdValue");
      expect(note.getStudentId()).toBe("studentIdValue");
    });

    test("setCreatedAt should set the createdAt property correctly", () => {
      const note = new Notes("", "", "", "", "", "");
      note.setCreatedAt("createdAtValue");
      expect(note.getCreatedAt()).toBe("createdAtValue");
    });

    test("setUpdatedAt should set the updatedAt property correctly", () => {
      const note = new Notes("", "", "", "", "", "");
      note.setUpdatedAt("updatedAtValue");
      expect(note.getUpdatedAt()).toBe("updatedAtValue");
    });

    test("setTeacherId should set the teacherId property correctly", () => {
      const note = new Notes("", "", "", "", "", "");
      note.setTeacherId("teacherIdValue");
      expect(note.getTeacherId()).toBe("teacherIdValue");
    });
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
