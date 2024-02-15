import {
  AnnotationDB,
  NotesDB,
  StudentDB,
  StudentsWithCreatorName,
  USER_ROLES,
} from "../../src/models/Student";
import { BaseDatabase } from "../../src/database/BaseDatabase";
import { TeacherDatabaseMock } from "./TeacherDatabaseMock";

const studentMock: StudentDB[] = [
  {
    id: "id-student-mock1",
    name: "Student Sal",
    email: "sal.student@mock.com",
    phone: "01478525",
    age: 30,
    notes: [
      {
        notesId: "id-notesSal-mock",
        notesText: "90",
      },
    ],
    annotations: [
      {
        annotationsId: "id-annotationSal-mock",
        annotationsText: "First Annotation Sal",
      },
      {
        annotationsId: "id-annotationSal-mock2",
        annotationsText: "Second Annotation Sal",
      },
    ],
    photo: null,
    teacher_id: "id-mock1",
    created_at: new Date().toISOString().slice(0, -5), // Remove the last 5 characters (the milliseconds)

    role: USER_ROLES.NORMAL,
    updated_at: new Date().toISOString().slice(0, -5), // Remove the last 5 characters (the milliseconds)
  },
  {
    id: "id-student-mock2",
    name: "Student Mar",
    email: "mar.student@mock.com",
    phone: "45693012",
    age: 15,
    notes: [
      {
        notesId: "id-notesMar-mock",
        notesText: "60",
      },
    ],
    annotations: [
      {
        annotationsId: "id-annotationMar-mock",
        annotationsText: "First Annotation Mar",
      },
      {
        annotationsId: "id-annotationMar-mock2",
        annotationsText: "Second Annotation Mar",
      },
    ],
    photo: null,
    teacher_id: "id-mock1",
    created_at: new Date().toISOString().slice(0, -5), // Remove the last 5 characters (the milliseconds)

    role: USER_ROLES.NORMAL,
    updated_at: new Date().toISOString().slice(0, -5), // Remove the last 5 characters (the milliseconds)
  },
];

export class StudentDatabaseMock extends BaseDatabase {
  public static TABLE_STUDENT = "students";
  public static TABLE_TEACHER = "teachers";
  public static TABLE_NOTES = "notes";
  public static TABLE_ANNOTATIONS = "annotations";
  public static TABLE_INACTIVE_STUDENT = "inactive_students";

  public insertStudent = async (studentDB: StudentDB): Promise<void> => {};

  //   public insertStudent = async (studentDB: StudentDB): Promise<void> => {
  //     studentMock.push(studentDB);
  //   };

  public findStudentById = async (
    id: string
  ): Promise<StudentDB | undefined> => {
    return studentMock.filter((student) => student.id === id)[0];
  };
  public async getStudentsWithCreatorName(): Promise<
    StudentsWithCreatorName[]
  > {
    const result: StudentsWithCreatorName[] = await Promise.all(
      studentMock.map(async (student) => {
        const teacherDatabaseMock = new TeacherDatabaseMock();
        const teacher = await teacherDatabaseMock.findTeacherByEmail(
          student.email
        );
        const creatorName = teacher ? teacher.name : "Teacher Mock";
        return {
          id: student.id,
          name: student.name,
          email: student.email,
          phone: student.phone,
          age: student.age,
          teacher_id: student.teacher_id,
          creator_name: creatorName,
          created_at: student.created_at,
          role: student.role,
          updated_at: student.updated_at,
          photo: student.photo,
          notes: student.notes,
          annotations: student.annotations,
        };
      })
    );
    return result;
  }
  public async updateStudent(studentDB: StudentDB): Promise<void> {
    const index = studentMock.findIndex(
      (student) => student.id === studentDB.id
    );
    if (index !== -1) {
      studentMock[index] = studentDB;
    } else {
      throw new Error("Student not found");
    }
  }
  public async deleteStudentById(id: string): Promise<void> {
    const index = studentMock.findIndex((student) => student.id === id);
    if (index !== -1) {
      studentMock.splice(index, 1);
    } else {
      throw new Error("Student not found");
    }
  }

