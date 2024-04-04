import { Teacher, TeacherDB } from "../models/Teacher";
import { BaseDatabase } from "./BaseDatabase";

export class TeacherDataBase extends BaseDatabase {
  public static TABLE_TEACHERS = "teachers";

  public insertTeacher = async (teacherDB: TeacherDB): Promise<void> => {
    await BaseDatabase.connection(TeacherDataBase.TABLE_TEACHERS).insert(
      teacherDB
    );
  };

  public findTeacherByEmail = async (
    email: string
  ): Promise<TeacherDB | undefined> => {
    const [userDB]: Array<TeacherDB | undefined> =
      await BaseDatabase.connection(TeacherDataBase.TABLE_TEACHERS)
        .select()
        .where({ email });

    return userDB;
  };
  public findTeacherById = async (
    id: string
  ): Promise<TeacherDB | undefined> => {
    const [userDB]: Array<TeacherDB | undefined> =
      await BaseDatabase.connection(TeacherDataBase.TABLE_TEACHERS)
        .select()
        .where({ id });

    return userDB;
  };
  public updatePasswordByEmail = async (
    email: string,
    newPassword: string
  ): Promise<void> => {
    await BaseDatabase.connection(TeacherDataBase.TABLE_TEACHERS)
      .where({ email })
      .update({ password: newPassword });
  };
  public getAllTeachers = async (): Promise<TeacherDB[]> => {
    const teachers = await BaseDatabase.connection(
      TeacherDataBase.TABLE_TEACHERS
    ).select();
    return teachers;
  };
  public deleteTeacherById = async (id: string): Promise<void> => {
    await BaseDatabase.connection(TeacherDataBase.TABLE_TEACHERS)
      .delete()
      .where({ id });
  };
}
