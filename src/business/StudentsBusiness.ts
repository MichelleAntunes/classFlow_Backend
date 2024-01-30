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

export class StudentBusiness {
  constructor(
    private studentDatabase: StudentDatabase,
    private idGenerator: IdGenerator,
    private tokenManager: TokenManager
  ) {}

  public createStudent = async (
    input: CreateStudentInputDTO
  ): Promise<CreateStudentOutputDTO> => {
    const { name, email, phone, age, notes, annotations, photo, role, token } =
      input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError();
    }

    const id = this.idGenerator.generate();
    const processProperty = (
      property: string[] | string | undefined
    ): TNote[] => {
      if (Array.isArray(property)) {
        return property.map((note) => ({ id: "uniqueId", note }));
      } else if (typeof property === "string") {
        return [{ id: "uniqueId", note: property }];
      } else {
        return [];
      }
    };

    const notesArray = processProperty(notes);
    const annotationsArray = processProperty(annotations);

    const currentDate = new Date();

    const student = new Student(
      id,
      name,
      email,
      phone,
      age,
      notesArray,
      annotationsArray,
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
      console.log("notes:", studentWithCreatorName.notes);
      console.log("annotations:", studentWithCreatorName.annotations);
      let notes = [];
      if (Array.isArray(studentWithCreatorName.notes)) {
        notes = studentWithCreatorName.notes;
      } else if (typeof studentWithCreatorName.notes === "string") {
        try {
          notes = JSON.parse(studentWithCreatorName.notes);
        } catch (error) {
          console.error("Erro ao fazer o parse da string JSON:", error);
        }
      }

      let annotations = [];

      if (Array.isArray(studentWithCreatorName.annotations)) {
        annotations = studentWithCreatorName.annotations;
      } else if (typeof studentWithCreatorName.annotations === "string") {
        try {
          annotations = JSON.parse(studentWithCreatorName.annotations);
        } catch (error) {
          console.error("Erro ao fazer o parse da string JSON:", error);
        }
      }

      const student = new Student(
        studentWithCreatorName.id,
        studentWithCreatorName.name,
        studentWithCreatorName.email,
        studentWithCreatorName.phone,
        studentWithCreatorName.age,
        notes,
        annotations,
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
  public editStudent = async (
    input: EditStudentInputDTO
  ): Promise<EditStudentOutputDTO> => {
    const {
      studentName,
      idToEdit,
      token,
      age,
      email,
      phone,
      notes,
      annotations,
      photo,
    } = input;
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

    student.setName(studentName);
    student.setAge(age);
    student.setEmail(email);
    student.setPhone(phone);
    const mappedNotes = notes.map((note) => ({
      id: this.idGenerator.generate(),
      note,
    }));
    const mappedAnnotations = annotations.map((annotation) => ({
      id: this.idGenerator.generate(),
      annotation,
    }));

    student.setNotes([...student.getNotes(), ...mappedNotes]);
    student.setAnnotations([...student.getAnnotations(), ...mappedAnnotations]);

    student.setPhoto(photo);

    const updatedStudentDB = student.toDBModel();

    await this.studentDatabase.updateStudent(updatedStudentDB);

    const output: EditStudentOutputDTO = {
      message: "Edição realizada com sucesso",
    };

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

  public addNewAnnotations(
    student: Student,
    newAnnotations: string[],
    token: string,
    idGenerator: IdGenerator
  ) {
    const payload = this.tokenManager.getPayload(token);
    const newAnnotationObjects: TAnnotation[] = newAnnotations.map(
      (annotation) => ({
        id: idGenerator.generate(),
        annotation,
      })
    );

    student.setAnnotations([
      ...student.getAnnotations(),
      ...newAnnotationObjects,
    ]);
  }

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
}
