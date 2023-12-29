import express, { Request, Response } from "express";
import cors from "cors";
import { TImageData, TStudents } from "./types";
import multer, { Multer } from "multer";
import { BaseDatabase } from "../src/database/BaseDatabase";
import * as bcrypt from "bcrypt";
import { TNote } from "./types";
import { TAnnotation } from "./types";
import { StudentDatabase } from "../src/database/StudentDatabase";
import { StudentController } from "./controller/StudentController";

const app = express();

app.use(express.json());
app.use(cors());

app.listen(3003, () => {
  console.log("Servidor rodando na porta 3003");
});

const studentController = new StudentController();

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
    const fileExtension = file.originalname.split(".")[1];

    // Creates a random code that will be the name of the file
    const newFileName = require("crypto").randomBytes(64).toString("hex");

    // Indicates the new file name:
    cb(null, `${newFileName}.${fileExtension}`);
  },
});
const upload: Multer = multer({ storage });

app.get("/students", studentController.getStudents);
app.post("/students", upload.single("photo"), studentController.createStudent);
app.get("/students/:id", studentController.getStudentById);
app.put("/students/:id", studentController.editStudentById);
app.delete("/students/:id", studentController.delteStudentById);
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
// app.get("/notes", async (req: Request, res: Response) => {
//   try {
//     // Retrieves all notes from the database
//     const allNotes = await db("notes");

//     // Returns a list of all notes
//     res.status(200).json(allNotes);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Erro inesperado");
//   }
// });
//app.get("/notes/:studentId", async (req: Request, res: Response) => {
//   try {
//     const studentId = req.params.studentId;

//     // Checks if studentId is a non-empty string
//     if (typeof studentId !== "string" || studentId.length === 0) {
//       res.status(422).send("'studentId' deve ser uma string não vazia");
//       return;
//     }

//     // Retrieves all grades from the database for a specific student
//     const studentNotes = await db("notes").where("student_id", studentId);

//     // Returns the list of grades for the specific student
//     res.status(200).json(studentNotes);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Erro inesperado");
//   }
// });
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
