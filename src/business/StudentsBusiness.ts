// import { StudentDatabase } from "../database/StudentDatabase";
import { Student, StudentModel } from "../models/Student";
import { ImageData, TNote, TAnnotation, StudentDB } from "../models/Student";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";
import {
  CreateStudentInputDTO,
  CreateStudentOutputDTO,
} from "../dtos/student/createStudent.dto";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { StudentDatabase } from "../database/StudentDatabase";
import {
  GetStudentInputDTO,
  GetStudentOutputDTO,
} from "../dtos/student/getStudents.dto";
import {
  EditStudentInputDTO,
  EditStudentOutputDTO,
} from "../dtos/student/editStudent.dto";
import { NotFoundError } from "../errors/NotFoundError";
import { ForbiddenError } from "../errors/ForbiddenError";
import {
  DeleteStudentInputDTO,
  DeleteStudentOutputDTO,
} from "../dtos/student/deleteStudent.dto";
import { USER_ROLES } from "../models/Teacher";
import { emit } from "process";
import {
  AddNewNoteInputDTO,
  AddNewNoteOutputDTO,
} from "../dtos/student/addNewNote.dto";

export class StudentBusiness {
  constructor(
    private studentDatabase: StudentDatabase,
    private idGenerator: IdGenerator,
    private tokenManager: TokenManager
  ) {}

  public createStudent = async (
    input: CreateStudentInputDTO
  ): Promise<CreateStudentOutputDTO> => {
    const { name, email, phone, age, photo, role, token } = input;
    console.log("Recebido input", input);

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError();
    }

    const id = this.idGenerator.generate();

    const currentDate = new Date();

    const student = new Student(
      id,
      name,
      email,
      phone,
      age,
      [],
      [],
      payload.id,
      payload.name,
      currentDate.toISOString(),
      role,
      currentDate.toISOString(),
      photo
    );
    console.log("Created student object:", student);
    const studentDB = student.toDBModel();
    await this.studentDatabase.insertStudent(studentDB);
    console.log("Inserted student into database:", studentDB);
    const output: CreateStudentOutputDTO = {
      message: "Student created successfully",
      studentName: student.getName(),
    };

    console.log("Returning output:", output);
    return output;
  };

  public getStudents = async (
    input: GetStudentInputDTO
  ): Promise<GetStudentOutputDTO> => {
    const { token } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError();
    }

    const studentsDBWithCreatorName =
      await this.studentDatabase.getStudentsWithCreatorName();

    const students = studentsDBWithCreatorName.map((studentWithCreatorName) => {
      const student = new Student(
        studentWithCreatorName.id,
        studentWithCreatorName.name,
        studentWithCreatorName.email,
        studentWithCreatorName.phone,
        studentWithCreatorName.age,
        studentWithCreatorName.notes as TNote[],
        studentWithCreatorName.annotations as TAnnotation[],
        studentWithCreatorName.teacher_id,
        studentWithCreatorName.creator_name,
        studentWithCreatorName.created_at,
        studentWithCreatorName.role,
        studentWithCreatorName.updated_at,
        studentWithCreatorName.photo as string | ImageData
      );
      return student.toBusinessModel();
    });
    const output: GetStudentOutputDTO = students;

    return output;
  };

  public deleteStudent = async (
    input: DeleteStudentInputDTO
  ): Promise<DeleteStudentOutputDTO> => {
    const { token, idToDelete } = input;
    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      console.log("Token inválido - Payload não encontrado");
      throw new UnauthorizedError();
    }
    console.log("ID enviado para o banco de dados:", idToDelete);
    const studentDB = await this.studentDatabase.findStudentById(idToDelete);

    if (!studentDB) {
      throw new NotFoundError("Estudante com essa id não existe");
    }
    if (payload.role !== USER_ROLES.ADMIN) {
      if (payload.id !== studentDB.teacher_id) {
        throw new ForbiddenError(
          "Somente quem criou o estudante, pode editá-lo"
        );
      }
    }
    await this.studentDatabase.deleteStudentById(idToDelete);

    const output: DeleteStudentOutputDTO = {
      message: "Estudante deletado com sucesso",
    };

    return output;
  };

  public addNewNote = async (
    input: AddNewNoteInputDTO
  ): Promise<AddNewNoteOutputDTO> => {
    const { token, idToEdit, notes } = input;
    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError();
    }
    const studentDB = await this.studentDatabase.findStudentById(idToEdit);

    if (!studentDB) {
      throw new NotFoundError("Estudante com essa id não existe");
    }

    if (payload.id !== studentDB.teacher_id) {
      throw new ForbiddenError("Somente quem criou o estudante, pode editá-lo");
    }

    const student = new Student(
      studentDB.id,
      studentDB.name,
      studentDB.email,
      studentDB.phone,
      studentDB.age,
      studentDB.notes || [],
      studentDB.annotations || [],
      studentDB.teacher_id,
      payload.name,
      studentDB.created_at,
      studentDB.role,
      studentDB.updated_at,
      studentDB.photo as string | ImageData
    );

    const newNoteObjects: TNote[] = notes.map((note) => ({
      id: this.idGenerator.generate(),
      note: [note],
    }));
    student.setNotes([...student.getNotes(), ...newNoteObjects]);

    const updatedStudentDB = student.toDBModel();

    await this.studentDatabase.addNewNote(updatedStudentDB);

    const output: EditStudentOutputDTO = {
      message: "Nova nota adicionada com sucesso",
    };

    return output;
  };

  public findStudentById = async (
    id: string,
    token: string
  ): Promise<Student | undefined> => {
    const studentDB = await this.studentDatabase.findStudentById(id);
    if (!studentDB) {
      throw new NotFoundError("Estudante com essa id não existe");
    }
    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError();
    }

    const student = new Student(
      studentDB.id,
      studentDB.name,
      studentDB.email,
      studentDB.phone,
      studentDB.age,
      studentDB.notes as TNote[],
      studentDB.annotations as TAnnotation[],
      studentDB.teacher_id,
      payload.name,
      studentDB.created_at,
      studentDB.role,
      studentDB.updated_at,
      studentDB.photo as ImageData | string
    );

    return student;
  };

  public editStudent = async (
    input: EditStudentInputDTO
  ): Promise<EditStudentOutputDTO> => {
    const { name, token, idToEdit, age, email, phone, photo } = input;
    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError();
    }
    const studentDB = await this.studentDatabase.findStudentById(idToEdit);

    if (!studentDB) {
      throw new NotFoundError("Estudante com essa id não existe");
    }

    if (payload.id !== studentDB.teacher_id) {
      throw new ForbiddenError("Somente quem criou o estudante, pode editá-lo");
    }

    const student = new Student(
      studentDB.id,
      studentDB.name,
      studentDB.email,
      studentDB.phone,
      studentDB.age,
      studentDB.notes || [],
      studentDB.annotations || [],
      studentDB.teacher_id,
      payload.name,
      studentDB.created_at,
      studentDB.role,
      studentDB.updated_at,
      studentDB.photo as string | ImageData
    );

    student.setName(name);
    student.setEmail(email);
    student.setPhone(phone);
    student.setAge(age);
    student.setPhoto(photo);

    const updatedStudentDB = student.toDBModel();

    await this.studentDatabase.updateStudent(updatedStudentDB);

    const output: EditStudentOutputDTO = {
      message: "Edição realizada com sucesso",
    };

    return output;
  };
}
