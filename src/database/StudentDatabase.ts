import { CreateStudentOutputDTO } from "../dtos/student/createStudent.dto";
import { StudentDB } from "../models/Student";
import { BaseDatabase } from "./BaseDatabase";

export class StudentDatabase extends BaseDatabase {
  public static TABLE_STUDENT = "students";

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
  public async insertStudent(studentDB: StudentDB): Promise<void> {
    await BaseDatabase.connection(StudentDatabase.TABLE_STUDENT).insert(
      studentDB
    );
  }
}
