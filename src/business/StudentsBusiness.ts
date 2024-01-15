import { StudentDatabase } from "../database/StudentDatabase";
import { Student, StudentModel } from "../models/Student";
import { TImageData, TNote, TAnnotation, StudentDB } from "../models/Student";
import validUrl from "valid-url";
import { Buffer } from "buffer";
import { Request } from "express";
import { HashManager } from "../services/HashManager";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";
import {
  CreateStudentInputDTO,
  CreateStudentOutputDTO,
} from "../dtos/student/createStudent.dto";
import {
  GetStudentInputDTO,
  GetStudentOutputDTO,
} from "../dtos/student/getStudents.dto";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import {
  EditStudentInputDTO,
  EditStudentOutputDTO,
} from "../dtos/student/editStudent.dto";
import { NotFoundError } from "../errors/NotFoundError";
import { ForbiddenError } from "../errors/ForbiddenError";

export class StudentBusiness {
  constructor(
    private studentDatabase: StudentDatabase,
    private idGenerator: IdGenerator,
    private tokenManager: TokenManager,
    private hashManager: HashManager
  ) {}
  public getStudents = async (
    input: GetStudentInputDTO
  ): Promise<GetStudentOutputDTO> => {
    const { q } = input;

    const studentsDB = await this.studentDatabase.findStudent(q);

    const students = studentsDB.map((studentDB) => {
      const student = new Student(
        studentDB.id,
        studentDB.name,
        studentDB.email,
        studentDB.phone,
        studentDB.age,
        studentDB.notes || [],
        studentDB.annotations || [],
        studentDB.photo as string | TImageData | null,
        studentDB.teacher_id,
        studentDB.teacher_name,
        studentDB.class_Id,
        studentDB.className,
        studentDB.password,
        studentDB.emailVerified,
        studentDB.createdAt,
        studentDB.role,
        studentDB.emailSent,
        studentDB.updateAt
      );
      return student.toBusinessModel();
    });
    const output: GetStudentOutputDTO = students;

    return output;
  };

  public createStudent = async (
    input: CreateStudentInputDTO,
    req: Request
  ): Promise<CreateStudentOutputDTO> => {
    const {
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
      token,
    } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError();
    }

    const id = this.idGenerator.generate();

    if (class_id !== undefined) {
      if (typeof class_id !== "string" || class_id.length < 1) {
        throw new Error(
          "'class_id' deve ser uma string e ser maior que um caractere"
        );
      }
    }
    if (teacher_id !== undefined) {
      if (typeof teacher_id !== "string" || teacher_id.length < 1) {
        throw new Error(
          "'teacher_id' deve ser uma string e ser maior que um caractere"
        );
      }
    }
    if (photo) {
      const photoUrl = photo as string;
      if (!validUrl.isUri(photoUrl)) {
        throw new Error("A URL da foto não é válida");
      }
    }

    if (id !== undefined) {
      if (typeof id !== "string" || id.length < 1) {
        throw new Error(
          "'id' deve ser uma string e ser maior que um caractere"
        );
      }
    }
    if (name !== undefined) {
      if (typeof name !== "string") {
        throw new Error("'name' deve ser string");
      }

      if (name.length < 2) {
        throw new Error("'name' deve possuir pelo menos 2 caracteres");
      }
    }

    if (age !== undefined) {
      if (typeof age !== "number") {
        throw new Error("'age' deve ser uma number");
      }
    }

    if (email !== undefined) {
      if (typeof email !== "string") {
        throw new Error("'email' deve ser uma string");
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error("'newEmail' deve ser um email válido");
      }
    }

    if (phone !== undefined) {
      if (typeof phone !== "number") {
        throw new Error("'phone' deve ser uma number");
      }
      const newTelephoneString: string = phone.toString();
      const phoneRegex = /^(?:\+\d{1,4}\s?)?\d{6,14}$/;
      // May or may not have a country prefix (country code) starting with + and followed by up to 4 digits.
      // May or may not have a blank space after the country code.
      // The phone number must have between 6 and 14 digits.

      if (!phoneRegex.test(newTelephoneString)) {
        throw new Error("'newTelephone' deve ser um número de telefone válido");
      }
    }
    if (notes !== undefined) {
      if (typeof notes !== "string") {
        throw new Error("'notes' deve ser uma string");
      }
    }
    if (annotations !== undefined) {
      if (typeof annotations !== "string") {
        throw new Error("'annotations' deve ser uma string");
      }
    }
    if (teacher_id !== undefined) {
      if (typeof teacher_id !== "string" || teacher_id.length < 1) {
        throw new Error(
          "'teacher_id' deve ser uma string e ser maior que um caractere"
        );
      }
    }
    if (class_id !== undefined) {
      if (typeof class_id !== "string" || class_id.length < 1) {
        throw new Error(
          "'class_id' deve ser uma string e ser maior que um caractere"
        );
      }
    }

