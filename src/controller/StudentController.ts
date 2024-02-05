import { Request, Response } from "express";

import { ImageData, StudentDB } from "../models/Student";
import { ZodError } from "zod";

import { CreateStudentSchema } from "../dtos/student/createStudent.dto";
import { BaseError } from "../errors/BaseError";
import { StudentBusiness } from "../business/StudentsBusiness";
import { GetStudentSchema } from "../dtos/student/getStudents.dto";
import { EditStudentSchema } from "../dtos/student/editStudent.dto";
import { DeleteStudentSchema } from "../dtos/student/deleteStudent.dto";
import { IdGenerator } from "../services/IdGenerator";
import { CreateNoteSchema } from "../dtos/notes/addNewNote.dto";
import { DeleteNoteSchema } from "../dtos/notes/deleteNote.dto";
import { EditNoteSchema } from "../dtos/notes/editNote.dto";
import { CreateAnnotationSchema } from "../dtos/annotation/createNewAnnotation.dto";
import { DeleteAnnotationSchema } from "../dtos/annotation/deleteAnnotation.dto";
import { EditAnnotationSchema } from "../dtos/annotation/editAnnotation.dto";

export class StudentController {
  constructor(private studentBusiness: StudentBusiness) {}
  //Students
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
      const input = DeleteStudentSchema.parse({
        token: req.headers.authorization,
        idToDelete: req.params.id,
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
  //Notes
  public createNotesByStudentId = async (req: Request, res: Response) => {
    try {
      const input = CreateNoteSchema.parse({
        token: req.headers.authorization,
        studentId: req.params.studentId,
        notes: req.body.notes,
      });

      const output = await this.studentBusiness.createNotesByStudentId(input);
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
  public deleteNotesByNoteId = async (req: Request, res: Response) => {
    try {
      const input = DeleteNoteSchema.parse({
        token: req.headers.authorization,
        idToDelete: req.params.id,
      });
      const output = await this.studentBusiness.deleteNotesByNoteId(input);
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
  public editNoteByNoteId = async (req: Request, res: Response) => {
    try {
      const input = EditNoteSchema.parse({
        token: req.headers.authorization,
        idToEdit: req.params.noteid,
        note: req.body.note,
      });
      const output = await this.studentBusiness.editNoteByNoteId(input);
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
  //Annotations
  public createAnnotationByStudentId = async (req: Request, res: Response) => {
    try {
      const input = CreateAnnotationSchema.parse({
        token: req.headers.authorization,
        studentId: req.params.studentId,
        annotations: req.body.annotations,
      });

      const output = await this.studentBusiness.createAnnotationByStudentId(
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
  public deleteAnnotationsByAnnotationId = async (
    req: Request,
    res: Response
  ) => {
    try {
      const input = DeleteAnnotationSchema.parse({
        token: req.headers.authorization,
        idToDelete: req.params.id,
      });
      const output = await this.studentBusiness.deleteAnnotationsByAnnotationId(
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
  public editAnnotationByAnnotationId = async (req: Request, res: Response) => {
    try {
      const input = EditAnnotationSchema.parse({
        token: req.headers.authorization,
        idToEdit: req.params.annotationId,
        annotation: req.body.annotation,
      });
      const output = await this.studentBusiness.editAnnotationByAnnotationId(
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
