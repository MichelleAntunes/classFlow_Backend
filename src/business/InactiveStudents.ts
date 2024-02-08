import { InactiveStudentDatabase } from "../database/InactiveStudentDatabse";
import { StudentDatabase } from "../database/StudentDatabase";
import {
  DeleteInactiveStudentDTO,
  DeleteInactiveStudentInputDTO,
} from "../dtos/inactiveStudent/deleteInactiveStudent.dto";
import {
  GetInactiveStudentInputDTO,
  GetInactiveStudentOutputDTO,
} from "../dtos/inactiveStudent/getInactiveStudent.dto";
import {
  MoveStudentToInactiveInputDTO,
  MoveStudentToInactiveOutputDTO,
} from "../dtos/inactiveStudent/moveStudentToInactive.dto";
import { DeleteStudentOutputDTO } from "../dtos/student/deleteStudent.dto";
import { BadRequestError } from "../errors/BadRequestError";
import { BaseError } from "../errors/BaseError";
import { ForbiddenError } from "../errors/ForbiddenError";
import { NotFoundError } from "../errors/NotFoundError";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { ImageData, InactiveStudent, Notes } from "../models/InactiveStudent";
import { Annotation } from "../models/InactiveStudent";
import { USER_ROLES } from "../models/Teacher";
import { TokenManager } from "../services/TokenManager";

export class InactiveStudentBusiness {
  constructor(
    private studentDatabase: StudentDatabase,
    private inactiveStudentDatabase: InactiveStudentDatabase,
    private tokenManager: TokenManager
  ) {}

  // Business logic for handling inactive students
  public getInactiveStudents = async (
    input: GetInactiveStudentInputDTO
  ): Promise<GetInactiveStudentOutputDTO> => {
    // Extract token from input
    const { token } = input;

    // Retrieve payload from token
    const payload = this.tokenManager.getPayload(token);

    // Unauthorized if no payload
    if (!payload) {
      throw new UnauthorizedError();
    }

    // Fetch inactive students with creator's name from database
    const inactiveStudentsDBWithCreatorName =
      await this.inactiveStudentDatabase.getInactiveStudentsWithCreatorName();

    // Map database objects to business objects
    const inactiveStudents = inactiveStudentsDBWithCreatorName.map(
      (inactiveStudentWithCreatorName) => {
        const inactiveStudent = new InactiveStudent(
          inactiveStudentWithCreatorName.id,
          inactiveStudentWithCreatorName.name,
          inactiveStudentWithCreatorName.email,
          inactiveStudentWithCreatorName.phone,
          inactiveStudentWithCreatorName.age,
          inactiveStudentWithCreatorName.notes.map(
            (note) =>
              new Notes(
                note.notesId,
                inactiveStudentWithCreatorName.id,
                note.notesText,
                "",
                "",
                ""
              )
          ),
          inactiveStudentWithCreatorName.annotations.map(
            (annotation) =>
              new Annotation(
                annotation.annotationsId,
                inactiveStudentWithCreatorName.id,
                annotation.annotationsText,
                "",
                "",
                ""
              )
          ),
          inactiveStudentWithCreatorName.teacher_id,
          inactiveStudentWithCreatorName.creator_name,
          inactiveStudentWithCreatorName.created_at,
          inactiveStudentWithCreatorName.role,
          inactiveStudentWithCreatorName.updated_at,
          inactiveStudentWithCreatorName.photo as string | ImageData
        );
        return inactiveStudent.toBusinessModel();
      }
    );

    return inactiveStudents;
  };
  // Moves a student to the inactive list
  public moveStudentToInactive = async (
    input: MoveStudentToInactiveInputDTO
  ): Promise<MoveStudentToInactiveOutputDTO> => {
    // Extract student ID and token from input
    const { studentId, token } = input;
    // Retrieve payload from token
    const payload = this.tokenManager.getPayload(token);

    // Unauthorized if no payload
    if (!payload) {
      throw new UnauthorizedError();
    }
    // Find student by ID
    const student = await this.studentDatabase.findStudentById(studentId);
    // Not found error if student doesn't exist
    if (!student) {
      throw new NotFoundError("Estudante não encontrado");
    }
    // Check if student is already inactive
    const inactiveStudent =
      await this.inactiveStudentDatabase.findInactiveStudentById(studentId);

    if (inactiveStudent) {
      throw new BadRequestError("O aluno já está na lista de alunos inativos");
    }
    // Insert student into inactive list
    await this.inactiveStudentDatabase.insertInactiveStudent({
      ...student,
      updated_at: new Date().toISOString(),
    });

    // Delete student from active list
    await this.studentDatabase.deleteStudentById(studentId);

    return { message: "Estudante movido para inativo com sucesso" };
  };
  // Deletes an inactive student
  public deleteInactiveStudent = async (
    input: DeleteInactiveStudentInputDTO
  ): Promise<DeleteInactiveStudentDTO> => {
    // Extract token and ID to delete from input
    const { token, idToDelete } = input;

    // Retrieve payload from token
    const payload = this.tokenManager.getPayload(token);
    // Unauthorized if no payload
    if (!payload) {
      throw new UnauthorizedError();
    }

    // Find inactive student by ID
    const studentDB =
      await this.inactiveStudentDatabase.findInactiveStudentById(idToDelete);

    // Not found error if student doesn't exist
    if (!studentDB) {
      throw new NotFoundError("Estudante com essa id não existe");
    }

    // Check permissions for deletion
    if (payload.role !== USER_ROLES.ADMIN) {
      if (payload.id !== studentDB.teacher_id) {
        throw new ForbiddenError(
          "Somente quem criou o estudante, pode editá-lo"
        );
      }
    }
    // Delete inactive student
    await this.inactiveStudentDatabase.deleteInactiveStudentById(idToDelete);

    // Return success message
    const output: DeleteInactiveStudentDTO = {
      message: "Estudante deletado da lista de inativos com sucesso",
    };

    return output;
  };
}
