import { TeacherDataBase } from "../database/TeacherDatabase";
import { LoginInputDTO, LoginOutputDTO } from "../dtos/teacher/login.dto";
import { SignupInputDTO, SignupOutputDTO } from "../dtos/teacher/signup.dto";
import { BadRequestError } from "../errors/BadRequestError";
import { NotFoundError } from "../errors/NotFoundError";
import { USER_ROLES } from "../models/Student";
import { Teacher, TokenPayload } from "../models/Teacher";
import { HashManager } from "../services/HashManager";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";

export class TeacherBusiness {
  constructor(
    private teacherDatabase: TeacherDataBase,
    private idGenerator: IdGenerator,
    private tokenManager: TokenManager,
    private hashManager: HashManager
  ) {}

  public signup = async (input: SignupInputDTO): Promise<SignupOutputDTO> => {
    const { name, email, password } = input;
    const id = this.idGenerator.generate();

    const hashedPassword = await this.hashManager.hash(password);
    const teacher = new Teacher(
      id,
      name,
      email,
      hashedPassword,
      new Date().toISOString(),
      USER_ROLES.NORMAL
    );
    const teacherDB = teacher.toDBModel();
    await this.teacherDatabase.insertTeacher(teacherDB);

    const payload: TokenPayload = {
      id: teacher.getId(),
      name: teacher.getName(),
      role: teacher.getRole(),
    };
    const token = this.tokenManager.createToken(payload);
    const output: SignupOutputDTO = { token };

    return output;
  };

  public login = async (input: LoginInputDTO): Promise<LoginOutputDTO> => {
    const { email, password } = input;

    const teacherDB = await this.teacherDatabase.findeTeacherByEmail(email);

    if (!teacherDB) {
      throw new BadRequestError("E-mail e/ou senha inválidos");
    }

    const teacher = new Teacher(
      teacherDB.id,
      teacherDB.name,
      teacherDB.email,
      teacherDB.password,
      teacherDB.created_at,
      teacherDB.role,
      teacherDB.photo
    );
    const hashedPassword = teacher.getPassword();
    const isPasswordCorrect = await this.hashManager.compare(
      password,
      hashedPassword
    );

    if (!isPasswordCorrect) {
      throw new BadRequestError("E-mail e/ou senha inválidos");
    }

    const payload: TokenPayload = {
      id: teacher.getId(),
      name: teacher.getName(),
      role: teacher.getRole(),
    };
    const token = this.tokenManager.createToken(payload);
    const output: LoginOutputDTO = { token };

    return output;
  };
}
