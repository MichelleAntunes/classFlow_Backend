import { Request, Response } from "express";

import { ImageData, TNote, TAnnotation, StudentDB } from "../models/Student";
import { ZodError } from "zod";

import { CreateStudentSchema } from "../dtos/student/createStudent.dto";
import { BaseError } from "../errors/BaseError";
import { StudentBusiness } from "../business/StudentsBusiness";
import { GetStudentSchema } from "../dtos/student/getStudents.dto";
import { EditStudentSchema } from "../dtos/student/editStudent.dto";
import { DeleteStudentSchema } from "../dtos/student/deleteStudent.dto";
import { IdGenerator } from "../services/IdGenerator";
import { AddNewNoteSchema } from "../dtos/student/addNewNote.dto";

export class StudentController {
  constructor(private studentBusiness: StudentBusiness) {}

  public createStudent = async (req: Request, res: Response) => {
    try {
      const input = CreateStudentSchema.parse({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        age: req.body.age,
        role: req.body.role,
        photo: req.body.photo,
        token: req.headers.authorization,
      });

      const output = await this.studentBusiness.createStudent(input);
      console.log("Created student successfully:", output);
      res.status(201).send(output);
    } catch (error) {
      console.log("Error in createStudent:", error);
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

  public getStudents = async (req: Request, res: Response) => {
    try {
      const input = GetStudentSchema.parse({
        token: req.headers.authorization,
      });
      const output = await this.studentBusiness.getStudents(input);
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

  public editStudent = async (req: Request, res: Response) => {
    try {
      const input = EditStudentSchema.parse({
        name: req.body.name,
        token: req.headers.authorization,
        idToEdit: req.params.id,
        age: req.body.age,
        email: req.body.email,
        phone: req.body.phone,
        photo: req.body.photo,
      });
      const output = await this.studentBusiness.editStudent(input);
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

  public deleteStudent = async (req: Request, res: Response) => {
    try {
      console.log("ID da requisição:", req.params.id);
      console.log("Input antes da validação:", {
        token: req.headers.authorization,
        idToEdit: req.params.id,
      });

      const input = DeleteStudentSchema.parse({
        token: req.headers.authorization,
        idToEdit: req.params.id,
      });
      const output = await this.studentBusiness.deleteStudent(input);
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
  public addNewNote = async (req: Request, res: Response) => {
    try {
      const input = AddNewNoteSchema.parse({
        token: req.headers.authorization,
        idToEdit: req.params.id,
        notes: req.body.notes,
      });

      const output = await this.studentBusiness.addNewNote(input);
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
