import express, { Request, Response } from "express";
import cors from "cors";
import { TImageData, TStudents } from "./types";
import multer, { Multer } from "multer";
import { BaseDatabase } from "../src/database/BaseDatabase";
import validUrl from "valid-url";
import * as bcrypt from "bcrypt";
import { TNote } from "./types";
import { TAnnotation } from "./types";
import { StudentDB } from "../src/database/StudentDatabase";

const app = express();

app.use(express.json());
app.use(cors());

// Function to generate the password hash
const generateHashedPassword = async (password: string): Promise<string> => {
  const saltRounds = 10; // Número de rounds para o processo de hash
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};
// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    // Extraction of the original file extension:
    const extensaoArquivo = file.originalname.split(".")[1];

    // Creates a random code that will be the name of the file
    const novoNomeArquivo = require("crypto").randomBytes(64).toString("hex");

    // Indicates the new file name:
    cb(null, `${novoNomeArquivo}.${extensaoArquivo}`);
  },
});

const upload: Multer = multer({ storage });

app.listen(3003, () => {
  console.log("Servidor rodando na porta 3003");
});

// app.post("/register", async (req: Request, res: Response) => {
//   try {
//     const { name, email, password } = req.body;

//     if (!name || !email || !password) {
//       res.status(400).send("Nome, e-mail e senha são obrigatórios");
//       return;
//     }

//     const existingTeacher = await db("teacher").where({ email }).first();

//     if (existingTeacher) {
//       res.status(409).send("Professor já cadastrado");
//       return;
//     }

//     const hashedPassword = await generateHashedPassword(password);

//     await db("teacher").insert({
//       name,
//       email,
//       password: hashedPassword,
//     });

//     res.status(201).send("Professor cadastrado com sucesso");
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Erro interno do servidor");
//   }
// });

// Rota para login de professor
// app.post("/login", async (req: Request, res: Response) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       res.status(400).send("E-mail e senha são obrigatórios");
//       return;
//     }

//     const teacher = await db("teacher").where({ email }).first();
//     console.log("Senha do banco de dados:", teacher.password);
//     console.log("Senha fornecida:", password);
//     if (!teacher) {
//       console.log("Professor não encontrado para o e-mail fornecido");
//       res.status(401).send("Credenciais inválidas");
//       return;
//     }

//     const passwordMatch = await bcrypt.compare(password, teacher.password);

//     if (!passwordMatch) {
//       console.log("Senha incorreta");
//       res.status(401).send("Credenciais inválidas");
//       return;
//     }

//     console.log("Login bem-sucedido");
//     res.status(200).send("Login bem-sucedido");
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Erro interno do servidor");
//   }
// });

// Rota para redefinir a senha (o professor deve estar autenticado)
//
// app.post('/reset-password', async (req: Request, res: Response) => {
//    try {
//      const { teacher_id, newPassword } = req.body;

//       // Verificar se o professor existe na base de dados
//      const teacher = await db('teacher').where({ id: teacher_id }).first();

//      if (!teacher) {
//        res.status(404).send('Professor não encontrado');
//        return;
//      }

//       // Criptografar a nova senha antes de salvar no banco de dados
//      const hashedPassword = await bcrypt.hash(newPassword, 10);

//       // Atualizar a senha na base de dados
//      await db('teacher').where({ id: teacher_id }).update({ password: hashedPassword });

//      res.status(200).send('Senha redefinida com sucesso');
//    } catch (error) {
//      console.error(error);
//      res.status(500).send('Erro interno do servidor');
//    }
//  });

app.get("/students", async (req: Request, res: Response) => {
  try {
    const nameToFind = req.query.name as string;
    const studentDatabase = new StudentDB();
    const students = await studentDatabase.findStudent(nameToFind);

    if (nameToFind) {
      const result: TStudents[] = students.filter((student) =>
        student.name.toLowerCase().includes(nameToFind.toLowerCase())
      );

      if (result.length === 0) {
        res.status(404); // Appropriate status for not found
        throw new Error("Estudante não encontrado");
      }

      res.status(200).send(result);
    } else {
      res.status(200).send(students);
    }
  } catch (error) {
    if (res.statusCode === 200) {
      //if  it arrives still worth 200 we know it was an unexpected mistake
      res.status(500); // we set 500 because it's something the server didn't foresee
    }
    //we've added a validation flow for the 'error' parameter
    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado");
    }
  }
});
// app.get("/inactivStudents", async (req: Request, res: Response) => {
//   try {
//     const nameToFind = req.query.name as string;
//     const inactivStudents = await BaseDatabase("inactive_students");

