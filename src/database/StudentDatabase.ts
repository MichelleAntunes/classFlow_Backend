import { BaseDatabase } from "./BaseDatabase";
import { TeacherDataBase } from "./TeacherDatabase";
import {
  Notes,
  NotesDB,
  StudentDB,
  StudentsWithCreatorName,
} from "../models/Student";

export class StudentDatabase extends BaseDatabase {
  public static TABLE_STUDENT = "students";
  public static TABLE_TEACHER = "teachers";
  public static TABLE_NOTES = "notes";

  public insertStudent = async (studentDB: StudentDB): Promise<void> => {
    await BaseDatabase.connection(StudentDatabase.TABLE_STUDENT).insert({
      id: studentDB.id,
      name: studentDB.name,
      email: studentDB.email,
      phone: studentDB.phone,
      age: studentDB.age,
      photo: studentDB.photo,
      teacher_id: studentDB.teacher_id,
      created_at: studentDB.created_at,
      role: studentDB.role,
      updated_at: studentDB.updated_at,
    });
  };

  public getStudentsWithCreatorName = async (): Promise<
    StudentsWithCreatorName[]
  > => {
    const result = await BaseDatabase.connection(StudentDatabase.TABLE_STUDENT)
      .select(
        `${StudentDatabase.TABLE_STUDENT}.id`,
        `${StudentDatabase.TABLE_STUDENT}.name`,
        `${StudentDatabase.TABLE_STUDENT}.email`,
        `${StudentDatabase.TABLE_STUDENT}.phone`,
        `${StudentDatabase.TABLE_STUDENT}.age`,
        `${StudentDatabase.TABLE_STUDENT}.teacher_id`,
        `${StudentDatabase.TABLE_STUDENT}.created_at`,
        `${StudentDatabase.TABLE_STUDENT}.role`,
        `${StudentDatabase.TABLE_STUDENT}.updated_at`,
        `${StudentDatabase.TABLE_STUDENT}.photo`,
        `${TeacherDataBase.TABLE_TEACHERS}.name as creator_name`,
        `${StudentDatabase.TABLE_NOTES}.id as notesId`,
        `${StudentDatabase.TABLE_NOTES}.notes as notesText`
      )
      .join(
        `${TeacherDataBase.TABLE_TEACHERS}`,
        `${StudentDatabase.TABLE_STUDENT}.teacher_id`,
        "=",
        `${TeacherDataBase.TABLE_TEACHERS}.id`
      )
      .leftJoin(
        `${StudentDatabase.TABLE_NOTES}`,
        `${StudentDatabase.TABLE_STUDENT}.id`,
        "=",
        `${StudentDatabase.TABLE_NOTES}.student_id`
      );

    const groupedResult = result.reduce(
      (acc: StudentsWithCreatorName[], row) => {
        const existingStudent = acc.find((student) => student.id === row.id);

        if (existingStudent) {
          if (row.notesId) {
            existingStudent.notes.push({
              notesId: row.notesId,
              notesText: row.notesText,
            });
          }
        } else {
          acc.push({
            id: row.id,
            name: row.name,
            email: row.email,
            phone: row.phone,
            age: row.age,
            teacher_id: row.teacher_id,
            creator_name: row.creator_name,
            created_at: row.created_at,
            role: row.role,
            updated_at: row.updated_at,
            photo: row.photo,
            notes: row.notesId
              ? [{ notesId: row.notesId, notesText: row.notesText }]
              : [],
          });
        }

        return acc;
      },
      []
    );

    return groupedResult;
  };

  public async findStudentById(id: string): Promise<StudentDB | undefined> {
    const [studentDB]: StudentDB[] | undefined = await BaseDatabase.connection(
      StudentDatabase.TABLE_STUDENT
    )
      .select()
      .where({ id });

    return studentDB;
  }

  public updateStudent = async (studentDB: StudentDB): Promise<void> => {
    await BaseDatabase.connection(StudentDatabase.TABLE_STUDENT)
      .update(studentDB)
      .where({ id: studentDB.id });
  };

  public deleteStudentById = async (id: string): Promise<void> => {
    await BaseDatabase.connection(StudentDatabase.TABLE_STUDENT)
      .delete()
      .where({ id });
  };

  public insertNotesByStudentId = async (newNoteDB: NotesDB): Promise<void> => {
    await BaseDatabase.connection(StudentDatabase.TABLE_NOTES).insert({
      id: newNoteDB.note_id,
      student_id: newNoteDB.student_id,
      teacher_id: newNoteDB.teacher_id,
      notes: newNoteDB.notes,
      created_at: newNoteDB.created_at,
      updated_at: newNoteDB.updated_at,
    });
  };

  public deleteNotesByNoteId = async (id: string): Promise<void> => {
    await BaseDatabase.connection(StudentDatabase.TABLE_NOTES)
      .delete()
      .where({ id });
  };

  public findNoteById = async (id: string): Promise<NotesDB | undefined> => {
    const [noteDB]: NotesDB[] | undefined = await BaseDatabase.connection(
      StudentDatabase.TABLE_NOTES
    )
      .select()
      .where({ id });

    return noteDB;
  };

  public updateNote = async (noteDB: NotesDB) => {
    await BaseDatabase.connection(StudentDatabase.TABLE_NOTES)
      .update(noteDB)
      .where({ id: noteDB.note_id });
  };
}
