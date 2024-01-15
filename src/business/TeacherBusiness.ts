import { TeacherDataBase } from "../database/TeacherDatabase";
import { HashManager } from "../services/HashManager";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";

export class TeacherBusiness {
  constructor(
    private studenteDatabase: TeacherDataBase,
    private idGenerator: IdGenerator,
    private tokenManager: TokenManager,
    private hashManager: HashManager
  ) {}
}
