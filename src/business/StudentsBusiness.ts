import {
  Student,
  Notes,
  NotesDB,
  StudentDB,
  Annotation,
} from "../models/Student";
import { ImageData } from "../models/Student";
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
  CreateNoteInputDTO,
  CreateNoteOutputDTO,
} from "../dtos/notes/addNewNote.dto";
import {
  EditNoteInputDTO,
  EditNoteOutputDTO,
} from "../dtos/notes/editNote.dto";
import {
  DeleteNoteInputDTO,
  DeleteNoteOutputDTO,
} from "../dtos/notes/deleteNote.dto";
import {
  CreateAnnotationInputDTO,
  CreateAnnotationOutputDTO,
} from "../dtos/annotation/createNewAnnotation.dto";
import {
  DeleteAnnotationInputDTO,
  DeleteAnnotationOutputDTO,
} from "../dtos/annotation/deleteAnnotation.dto";
import {
  EditAnnotationInputDTO,
  EditAnnotationOutputDTO,
} from "../dtos/annotation/editAnnotation.dto";
import {
  GetInactiveStudentInputDTO,
  GetInactiveStudentOutputDTO,
} from "../dtos/inactiveStudent/getInactiveStudent.dto";

export class StudentBusiness {
  constructor(
    private studentDatabase: StudentDatabase,
    private idGenerator: IdGenerator,
    private tokenManager: TokenManager
  ) {}
  //Students
  public createStudent = async (
    input: CreateStudentInputDTO
  ): Promise<CreateStudentOutputDTO> => {
    const { name, email, phone, age, photo, role, token } = input;

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

    const studentDB = student.toDBModel();

    await this.studentDatabase.insertStudent(studentDB);

    const output: CreateStudentOutputDTO = {
      message: "Student created successfully",
      studentName: student.getName(),
    };

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
        studentWithCreatorName.notes.map(
          (note) =>
            new Notes(
              note.notesId,
              studentWithCreatorName.id,
              note.notesText,
              "",
              "",
              ""
            )
        ),
        studentWithCreatorName.annotations.map(
          (annotation) =>
            new Annotation(
              annotation.annotationsId,
              studentWithCreatorName.id,
              annotation.annotationsText,
              "",
              "",
              ""
            )
        ),
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
      throw new UnauthorizedError();
    }

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
      studentDB.notes.map(
        (note) =>
          new Notes(note.notesId, studentDB.id, note.notesText, "", "", "")
      ),
      studentDB.annotations.map(
        (annotation) =>
          new Annotation(
            annotation.annotationsId,
            studentDB.id,
            annotation.annotationsText,
            "",
            "",
            ""
          )
      ),
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
    if (payload.role !== USER_ROLES.ADMIN) {
      if (payload.id !== studentDB.teacher_id) {
        throw new ForbiddenError(
          "Somente quem criou o estudante, pode editá-lo"
        );
      }
    }

    const student = new Student(
      studentDB.id,
      studentDB.name,
      studentDB.email,
      studentDB.phone,
      studentDB.age,
      Array.isArray(studentDB.notes)
        ? studentDB.notes.map(
            (note) =>
              new Notes(note.notesId, studentDB.id, note.notesText, "", "", "")
          )
        : [],
      Array.isArray(studentDB.annotations)
        ? studentDB.annotations.map(
            (annotation) =>
              new Annotation(
                annotation.annotationsText,
                studentDB.id,
                annotation.annotationsText,
                "",
                "",
                ""
              )
          )
        : [],
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
  //Notes
  public createNotesByStudentId = async (
    input: CreateNoteInputDTO
  ): Promise<CreateNoteOutputDTO> => {
    const { token, studentId, notes } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError();
    }

    const id = this.idGenerator.generate();

    const studentDB = await this.studentDatabase.findStudentById(studentId);

    if (!studentDB) {
      throw new NotFoundError("Estudante com essa id não existe");
    }

    if (payload.id !== studentDB.teacher_id) {
      throw new ForbiddenError("Somente quem criou o estudante, pode editá-lo");
    }
    const currentDate = new Date();

    const newNote = new Notes(
      id,
      studentId,
      notes,
      currentDate.toISOString(),
      currentDate.toISOString(),
      payload.id
    );

    const newNoteDB = newNote.toDBModel();

    await this.studentDatabase.insertNotesByStudentId(newNoteDB);

    const output: EditStudentOutputDTO = {
      message: "Nova nota adicionada com sucesso",
    };

    return output;
  };
  public deleteNotesByNoteId = async (
    input: DeleteNoteInputDTO
  ): Promise<DeleteNoteOutputDTO> => {
    const { token, idToDelete } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError();
    }
    const noteDB = await this.studentDatabase.findNoteById(idToDelete);
    if (!noteDB) {
      throw new NotFoundError("Nota com essa id não existe");
    }

