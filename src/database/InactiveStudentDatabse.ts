import { BaseDatabase } from "./BaseDatabase";
import { TeacherDataBase } from "./TeacherDatabase";
import {
  AnnotationDB,
  Notes,
  NotesDB,
  StudentDB,
  StudentsWithCreatorName,
} from "../models/Student";
import {
  InactiveStudentDB,
  InactiveStudentsWithCreatorName,
} from "../models/InactiveStudent";

export class InactiveStudentDatabase extends BaseDatabase {
  public static TABLE_TEACHER = "teachers";
  public static TABLE_NOTES = "notes";
  public static TABLE_ANNOTATIONS = "annotations";
  public static TABLE_INACTIVE_STUDENT = "inactive_students";

  public getInactiveStudentsWithCreatorName = async (): Promise<
    InactiveStudentsWithCreatorName[]
  > => {
    const result = await BaseDatabase.connection(
      InactiveStudentDatabase.TABLE_INACTIVE_STUDENT
    )
      .select(
        `${InactiveStudentDatabase.TABLE_INACTIVE_STUDENT}.id`,
        `${InactiveStudentDatabase.TABLE_INACTIVE_STUDENT}.name`,
        `${InactiveStudentDatabase.TABLE_INACTIVE_STUDENT}.email`,
        `${InactiveStudentDatabase.TABLE_INACTIVE_STUDENT}.phone`,
        `${InactiveStudentDatabase.TABLE_INACTIVE_STUDENT}.age`,
        `${InactiveStudentDatabase.TABLE_INACTIVE_STUDENT}.teacher_id`,
        `${InactiveStudentDatabase.TABLE_INACTIVE_STUDENT}.created_at`,
        `${InactiveStudentDatabase.TABLE_INACTIVE_STUDENT}.role`,
        `${InactiveStudentDatabase.TABLE_INACTIVE_STUDENT}.updated_at`,
        `${InactiveStudentDatabase.TABLE_INACTIVE_STUDENT}.photo`,
        `${TeacherDataBase.TABLE_TEACHERS}.name as creator_name`,
        BaseDatabase.connection.raw(
          `(SELECT JSON_GROUP_ARRAY(JSON_OBJECT('notesId', id, 'notesText', notes)) FROM ${InactiveStudentDatabase.TABLE_NOTES} WHERE student_id = ${InactiveStudentDatabase.TABLE_INACTIVE_STUDENT}.id) as notes`
        ),
        BaseDatabase.connection.raw(
          `(SELECT JSON_GROUP_ARRAY(JSON_OBJECT('annotationsId', id, 'annotationsText', annotations)) FROM ${InactiveStudentDatabase.TABLE_ANNOTATIONS} WHERE student_id = ${InactiveStudentDatabase.TABLE_INACTIVE_STUDENT}.id) as annotations`
        )
      )
      .join(
        `${TeacherDataBase.TABLE_TEACHERS}`,
        `${InactiveStudentDatabase.TABLE_INACTIVE_STUDENT}.teacher_id`,
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

  public async insertInactiveStudent(
    student: InactiveStudentDB
  ): Promise<void> {
    await BaseDatabase.connection(
      InactiveStudentDatabase.TABLE_INACTIVE_STUDENT
    ).insert(student);
  }
  public async findInactiveStudentById(
    id: string
  ): Promise<InactiveStudentDB | undefined> {
    const [inactiveStudentDB]: InactiveStudentDB[] | undefined =
      await BaseDatabase.connection(
        InactiveStudentDatabase.TABLE_INACTIVE_STUDENT
      )
        .select()
        .where({ id });

    return inactiveStudentDB;
  }
  public deleteInactiveStudentById = async (id: string): Promise<void> => {
    await BaseDatabase.connection(
      InactiveStudentDatabase.TABLE_INACTIVE_STUDENT
    )
      .delete()
      .where({ id });
  };
}
