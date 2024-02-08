import { Request, Response } from "express";

import { ZodError } from "zod";
import { BaseError } from "../errors/BaseError";
import { InactiveStudentBusiness } from "../business/InactiveStudents";
import { GetInactiveStudentSchema } from "../dtos/inactiveStudent/getInactiveStudent.dto";
import {
  MoveStudentToInactiveInputDTO,
  MoveStudentToInactiveOutputDTO,
} from "../dtos/inactiveStudent/moveStudentToInactive.dto";
import { DeleteInactiveStudentSchema } from "../dtos/inactiveStudent/deleteInactiveStudent.dto";

export class InactiveStudentController {
  constructor(private inactivStudentBusiness: InactiveStudentBusiness) {}

  public getInactiveStudents = async (req: Request, res: Response) => {
    try {
      const input = GetInactiveStudentSchema.parse({
        token: req.headers.authorization,
      });
      const output = await this.inactivStudentBusiness.getInactiveStudents(
        input
      );
      res.status(200).send(output);
    } catch (error) {
      console.log(error);

      if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("Erro inesperado");
      }
    }
  };
  public moveStudentToInactive = async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        throw new Error("Authorization header is missing");
      }

      const input: MoveStudentToInactiveInputDTO = {
        studentId: req.params.studentId,
        token: token,
      };
      if (!input.studentId || !input.token) {
        res.status(400).send("ID do aluno e token são necessários");
        return;
      }
      await this.inactivStudentBusiness.moveStudentToInactive(input);

      const output: MoveStudentToInactiveOutputDTO = {
        message: "Estudante movido para inativo com sucesso",
      };

      res.status(200).send(output);
    } catch (error) {
      console.log(error);

      if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("Erro inesperado");
      }
    }
  };
  public deleteInactiveStudent = async (req: Request, res: Response) => {
    try {
      const input = DeleteInactiveStudentSchema.parse({
        token: req.headers.authorization,
        idToDelete: req.params.id,
      });
      const output = await this.inactivStudentBusiness.deleteInactiveStudent(
        input
      );
      res.status(200).send(output);
    } catch (error) {
      console.log(error);

      if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("Erro inesperado");
      }
    }
  };
}
