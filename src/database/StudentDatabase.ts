import { TStudents } from "../types";
import { BaseDatabase } from "./BaseDatabase";

export class StudentDB extends BaseDatabase {
  public static TABLE_STUDENT = "students";

  public async findStudent(q: string | undefined) {
    let studentsDB;
    if (q) {
      const result: TStudents[] = await BaseDatabase.connection(
        StudentDB.TABLE_STUDENT
      ).where("name", "LIKE", `%${q}%`);

      studentsDB = result;
    } else {
      const result: TStudents[] = await BaseDatabase.connection(
        StudentDB.TABLE_STUDENT
      );

      studentsDB = result;
    }

    return studentsDB;
  }
  public async findStudentByID(id: string): Promise<TStudents | null> {
    const [studentDB] = await BaseDatabase.connection(
      StudentDB.TABLE_STUDENT
    ).where({ id });

    return studentDB || null;
  }

  public async editStudentByID(
    id: string,
    updatedStudentData: Record<string, any>
  ): Promise<void> {
    await BaseDatabase.connection(StudentDB.TABLE_STUDENT)
      .where("id", id)
      .update(updatedStudentData);
  }
  public async deleteStudentByID(idToDelete: string): Promise<void> {
    await BaseDatabase.connection(StudentDB.TABLE_STUDENT)
      .del()
      .where({ id: idToDelete });
  }
  public async insertStudent(newStudent: TStudents): Promise<void> {
    const {
      id,
      name,
      age,
      email,
      phone,
      notes,
      annotations,
      teacher_id,
      class_id,
      photo,
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
      age,
      email,
      phone,
      notes,
      annotations,
      teacher_id,
      class_id,
      photo: photoData
        ? {
            data: photoData,
            mimeType: mimeType as "image/png" | "image/jpeg",
          }
        : null,
    };

    await BaseDatabase.connection(StudentDB.TABLE_STUDENT).insert(newStudentDB);
  }
}
