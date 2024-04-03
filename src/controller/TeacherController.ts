import { ZodError } from "zod";
import { TeacherBusiness } from "../business/TeacherBusiness";
import { BaseError } from "../errors/BaseError";
import { Request, Response } from "express";
import { SignupSchema } from "../dtos/teacher/signup.dto";
import { LoginSchema } from "../dtos/teacher/login.dto";
import { ResetPasswordSchema } from "../dtos/teacher/resetPassword.dto";
import { GetTeacherSchema } from "../dtos/teacher/getTeacher.dto";

export class TeacherController {
  constructor(private teacherBusiness: TeacherBusiness) {}

  public signup = async (req: Request, res: Response) => {
    try {
      const input = SignupSchema.parse({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      });

      const output = await this.teacherBusiness.signup(input);
      res.status(201).send(output);
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

  public login = async (req: Request, res: Response) => {
    try {
      const input = LoginSchema.parse({
        email: req.body.email,
        password: req.body.password,
      });

      const output = await this.teacherBusiness.login(input);
      if (!output || !output.token) {
        throw new Error("Token não gerado corretamente");
      }

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
  public resetPassword = async (req: Request, res: Response) => {
    try {
      const input = ResetPasswordSchema.parse({
        email: req.body.email,
        newPassword: req.body.newPassword,
        confirmPassword: req.body.confirmPassword,
      });

      await this.teacherBusiness.resetPassword(input);
      res.status(200).send("Senha redefinida com sucesso");
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
  public getTeachers = async (req: Request, res: Response) => {
    try {
      const teachers = await this.teacherBusiness.getTeachers();
      res.status(200).send(teachers);
    } catch (error) {
      console.log(error);

      if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("Erro inesperado");
      }
    }
  };
}
