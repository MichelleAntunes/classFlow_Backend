import { ZodError } from "zod";
import { TeacherBusiness } from "../business/TeacherBusiness";
import { BaseError } from "../errors/BaseError";
import { Request, Response } from "express";
import { SignupSchema } from "../dtos/teacher/signup.dto";
import { LoginSchema } from "../dtos/teacher/login.dto";

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