  public async insertNotesByStudentId(newNoteDB: NotesDB): Promise<void> {
    const student = studentMock.find(
      (student) => student.id === newNoteDB.student_id
    );
    if (student) {
      student.notes.push({
        notesId: newNoteDB.id,
        notesText: newNoteDB.notes,
      });
    } else {
      throw new Error("Student not found");
    }
  }

  public async deleteNotesByNoteId(id: string): Promise<void> {
    studentMock.forEach((student) => {
      const index = student.notes.findIndex((note) => note.notesId === id);
      if (index !== -1) {
        student.notes.splice(index, 1);
      }
    });
  }

  public async findNoteById(id: string): Promise<NotesDB | undefined> {
    let foundNote: NotesDB | undefined;
    studentMock.forEach((student) => {
      const note = student.notes.find((note) => note.notesId === id);
      if (note) {
        foundNote = {
          id: note.notesId,
          student_id: student.id,
          teacher_id: student.teacher_id,
          notes: note.notesText,
          created_at: student.created_at,
          updated_at: student.updated_at,
        };
      }
    });
    return foundNote;
  }

  public async updateNote(noteDB: NotesDB): Promise<void> {
    studentMock.forEach((student) => {
      const note = student.notes.find((note) => note.notesId === noteDB.id);
      if (note) {
        note.notesText = noteDB.notes;
      }
    });
  }

  public async insertAnnotationsByStudentId(
    newAnnotationDB: AnnotationDB
  ): Promise<void> {
    const student = studentMock.find(
      (student) => student.id === newAnnotationDB.student_id
    );
    if (student) {
      student.annotations.push({
        annotationsId: newAnnotationDB.id,
        annotationsText: newAnnotationDB.annotations,
      });
    } else {
      throw new Error("Student not found");
    }
  }

  public async deleteAnnotationsByAnnotationId(id: string): Promise<void> {
    studentMock.forEach((student) => {
      const index = student.annotations.findIndex(
        (annotation) => annotation.annotationsId === id
      );
      if (index !== -1) {
        student.annotations.splice(index, 1);
      }
    });
  }

  public async findAnnotationById(
    id: string
  ): Promise<AnnotationDB | undefined> {
    let foundAnnotation: AnnotationDB | undefined;
    studentMock.forEach((student) => {
      const annotation = student.annotations.find(
        (annotation) => annotation.annotationsId === id
      );
      if (annotation) {
        foundAnnotation = {
          id: annotation.annotationsId,
          student_id: student.id,
          teacher_id: student.teacher_id,
          annotations: annotation.annotationsText,
          created_at: student.created_at,
          updated_at: student.updated_at,
        };
      }
    });
    return foundAnnotation;
  }

  public async updateAnnotation(annotationDB: AnnotationDB): Promise<void> {
    studentMock.forEach((student) => {
      const annotation = student.annotations.find(
        (annotation) => annotation.annotationsId === annotationDB.id
      );
      if (annotation) {
        annotation.annotationsText = annotationDB.annotations;
      }
    });
  }

  public async moveStudentToInactive(studentId: string): Promise<void> {
    const index = studentMock.findIndex((student) => student.id === studentId);
    if (index !== -1) {
      const deletedStudent = studentMock.splice(index, 1)[0];
      await BaseDatabase.connection(
        StudentDatabaseMock.TABLE_INACTIVE_STUDENT
      ).insert({
        id: deletedStudent.id,
        name: deletedStudent.name,
        email: deletedStudent.email,
        phone: deletedStudent.phone,
        age: deletedStudent.age,
        notes: deletedStudent.notes,
        annotations: deletedStudent.annotations,
        photo: deletedStudent.photo,
        teacher_id: deletedStudent.teacher_id,
        created_at: deletedStudent.created_at,
        role: deletedStudent.role,
        inactive_at: new Date().toISOString(),
      });
    } else {
      throw new Error("Student not found");
    }
  }
}
