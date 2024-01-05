import { TStudents } from "../models/Student";
import { BaseDatabase } from "./BaseDatabase";

export class StudentDatabase extends BaseDatabase {
  public static TABLE_STUDENT = "students";

  public async findStudent(q: string | undefined) {
    let studentsDB;
    if (q) {
      const result: TStudents[] = await BaseDatabase.connection(
        StudentDatabase.TABLE_STUDENT
      ).where("name", "LIKE", `%${q}%`);

      studentsDB = result;
    } else {
      const result: TStudents[] = await BaseDatabase.connection(
        StudentDatabase.TABLE_STUDENT
      );

      studentsDB = result;
    }

    return studentsDB;
  }
  public async findStudentByID(id: string): Promise<TStudents | null> {
    const [studentDB] = await BaseDatabase.connection(
      StudentDatabase.TABLE_STUDENT
    ).where({ id });

    return studentDB || null;
  }
  public async editStudentByID(
    id: string,
    updatedStudentData: Record<string, any>
  ): Promise<void> {
    await BaseDatabase.connection(StudentDatabase.TABLE_STUDENT)
      .where("id", id)
      .update(updatedStudentData);
  }
  public async deleteStudentByID(idToDelete: string): Promise<void> {
    await BaseDatabase.connection(StudentDatabase.TABLE_STUDENT)
      .del()
      .where({ id: idToDelete });
  }
  public async insertStudent(newStudent: TStudents): Promise<void> {
    const {
      id,
      name,
      email,
      phone,
      age,
      notes,
      annotations,
      photo,
      teacher_id,
      class_id,
      password,
      email_verified,
      created_at,
      role,
    } = newStudent;

    // Logic to process the image if a photo file has been uploaded
    let photoData: Buffer | undefined;
    let mimeType: string | undefined;

    if (typeof photo === "object" && photo !== null && "data" in photo) {
      photoData = photo.data;
      mimeType = photo.mimeType;
    }

    const newStudentDB: TStudents = {
      id,
      name,
      email,
      phone,
      age,
      notes,
      annotations,
      photo: photoData
        ? {
            data: photoData,
            mimeType: mimeType as "image/png" | "image/jpeg",
          }
        : null,
      teacher_id,
      class_id,
      password,
      email_verified,
      created_at,
      role,
    };

    await BaseDatabase.connection(StudentDatabase.TABLE_STUDENT).insert(
      newStudentDB
    );
  }
}