    // Logic to process the image if a photo file has been uploaded
    let photoData: Buffer | undefined;
    let mimeType: string | undefined;

    if (req.file) {
      photoData = req.file.buffer;
      mimeType = req.file.mimetype;
    }
    const studentDatabase = new StudentDatabase();
    const studentDBExists = await studentDatabase.findStudentByID(id);

    if (studentDBExists) {
      throw new Error("'id' já existe");
    }
    const newStudent = new Student(
      id,
      name,
      email,
      phone,
      age,
      notes,
      annotations,
      photoData
        ? {
            data: Buffer.from(photoData),
            mimeType: mimeType as "image/png" | "image/jpeg",
          }
        : null,
      teacher_id,
      class_id,
      password,
      email_verified,
      created_at,
      role
    );
    const newStudentDB: TStudents = {
      id: newStudent.getId(),
      name: newStudent.getName(),
      email: newStudent.getEmail(),
      phone: newStudent.getPhone(),
      age: newStudent.getAge(),
      notes: newStudent.getNotes(),
      annotations: newStudent.getAnnotations(),
      photo: newStudent.getPhoto(),
      teacher_id: newStudent.getTeacher_id(),
      class_id: newStudent.getClass_id(),
      password: newStudent.getPassword(),
      email_verified: newStudent.getEmailVerified(),
      created_at: newStudent.getCreatedAt(),
      role: newStudent.getRole(),
    };

    await studentDatabase.insertStudent(newStudentDB);

    const output: CreateStudentOutputDTO = {
      message: "Cadastro realizado com sucesso",
      student: {
        token: newStudent.getId(),
        name: newStudent.getName(),
        created_at: newStudent.getCreatedAt(),
      },
    };
    return output;
  };
  public editStudent = async (
    input: EditStudentInputDTO
  ): Promise<EditStudentOutputDTO> => {
    const { token, idToEdit } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError();
    }
    const studentDB = await this.studentDatabase.findStudentByID(idToEdit);

    if (!studentDB) {
      throw new NotFoundError("Estudante com essa ID não encontrado");
    }
    if (payload.id !== studentDB.teacher_id) {
      throw new ForbiddenError("Apenas quem criou o estudante pode editá-lo");
    }

    const newName = input.name || studentDB.name;
    const newEmail = input.email || studentDB.email;
    const newPhone = input.phone || studentDB.phone;
    const newAge = input.age || studentDB.age;
    const newPhoto = input.photo || studentDB.photo;
    const newTeacherId = input.teacher_id || studentDB.teacher_id;
    const newClassId = input.class_id || studentDB.class_id;
    const newNote = input.notes || studentDB.notes;
    const newAnnotation = input.annotations || studentDB.annotations;

    const updatedStudentData: TStudentsModel = {
      id: idToEdit,
      name: newName,
      email: newEmail,
      phone: newPhone,
      age: newAge,
      notes: newNote || studentDB.notes,
      annotations: newAnnotation || studentDB.annotations,
      photo: newPhoto,
      teacher_id: newTeacherId,
      class_id: newClassId,
      email_verified: studentDB.email_verified,
      created_at: studentDB.created_at,
      role: studentDB.role,
    };

    await this.studentDatabase.editStudentByID(idToEdit, updatedStudentData);
    const updatedStudentInstance = await this.studentDatabase.findStudentByID(
      idToEdit
    );

    if (!updatedStudentInstance) {
      throw new NotFoundError(
        "Estudante com essa ID não encontrado após edição"
      );
    }
    const output: EditStudentOutputDTO = {
      message: "Edição realizada com sucesso",
      student: {
        token: updatedStudentInstance.getId(),
        name: updatedStudentInstance.getName(),
        created_at: updatedStudentInstance.getCreate_dAt(),
      },
    };

    return output;
  };
}
