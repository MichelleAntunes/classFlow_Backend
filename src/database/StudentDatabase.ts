import { CreateStudentOutputDTO } from "../dtos/student/createStudent.dto";
import { StudentDB, StudentsWithCreatorName, TNote } from "../models/Student";
import { BaseDatabase } from "./BaseDatabase";
import { TeacherDataBase } from "./TeacherDatabase";

export class StudentDatabase extends BaseDatabase {
  public static TABLE_STUDENT = "students";
  public static TABLE_TEACHER = "teachers";
  //   public async findStudent(q: string | undefined) {
  //     let studentsDB;
  //     if (q) {
  //       const result: StudentDB[] = await BaseDatabase.connection(
  //         StudentDatabase.TABLE_STUDENT
  //       ).where("name", "LIKE", `%${q}%`);

  //       studentsDB = result;
  //     } else {
  //       const result: StudentDB[] = await BaseDatabase.connection(
  //         StudentDatabase.TABLE_STUDENT
  //       );

  //       studentsDB = result;
  //     }

  //     return studentsDB;
  //   }
  //   public async findStudentByID(id: string): Promise<StudentDB | null> {
  //     const [studentDB]: StudentDB[] = await BaseDatabase.connection(
  //       StudentDatabase.TABLE_STUDENT
  //     ).where({ id });

  //     return studentDB;
  //   }
  //   public async findStudentByEmail(
  //     email: string
  //   ): Promise<StudentDB | undefined> {
  //     const [studentDB]: StudentDB[] | undefined[] =
  //       await BaseDatabase.connection(StudentDatabase.TABLE_STUDENT).where({
  //         email,
  //       });

  //     return studentDB;
  //   }
  //   public async editStudentByID(
  //     id: string,
  //     updatedStudentData: Record<string, any>
  //   ): Promise<void> {
  //     await BaseDatabase.connection(StudentDatabase.TABLE_STUDENT)
  //       .where("id", id)
  //       .update(updatedStudentData);
  //   }
  //   public async deleteStudentByID(idToDelete: string): Promise<void> {
  //     await BaseDatabase.connection(StudentDatabase.TABLE_STUDENT)
  //       .del()
  //       .where({ id: idToDelete });
  //   }
  public insertStudent = async (studentDB: StudentDB): Promise<void> => {
    await BaseDatabase.connection(StudentDatabase.TABLE_STUDENT).insert(
      studentDB
    );
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
        `${StudentDatabase.TABLE_STUDENT}.notes`,
        `${StudentDatabase.TABLE_STUDENT}.annotations`,
        `${StudentDatabase.TABLE_STUDENT}.photo`,
        `${StudentDatabase.TABLE_STUDENT}.teacher_id`,
        `${TeacherDataBase.TABLE_TEACHERS}.name as creator_name`,
        `${StudentDatabase.TABLE_STUDENT}.created_at`,
        `${StudentDatabase.TABLE_STUDENT}.role`,
        `${StudentDatabase.TABLE_STUDENT}.updated_at`
      )
      .join(
        `${TeacherDataBase.TABLE_TEACHERS}`,
        `${StudentDatabase.TABLE_STUDENT}.teacher_id`,
        `=`,
        `${TeacherDataBase.TABLE_TEACHERS}.id`
      );

    return result as StudentsWithCreatorName[];
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

  public addNewNote = async (studentDB: StudentDB): Promise<void> => {
    await BaseDatabase.connection(StudentDatabase.TABLE_STUDENT)
      .update({ notes: studentDB.notes })
      .where({ id: studentDB.id });
  };
}