//     if (nameToFind) {
//       const result: TStudents[] = inactivStudents.filter((inactivStudent) =>
//         inactivStudent.name.toLowerCase().includes(nameToFind.toLowerCase())
//       );

//       if (result.length === 0) {
//         res.status(404); // Appropriate status for not found
//         throw new Error("Estudante inativo não encontrado");
//       }

//       res.status(200).send(result);
//     } else {
//       res.status(200).send(inactivStudents);
//     }
//   } catch (error) {
//     if (res.statusCode === 200) {
//       //if it arrives still worth 200 we know it was an unexpected mistake
//       res.status(500); // we set 500 because it's something the server didn't foresee
//     }
//     // we've added a validation flow for the 'error' parameter
//     if (error instanceof Error) {
//       res.send(error.message);
//     } else {
//       res.send("Erro inesperado");
//     }
//   }
// });

app.post(
  "/students",
  upload.single("photo"),
  async (req: Request, res: Response) => {
    try {
      const {
        id,
        name,
        age,
        email,
        phone,
        notes,
        annotations,
        teacher_id,
        class_id,
      } = req.body;

      if (class_id !== undefined) {
        if (typeof class_id !== "string" || class_id.length < 1) {
          throw new Error(
            "'class_id' deve ser uma string e ser maior que um caractere"
          );
        }
      }
      if (teacher_id !== undefined) {
        if (typeof teacher_id !== "string" || teacher_id.length < 1) {
          throw new Error(
            "'teacher_id' deve ser uma string e ser maior que um caractere"
          );
        }
      }
      if (req.body.photo) {
        const photoUrl = req.body.photo as string;
        if (!validUrl.isUri(photoUrl)) {
          res.status(400);
          throw new Error("A URL da foto não é válida");
        }
      }

      if (id !== undefined) {
        if (typeof id !== "string" || id.length < 1) {
          res.status(406); // status apropriado para método não aceitável
          throw new Error(
            "'id' deve ser uma string e ser maior que um caractere"
          );
        }
      }
      if (name !== undefined) {
        if (typeof name !== "string") {
          res.status(400);
          throw new Error("'name' deve ser string");
        }

        if (name.length < 2) {
          res.status(400);
          throw new Error("'name' deve possuir pelo menos 2 caracteres");
        }
      }

      if (age !== undefined) {
        if (typeof age !== "number") {
          res.status(406); // appropriate status for method not acceptable
          throw new Error("'age' deve ser uma number");
        }
      }

      if (email !== undefined) {
        if (typeof email !== "string") {
          res.status(406); // appropriate status for method not acceptable
          throw new Error("'email' deve ser uma string");
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          res.status(406); // appropriate status for method not acceptable
          throw new Error("'newEmail' deve ser um email válido");
        }
      }

      if (phone !== undefined) {
        if (typeof phone !== "number") {
          res.status(406); // appropriate status for method not acceptable
          throw new Error("'phone' deve ser uma number");
        }
        const newTelephoneString: string = phone.toString();
        const phoneRegex = /^(?:\+\d{1,4}\s?)?\d{6,14}$/;
        // May or may not have a country prefix (country code) starting with + and followed by up to 4 digits.
        // May or may not have a blank space after the country code.
        // The phone number must have between 6 and 14 digits.

        if (!phoneRegex.test(newTelephoneString)) {
          res.status(406); // appropriate status for method not acceptable
          throw new Error(
            "'newTelephone' deve ser um número de telefone válido"
          );
        }
      }
      if (notes !== undefined) {
        if (typeof notes !== "string") {
          res.status(406); // appropriate status for method not acceptable
          throw new Error("'notes' deve ser uma string");
        }
      }
      if (annotations !== undefined) {
        if (typeof annotations !== "string") {
          res.status(406); // appropriate status for method not acceptable
          throw new Error("'annotations' deve ser uma string");
        }
      }
      if (teacher_id !== undefined) {
        if (typeof teacher_id !== "string" || teacher_id.length < 1) {
          res.status(406); // appropriate status for method not acceptable
          throw new Error(
            "'teacher_id' deve ser uma string e ser maior que um caractere"
          );
        }
      }
      if (class_id !== undefined) {
        if (typeof class_id !== "string" || class_id.length < 1) {
          res.status(406); // appropriate status for method not acceptable
          throw new Error(
            "'class_id' deve ser uma string e ser maior que um caractere"
          );
        }
      }

      // Logic to process the image if a photo file has been uploaded
      let photoData: Buffer | undefined;
      let mimeType: string | undefined;

      if (req.file) {
        photoData = req.file.buffer;
        mimeType = req.file.mimetype;
      }

      const newStudent: TStudents = {
        id,
        name,
        age,
        email,
        phone,
        notes,
        annotations,
        teacher_id,
        class_id,
        photo: photoData
          ? {
              data: photoData,
              mimeType: mimeType as "image/png" | "image/jpeg",
            }
          : null,
      };

      const studentDatabase = new StudentDB();
      await studentDatabase.insertStudent(newStudent);

      res.status(201).send("Cadastro do novo aluno realizado com sucesso");
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
  }
);

app.get("/students/:id", async (req: Request, res: Response) => {
  try {
    //:id could be any other necessary filter
    const idToFind = req.params.id; // we don't need to force typing here, because all path params are strings
    const studentDatabase = new StudentDB();
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
});
// //edit
app.put("/students/:id", async (req: Request, res: Response) => {
  try {
    const idToEdit = req.params.id;

    if (typeof idToEdit !== "string") {
      res.status(406); // status apropriado para método não aceitável
      throw new Error("'id' deve ser uma string");
    }
    const studentDatabase = new StudentDB();
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
});

app.delete("/students/:id", async (req: Request, res: Response) => {
  try {
    const idToDelete = req.params.id;
    const studentDatabase = new StudentDB();
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
});
// app.delete("/inactivStudents/:id", async (req: Request, res: Response) => {
//   try {
//     const inactivStudents = await BaseDatabase("inactive_students");
//     const idToDelete = req.params.id;
//     const [inactivStudent] = await BaseDatabase("inactive_students").where({
//       id: idToDelete,
//     });

//     if (typeof idToDelete !== "string") {
//       res.status(406); // appropriate status for method not acceptable
//       throw new Error("'idToDelete' deve ser uma string");
//     }

//     const studentIndex = inactivStudents.findIndex(
//       (inactivStudent) => inactivStudent.id === idToDelete
//     );

//     if (studentIndex === -1) {
//       res.status(404); // appropriate status for not found
//       throw new Error("Estudante não encontrado");
//     }
//     if (!inactivStudent) {
//       res.status(404);
//       throw new Error("'id' não encontrada");
//     }

//     await db("inactive_students").del().where({ id: idToDelete });
//     // students.splice(studentIndex, 1);
//     // res.status(204).send(); esse erro não permite mensagem
//     res.status(200).send("Estudante deletado com sucesso.");
//   } catch (error) {
//     if (res.statusCode === 200) {
//       // if it arrives still worth 200 we know it was an unexpected mistake
//       res.status(500); //we set 500 because it's something the server didn't foresee
//     }
//     // we've added a validation flow for the 'error' parameter
//     if (error instanceof Error) {
//       res.send(error.message);
//     } else {
//       res.send("Erro inesperado");
//     }
//   }
// });

// app.put("/notes/:id", async (req: Request, res: Response) => {
//   try {
//     const studentId = req.params.id;
//     const newNote = req.body.note;
//     console.log(newNote);
//     console.log(req.body); // Adicione este log para verificar o corpo da requisição

//     if (typeof studentId !== "string" || studentId.length === 0) {
//       res.status(422).send("'studentId' deve ser uma string não vazia");
//       return;
//     }

//     if (typeof newNote !== "string" || newNote.length === 0) {
//       res.status(422).send("'note' deve ser uma string não vazia");
//       return;
//     }

//     const existingStudent = await BaseDatabase("students")
//       .where("id", studentId)
//       .first();

//     if (!existingStudent) {
//       res.status(404).send("Estudante não encontrado");
//       return;
//     }

//     const noteId = await BaseDatabase("notes").insert({
//       student_id: studentId,
//       teacher_id: existingStudent.teacher_id,
//       note: newNote,
//     });

//     const updatedNotes = existingStudent.notes
//       ? [...existingStudent.notes, { id: noteId[0], note: newNote }]
//       : [{ id: noteId[0], note: newNote }];

//     await BaseDatabase("students").where("id", studentId).update({
//       notes: updatedNotes,
//     });

//     res.status(200).send("Atualização da nota realizada com sucesso");
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Erro inesperado");
//   }
// });

// app.put("/annotations/:id", async (req: Request, res: Response) => {
//   try {
//     const studentId = req.params.id;
//     const newAnnotation = req.body.annotation;
//     console.log(newAnnotation);

//     if (typeof studentId !== "string" || studentId.length === 0) {
//       res.status(422).send("'studentId' deve ser uma string não vazia");
//       return;
//     }

//     if (typeof newAnnotation !== "string" || newAnnotation.length === 0) {
//       res.status(422).send("'annotation' deve ser uma string não vazia");
//       return;
//     }

//     const existingStudent = await db("students").where("id", studentId).first();

//     if (!existingStudent) {
//       res.status(404).send("Estudante não encontrado");
//       return;
//     }

//     const annotationId = await db("annotations").insert({
//       student_id: studentId,
//       teacher_id: existingStudent.teacher_id,
//       annotation: newAnnotation,
//     });

//     const updatedAnnotations = existingStudent.annotations
//       ? [
//           ...existingStudent.annotations,
//           { id: annotationId.toString(), annotation: newAnnotation },
//         ]
//       : [{ id: annotationId.toString(), annotation: newAnnotation }];

//     await db("students").where("id", studentId).update({
//       annotations: updatedAnnotations,
//     });

//     res.status(200).send("Atualização da anotação realizada com sucesso");
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Erro inesperado");
//   }
// });

// app.put("/annotations/:id", async (req: Request, res: Response) => {
//   try {
//     const studentId = req.params.id;
//     const newAnnotation = req.body.annotation;

//     console.log(req.body); // Adicione este log para verificar o corpo da requisição

//     if (typeof studentId !== "string" || studentId.length === 0) {
//       res.status(422).send("'studentId' deve ser uma string não vazia");
//       return;
//     }

//     if (typeof newAnnotation !== "string" || newAnnotation.length === 0) {
//       res.status(422).send("'annotation' deve ser uma string não vazia");
//       return;
//     }

//     const existingStudent = await BaseDatabase("students")
//       .where("id", studentId)
//       .first();

//     if (!existingStudent) {
//       res.status(404).send("Estudante não encontrado");
//       return;
//     }

//     // Inserir a nova anotação na tabela de anotações
//     const [annotationId] = await BaseDatabase("annotations").insert({
//       student_id: studentId,
//       teacher_id: existingStudent.teacher_id,
//       annotation: newAnnotation,
//     });

//     // Atualizar as anotações do estudante, mantendo as existentes
//     const updatedAnnotations = existingStudent.annotations
//       ? [
//           ...existingStudent.annotations,
//           { id: annotationId, annotation: newAnnotation },
//         ]
//       : [{ id: annotationId, annotation: newAnnotation }];

//     await BaseDatabase("students")
//       .where("id", studentId)
//       .update({
//         annotations: JSON.stringify(updatedAnnotations),
//       });

//     res.status(200).send("Nova anotação adicionada com sucesso");
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Erro inesperado");
//   }
// });
