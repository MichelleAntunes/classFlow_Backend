import { Request, Response } from "express";

import { ImageData, TNote, TAnnotation, StudentDB } from "../models/Student";
import { ZodError } from "zod";

import { CreateStudentSchema } from "../dtos/student/createStudent.dto";
import { BaseError } from "../errors/BaseError";
import { StudentBusiness } from "../business/StudentsBusiness";
import { GetStudentSchema } from "../dtos/student/getStudents.dto";
import { EditStudentSchema } from "../dtos/student/editStudent.dto";

export class StudentController {
  constructor(private studentBusiness: StudentBusiness) {}

  public createStudent = async (req: Request, res: Response) => {
    try {
      const input = CreateStudentSchema.parse({
        token: req.headers.authorization,
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        age: req.body.age,
        notes: req.body.notes,
        annotations: req.body.annotations,
        photo: req.body.photo,
        role: req.body.role,
      });
      const output = await this.studentBusiness.createStudent(input);
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
        token: req.headers.authorization,
        name: req.body.name,
        idToEdit: req.params.id,
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

  // public getStudentById = async (req: Request, res: Response) => {
  //   try {
  //     //:id could be any other necessary filter
  //     const idToFind = req.params.id; // we don't need to force typing here, because all path params are strings
  //     const studentDatabase = new StudentDatabase();
  //     const students = await studentDatabase.findStudentByID(idToFind);
  //     if (typeof idToFind !== "string") {
  //       res.status(406); // appropriate status for method not acceptable
  //       throw new Error("'idToFind' deve ser uma string");
  //     }
  //     if (!students) {
  //       res.status(404); // appropriate status for not found
  //       throw new Error("Estudante não encontrado");
  //     }
  //     res.status(200).send(students);
  //   } catch (error) {
  //     console.log(error);
  //     if (error instanceof ZodError) {
  //       res.status(400).send(error.issues);
  //     } else if (error instanceof BaseError) {
  //       res.status(error.statusCode).send(error.message);
  //     } else {
  //       res.status(500).send("Erro inesperado");
  //     }
  //   }
  // };
  // public editStudent = async (req: Request, res: Response) => {
  //   try {
  //     const input = EditStudentSchema.parse({
  //       token: req.headers.authorization,
  //       name: req.body.name,
  //       idToEdit: req.params.id,
  //     });
  // if (typeof idToEdit !== "string") {
  //   res.status(406); // status apropriado para método não aceitável
  //   throw new Error("'id' deve ser uma string");
  // }
  // const studentDatabase = new StudentDatabase();
  // const student = await studentDatabase.findStudentByID(idToEdit);
  // if (!student) {
  //   res.status(404); // status apropriado para não encontrado
  //   throw new Error("Estudante não encontrado");
  // }
  // if (newId !== undefined) {
  //   if (typeof newId !== "string" || newId.length < 1) {
  //     res.status(406); // status apropriado para método não aceitável
  //     throw new Error(
  //       "'newId' deve ser uma string e ter pelo menos um caractere"
  //     );
  //   }
  // }
  // if (newTeacherId !== undefined) {
  //   if (typeof newTeacherId !== "string" || newTeacherId.length < 1) {
  //     res.status(406); // status apropriado para método não aceitável
  //     throw new Error(
  //       "'newTeacherId' deve ser uma string e ter pelo menos um caractere"
  //     );
  //   }
  // }
  // if (newClassId !== undefined) {
  //   if (typeof newClassId !== "string" || newClassId.length < 1) {
  //     res.status(406); // status apropriado para método não aceitável
  //     throw new Error(
  //       "'newClassId' deve ser uma string e ter pelo menos um caractere"
  //     );
  //   }
  // }
  // if (newPhoto !== undefined) {
  //   if (
  //     typeof newPhoto !== "string" ||
  //     newPhoto.length < 1 ||
  //     !(typeof newPhoto === "string" || Buffer.isBuffer(newPhoto))
  //   ) {
  //     res.status(406); // appropriate status for non-acceptable method
  //     throw new Error(
  //       "'newPhoto' deve ser uma string ou um buffer e ter pelo menos um caractere"
  //     );
  //   }
  // }
  // if (newName !== undefined) {
  //   if (typeof newName !== "string" || newName.length < 2) {
  //     res.status(406); // appropriate status for non-acceptable method
  //     throw new Error(
  //       "'newName' deve ser uma string e ter pelo menos dois caracteres"
  //     );
  //   }
  // }
  // if (newEmail !== undefined) {
  //   if (typeof newEmail !== "string") {
  //     res.status(406); // appropriate status for non-acceptable method
  //     throw new Error("'newEmail' deve ser uma string");
  //   }
  //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   if (!emailRegex.test(newEmail)) {
  //     res.status(406); // appropriate status for non-acceptable method
  //     throw new Error("'newEmail' deve ser um email válido");
  //   }
  // }
  // if (newAge !== undefined) {
  //   if (typeof newAge !== "number") {
  //     res.status(406); // appropriate status for non-acceptable method
  //     throw new Error("'newAge' deve ser um número");
  //   }
  // }
  // if (newPhone !== undefined) {
  //   if (typeof newPhone !== "number") {
  //     res.status(406); // appropriate status for non-acceptable method
  //     throw new Error("'newPhone' deve ser um número");
  //   }
  //   const newPhoneString: string = newPhone.toString();
  //   const phoneRegex = /^(?:\+\d{1,4}\s?)?\d{6,14}$/;
  //   if (!phoneRegex.test(newPhoneString)) {
  //     res.status(406); // appropriate status for non-acceptable method
  //     throw new Error("'newPhone' deve ser um número de telefone válido");
  //   }
  // }
  // const updatedStudentData: Record<string, any> = {
  //   name: newName || student.name,
  //   email: newEmail || student.email,
  //   phone: newPhone || student.phone,
  //   age: newAge || student.age,
  //   photo: newPhoto || student.photo,
  //   teacher_id: newTeacherId || student.teacher_id,
  //   class_id: newClassId || student.class_id,
  // };
  //     const output = await this.studentBusiness.editStudentByID(input);
  //     res.status(200).send(output);
  //   } catch (error) {
  //     console.log(error);
  //     if (error instanceof ZodError) {
  //       res.status(400).send(error.issues);
  //     } else if (error instanceof BaseError) {
  //       res.status(error.statusCode).send(error.message);
  //     } else {
  //       res.status(500).send("Erro inesperado");
  //     }
  //   }
  // };
  // public delteStudentById = async (req: Request, res: Response) => {
  //   try {
  //     const idToDelete = req.params.id;
  //     const studentDatabase = new StudentDatabase();
  //     await studentDatabase.deleteStudentByID(idToDelete);
  //     if (typeof idToDelete !== "string") {
  //       res.status(406); // appropriate status for method not acceptable
  //       throw new Error("'idToDelete' deve ser uma string");
  //     }
  //     if (!studentDatabase) {
  //       res.status(404);
  //       throw new Error("'id' não encontrada");
  //     }
  //     res.status(200).send("Estudante deletado com sucesso.");
  //   } catch (error) {
  //     console.log(error);
  //     if (error instanceof ZodError) {
  //       res.status(400).send(error.issues);
  //     } else if (error instanceof BaseError) {
  //       res.status(error.statusCode).send(error.message);
  //     } else {
  //       res.status(500).send("Erro inesperado");
  //     }
  //   }
  // };
}
