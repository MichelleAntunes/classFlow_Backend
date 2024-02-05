import { BaseDatabase } from "./BaseDatabase";
import { TeacherDataBase } from "./TeacherDatabase";
import {
  AnnotationDB,
  Notes,
  NotesDB,
  StudentDB,
  StudentsWithCreatorName,
} from "../models/Student";

export class StudentDatabase extends BaseDatabase {
  public static TABLE_STUDENT = "students";
  public static TABLE_TEACHER = "teachers";
  public static TABLE_NOTES = "notes";
  public static TABLE_ANNOTATIONS = "annotations";

  //Students
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
        BaseDatabase.connection.raw(
          `(SELECT JSON_GROUP_ARRAY(JSON_OBJECT('notesId', id, 'notesText', notes)) FROM ${StudentDatabase.TABLE_NOTES} WHERE student_id = ${StudentDatabase.TABLE_STUDENT}.id) as notes`
        ),
        BaseDatabase.connection.raw(
          `(SELECT JSON_GROUP_ARRAY(JSON_OBJECT('annotationsId', id, 'annotationsText', annotations)) FROM ${StudentDatabase.TABLE_ANNOTATIONS} WHERE student_id = ${StudentDatabase.TABLE_STUDENT}.id) as annotations`
        )
      )
      .join(
        `${TeacherDataBase.TABLE_TEACHERS}`,
        `${StudentDatabase.TABLE_STUDENT}.teacher_id`,
        "=",
        `${TeacherDataBase.TABLE_TEACHERS}.id`
      );

    const groupedResult = result.map((row: any) => {
      return {
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
        notes: JSON.parse(row.notes),
        annotations: JSON.parse(row.annotations),
      };
    });

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
  //Notes
  public insertNotesByStudentId = async (newNoteDB: NotesDB): Promise<void> => {
    await BaseDatabase.connection(StudentDatabase.TABLE_NOTES).insert({
      id: newNoteDB.id,
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
    if (!noteDB.id) {
      throw new Error(
        "A propriedade 'note_id' é necessária para atualizar a nota."
      );
    }

    await BaseDatabase.connection(StudentDatabase.TABLE_NOTES)
      .update(noteDB)
      .where({ id: noteDB.id });
  };
  //Annotations
  public insertAnnotationsByStudentId = async (
    newAnnotationDB: AnnotationDB
  ): Promise<void> => {
    await BaseDatabase.connection(StudentDatabase.TABLE_ANNOTATIONS).insert({
      id: newAnnotationDB.id,
      student_id: newAnnotationDB.student_id,
      teacher_id: newAnnotationDB.teacher_id,
      annotations: newAnnotationDB.annotations,
      created_at: newAnnotationDB.created_at,
      updated_at: newAnnotationDB.updated_at,
    });
  };
  public deleteAnnotationsByAnnotationId = async (
    id: string
  ): Promise<void> => {
    await BaseDatabase.connection(StudentDatabase.TABLE_ANNOTATIONS)
      .delete()
      .where({ id });
  };
  public findAnnotationById = async (
    id: string
  ): Promise<AnnotationDB | undefined> => {
    const [annotationDB]: AnnotationDB[] | undefined =
      await BaseDatabase.connection(StudentDatabase.TABLE_ANNOTATIONS)
        .select()
        .where({ id });

    return annotationDB;
  };
  public updateAnnotation = async (annotationDB: AnnotationDB) => {
    if (!annotationDB.id) {
      throw new Error(
        "A propriedade 'note_id' é necessária para atualizar a nota."
      );
    }

    await BaseDatabase.connection(StudentDatabase.TABLE_ANNOTATIONS)
      .update(annotationDB)
      .where({ id: annotationDB.id });
  };
}
