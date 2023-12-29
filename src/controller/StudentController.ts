import { Request, Response } from "express";
import { StudentDatabase } from "../database/StudentDatabase";
import {
  TImageData,
  TNote,
  TAnnotation,
  TStudents,
  TInactiveStudentsData,
  TCalendarData,
  TPasswordResetData,
  TNotesData,
  TChatData,
} from "../types";

import { StudentBusiness } from "../business/StudentsBusiness";

export class StudentController {
  public getStudents = async (req: Request, res: Response) => {
    try {
      const nameToFind = req.query.name as string;
      const studentBusiness = new StudentBusiness();
      const output = await studentBusiness.getStudents(nameToFind);

      res.status(200).send(output);
    } catch (error) {
      if (res.statusCode === 200) {
        // Se a resposta já estiver definida para 200, retorne um erro interno
        res
          .status(500)
          .json({
            error: error instanceof Error ? error.stack : "Erro inesperado",
          });
      } else {
        if (error instanceof Error) {
          res.status(500).json({ error: error.message });
        } else {
          res
            .status(500)
            .json({
              error: error instanceof Error ? error.stack : "Erro inesperado",
            });
        }
      }
    }
  };
  public createStudent = async (req: Request, res: Response) => {
    try {
      const input = {
        id: req.body.id,
        name: req.body.name,
        age: req.body.age,
        email: req.body.email,
        phone: req.body.phone,
        notes: req.body.notes,
        annotations: req.body.annotations,
        teacher_id: req.body.teacher_id,
        class_id: req.body.class_id,
      };

      const studentBusiness = new StudentBusiness();
      const output = await studentBusiness.createStudent(input, req);

      res.status(201).send(output);
    } catch (error) {
      if (res.statusCode === 200) {
        // if it arrives still worth 200 we know it was an unexpected mistake
        res.status(500); // we set 500 because it's something the server didn't foresee
      }
      // we've added a validation flow for the 'error' parameter
      if (error instanceof Error) {
        res.send(error.message);
      } else {
        res.send("Erro inesperado");
      }
    }
  };
  public getStudentById = async (req: Request, res: Response) => {
    try {
      //:id could be any other necessary filter
      const idToFind = req.params.id; // we don't need to force typing here, because all path params are strings
      const studentDatabase = new StudentDatabase();
      const students = await studentDatabase.findStudentByID(idToFind);

      if (typeof idToFind !== "string") {
        res.status(406); // appropriate status for method not acceptable
        throw new Error("'idToFind' deve ser uma string");
      }

      if (!students) {
        res.status(404); // appropriate status for not found
        throw new Error("Estudante não encontrado");
      }
      res.status(200).send(students);
    } catch (error) {
      if (res.statusCode === 200) {
        //if it arrives still worth 200 we know it was an unexpected mistake
        res.status(500); // we set 500 because it's something the server didn't foresee
      }
      // we've added a validation flow for the 'error' parameter
      if (error instanceof Error) {
        res.send(error.message);
      } else {
        res.send("Erro inesperado");
      }
    }
  };
  public editStudentById = async (req: Request, res: Response) => {
    try {
      const idToEdit = req.params.id;

      if (typeof idToEdit !== "string") {
        res.status(406); // status apropriado para método não aceitável
        throw new Error("'id' deve ser uma string");
      }
      const studentDatabase = new StudentDatabase();
      const student = await studentDatabase.findStudentByID(idToEdit);

      if (!student) {
        res.status(404); // status apropriado para não encontrado
        throw new Error("Estudante não encontrado");
      }

      const newId = req.body.id as string | undefined;
      const newName = req.body.name as string | undefined;
      const newEmail = req.body.email as string | undefined;
      const newPhone = req.body.phone as number | undefined;
      const newAge = req.body.age as number | undefined;
      const newPhoto = req.body.photo as TImageData | string | null;
      const newTeacherId = req.body.teacher_id as string | undefined;
      const newClassId = req.body.class_id as string | undefined;

      if (newId !== undefined) {
        if (typeof newId !== "string" || newId.length < 1) {
          res.status(406); // status apropriado para método não aceitável
          throw new Error(
            "'newId' deve ser uma string e ter pelo menos um caractere"
          );
        }
      }
      if (newTeacherId !== undefined) {
        if (typeof newTeacherId !== "string" || newTeacherId.length < 1) {
          res.status(406); // status apropriado para método não aceitável
          throw new Error(
            "'newTeacherId' deve ser uma string e ter pelo menos um caractere"
          );
        }
      }
      if (newClassId !== undefined) {
        if (typeof newClassId !== "string" || newClassId.length < 1) {
          res.status(406); // status apropriado para método não aceitável
          throw new Error(
            "'newClassId' deve ser uma string e ter pelo menos um caractere"
          );
        }
      }
      if (newPhoto !== undefined) {
        if (
          typeof newPhoto !== "string" ||
          newPhoto.length < 1 ||
          !(typeof newPhoto === "string" || Buffer.isBuffer(newPhoto))
        ) {
          res.status(406); // appropriate status for non-acceptable method
          throw new Error(
            "'newPhoto' deve ser uma string ou um buffer e ter pelo menos um caractere"
          );
        }
      }

      if (newName !== undefined) {
        if (typeof newName !== "string" || newName.length < 2) {
          res.status(406); // appropriate status for non-acceptable method
          throw new Error(
            "'newName' deve ser uma string e ter pelo menos dois caracteres"
          );
        }
      }

      if (newEmail !== undefined) {
        if (typeof newEmail !== "string") {
          res.status(406); // appropriate status for non-acceptable method
          throw new Error("'newEmail' deve ser uma string");
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newEmail)) {
          res.status(406); // appropriate status for non-acceptable method
          throw new Error("'newEmail' deve ser um email válido");
        }
      }
      if (newAge !== undefined) {
        if (typeof newAge !== "number") {
          res.status(406); // appropriate status for non-acceptable method
          throw new Error("'newAge' deve ser um número");
        }
      }

      if (newPhone !== undefined) {
        if (typeof newPhone !== "number") {
          res.status(406); // appropriate status for non-acceptable method
          throw new Error("'newPhone' deve ser um número");
        }

        const newPhoneString: string = newPhone.toString();
        const phoneRegex = /^(?:\+\d{1,4}\s?)?\d{6,14}$/;

        if (!phoneRegex.test(newPhoneString)) {
          res.status(406); // appropriate status for non-acceptable method
          throw new Error("'newPhone' deve ser um número de telefone válido");
        }
      }
      const updatedStudentData: Record<string, any> = {
        name: newName || student.name,
        email: newEmail || student.email,
        phone: newPhone || student.phone,
        age: newAge || student.age,
        photo: newPhoto || student.photo,
        teacher_id: newTeacherId || student.teacher_id,
        class_id: newClassId || student.class_id,
      };
      await studentDatabase.editStudentByID(idToEdit, updatedStudentData);
      res.status(200).send("Atualização realizada com sucesso");
    } catch (error) {
      if (res.statusCode === 200) {
        // if it arrives still worth 200 we know it was an unexpected error
        res.status(500); // we set 500 because it's something the server didn't foresee
      }
      // add a validation flow for the 'error' parameter
      if (error instanceof Error) {
        res.send(error.message);
      } else {
        res.send("Erro inesperado");
      }
    }
  };
  public delteStudentById = async (req: Request, res: Response) => {
    try {
      const idToDelete = req.params.id;
      const studentDatabase = new StudentDatabase();
      await studentDatabase.deleteStudentByID(idToDelete);

      if (typeof idToDelete !== "string") {
        res.status(406); // appropriate status for method not acceptable
        throw new Error("'idToDelete' deve ser uma string");
      }

      if (!studentDatabase) {
        res.status(404);
        throw new Error("'id' não encontrada");
      }

      res.status(200).send("Estudante deletado com sucesso.");
    } catch (error) {
      if (res.statusCode === 200) {
        // if it arrives still worth 200 we know it was an unexpected mistake
        res.status(500); //we set 500 because it's something the server didn't foresee
      }
      // we've added a validation flow for the 'error' parameter
      if (error instanceof Error) {
        res.send(error.message);
      } else {
        res.send("Erro inesperado");
      }
    }
  };
}
