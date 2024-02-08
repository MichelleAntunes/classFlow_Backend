import { TeacherDB } from "../models/Teacher";
import { BaseDatabase } from "./BaseDatabase";

export class TeacherDataBase extends BaseDatabase {
  public static TABLE_TEACHERS = "teachers";
  // outras tabelas aqui

  public insertTeacher = async (teacherDB: TeacherDB): Promise<void> => {
    await BaseDatabase.connection(TeacherDataBase.TABLE_TEACHERS).insert(
      teacherDB
    );
  };

  public findeTeacherByEmail = async (
    email: string
  ): Promise<TeacherDB | undefined> => {
    const [userDB]: Array<TeacherDB | undefined> =
      await BaseDatabase.connection(TeacherDataBase.TABLE_TEACHERS)
        .select()
        .where({ email });

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
}