    if (payload.role !== USER_ROLES.ADMIN) {
      if (payload.id !== noteDB.teacher_id) {
        throw new ForbiddenError("Somente quem criou o nota, pode deletá-lo");
      }
    }
    await this.studentDatabase.deleteNotesByNoteId(idToDelete);

    const output: DeleteStudentOutputDTO = {
      message: "Nota deletada com sucesso",
    };

    return output;
  };
  public editNoteByNoteId = async (
    input: EditNoteInputDTO
  ): Promise<EditNoteOutputDTO> => {
    const { token, idToEdit, note } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError();
    }

    const noteDB = await this.studentDatabase.findNoteById(idToEdit);

    if (!noteDB) {
      throw new NotFoundError("Nota com essa id não existe");
    }

    if (payload.role !== USER_ROLES.ADMIN) {
      if (payload.id !== noteDB.teacher_id) {
        throw new ForbiddenError("Somente quem criou o nota, pode editá-lo");
      }
    }
    const newNote = new Notes(
      noteDB.id,
      noteDB.student_id,
      noteDB.notes,
      noteDB.created_at,
      noteDB.updated_at,
      noteDB.teacher_id
    );
    newNote.setNotesText(note);

    const updatedNoteDB = newNote.toDBModel();

    await this.studentDatabase.updateNote(updatedNoteDB);

    const output: EditNoteOutputDTO = {
      message: "Nota editada com sucesso",
    };

    return output;
  };
  //Annotation
  public createAnnotationByStudentId = async (
    input: CreateAnnotationInputDTO
  ): Promise<CreateAnnotationOutputDTO> => {
    const { token, studentId, annotations } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError();
    }

    const id = this.idGenerator.generate();

    const studentDB = await this.studentDatabase.findStudentById(studentId);

    if (!studentDB) {
      throw new NotFoundError("Estudante com essa id não existe");
    }

    if (payload.id !== studentDB.teacher_id) {
      throw new ForbiddenError("Somente quem criou o estudante, pode editá-lo");
    }
    const currentDate = new Date();

    const newAnnotation = new Annotation(
      id,
      studentId,
      annotations,
      currentDate.toISOString(),
      currentDate.toISOString(),
      payload.id
    );

    const newAnnotationDB = newAnnotation.toDBModel();

    await this.studentDatabase.insertAnnotationsByStudentId(newAnnotationDB);

    const output: CreateAnnotationOutputDTO = {
      message: "Nova anotação adicionada com sucesso",
    };

    return output;
  };
  public deleteAnnotationsByAnnotationId = async (
    input: DeleteAnnotationInputDTO
  ): Promise<DeleteAnnotationOutputDTO> => {
    const { token, idToDelete } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError();
    }
    const annotationDB = await this.studentDatabase.findAnnotationById(
      idToDelete
    );
    if (!annotationDB) {
      throw new NotFoundError("Anotação com essa id não existe");
    }

    if (payload.role !== USER_ROLES.ADMIN) {
      if (payload.id !== annotationDB.teacher_id) {
        throw new ForbiddenError(
          "Somente quem criou a anotação, pode deletá-la"
        );
      }
    }
    await this.studentDatabase.deleteAnnotationsByAnnotationId(idToDelete);

    const output: DeleteStudentOutputDTO = {
      message: "Nota deletada com sucesso",
    };

    return output;
  };
  public editAnnotationByAnnotationId = async (
    input: EditAnnotationInputDTO
  ): Promise<EditAnnotationOutputDTO> => {
    const { token, idToEdit, annotation } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError();
    }

    const annotationDB = await this.studentDatabase.findAnnotationById(
      idToEdit
    );

    if (!annotationDB) {
      throw new NotFoundError("Anotação com essa id não existe");
    }

    if (payload.role !== USER_ROLES.ADMIN) {
      if (payload.id !== annotationDB.teacher_id) {
        throw new ForbiddenError("Somente quem criou o nota, pode editá-la");
      }
    }
    const newAnnotation = new Annotation(
      annotationDB.id,
      annotationDB.student_id,
      annotationDB.annotations,
      annotationDB.created_at,
      annotationDB.updated_at,
      annotationDB.teacher_id
    );
    newAnnotation.setAnnotationText(annotation);

    const updatedAnnotationDB = newAnnotation.toDBModel();

    await this.studentDatabase.updateAnnotation(updatedAnnotationDB);

    const output: EditAnnotationOutputDTO = {
      message: "Anotação editada com sucesso",
    };

    return output;
  };
}
