import express, { Request, Response } from "express";
import cors from "cors";
import { TStudents } from "./types";
import multer, { Multer } from "multer";
import { db } from "../src/database/knex";
import validUrl from "valid-url";
import * as bcrypt from "bcrypt";

const app = express();

app.use(express.json());
app.use(cors());

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

//  Rota de login
app.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Verificar se o e-mail existe na base de dados
    const teacher = await db("teacher").where({ email }).first();

    if (!teacher) {
      res.status(401).send("Credenciais inválidas");
      return;
    }

    // Compare the supplied password with the stored password (using bcrypt)
    const passwordMatch = await bcrypt.compare(password, teacher.password);

    if (!passwordMatch) {
      res.status(401).send("Credenciais inválidas");
      return;
    }

    // Here you can generate an authentication token (JWT, for example) if you wish
    // Return the token or another success response
    res.status(200).send("Login bem-sucedido");
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro interno do servidor");
  }
});

// Rota para redefinir a senha (o professor deve estar autenticado)
//  app.post('/reset-password', async (req: Request, res: Response) => {
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
    const students = await db("students");

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

app.get("/inactivStudents", async (req: Request, res: Response) => {
  try {
    const nameToFind = req.query.name as string;
    const inactivStudents = await db("inactive_students");

    if (nameToFind) {
      const result: TStudents[] = inactivStudents.filter((inactivStudent) =>
        inactivStudent.name.toLowerCase().includes(nameToFind.toLowerCase())
      );

      if (result.length === 0) {
        res.status(404); // Appropriate status for not found
        throw new Error("Estudante inativo não encontrado");
      }

      res.status(200).send(result);
    } else {
      res.status(200).send(inactivStudents);
    }
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

      await db("students").insert(newStudent);
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
    const students = await db("students");
    if (typeof idToFind !== "string") {
      res.status(406); // appropriate status for method not acceptable
      throw new Error("'idToFind' deve ser uma string");
    }

    const result = students.find((student) => student.id === idToFind);

    if (!result) {
      res.status(404); // appropriate status for not found
      throw new Error("Estudante não encontrado");
    }
    res.status(200).send(result);
    // .send('O estudante localizado foi: ${result} seu nome é ${result?.name}');
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
// app.put("/students/:id", (req: Request, res: Response) => {
//   try {
//     const idToEdit = req.params.id;

//     if (typeof idToEdit !== "string") {
//       res.status(406); // status apropriado para método não aceitável
//       throw new Error("'id' deve ser uma string");
//     }

//     const student = students.find((student) => student.id === idToEdit);

//     if (!student) {
//       res.status(404); // status apropriado para não encontrado
//       throw new Error("Estudante não encontrado");
//     }

//     const newId = req.body.id as string | undefined;
//     const newName = req.body.name as string | undefined;
//     const newEmail = req.body.email as string | undefined;
//     const newAge = req.body.age as number | undefined;
//     const newTelephone = req.body.telephone as number | undefined;
//     const newNotes = req.body.notes as string[] | undefined;

//     if (newId !== undefined) {
//       if (typeof newId !== "string" || newId.length < 1) {
//         res.status(406); // status apropriado para método não aceitável
//         throw new Error(
//           "'newId' deve ser uma string e ter pelo menos um caractere"
//         );
//       }
//     }

//     if (newName !== undefined) {
//       if (typeof newName !== "string" || newName.length < 2) {
//         res.status(406); // status apropriado para método não aceitável
//         throw new Error(
//           "'newName' deve ser uma string e ter pelo menos dois caracteres"
//         );
//       }
//     }

//     if (newEmail !== undefined) {
//       if (typeof newEmail !== "string") {
//         res.status(406); // status apropriado para método não aceitável
//         throw new Error("'newEmail' deve ser uma string");
//       }

//       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//       if (!emailRegex.test(newEmail)) {
//         res.status(406); // status apropriado para método não aceitável
//         throw new Error("'newEmail' deve ser um email válido");
//       }
//     }
//     if (newAge !== undefined) {
//       if (typeof newAge !== "number") {
//         res.status(406); // status apropriado para método não aceitável
//         throw new Error("'newAge' deve ser um número");
//       }
//     }

//     if (newTelephone !== undefined) {
//       if (typeof newTelephone !== "number") {
//         res.status(406); // status apropriado para método não aceitável
//         throw new Error("'newTelephone' deve ser um número");
//       }

//       const newTelephoneString: string = newTelephone.toString();
//       const phoneRegex = /^(?:\+\d{1,4}\s?)?\d{6,14}$/;

//       if (!phoneRegex.test(newTelephoneString)) {
//         res.status(406); // status apropriado para método não aceitável
//         throw new Error("'newTelephone' deve ser um número de telefone válido");
//       }
//     }

//     if (newNotes !== undefined) {
//       if (typeof newNotes !== "string") {
//         res.status(406); // status apropriado para método não aceitável
//         throw new Error("'newNotes' deve ser uma string");
//       }
//     }

//     res.status(200).send("Atualização realizada com sucesso");
//   } catch (error) {
//     if (res.statusCode === 200) {
//       // se chegar ainda valendo 200 sabemos que foi um erro inesperado
//       res.status(500); // definimos 500 porque é algo que o servidor não previu
//     }
//     // adicionamos um fluxo de validação do parâmetro 'error'
//     if (error instanceof Error) {
//       res.send(error.message);
//     } else {
//       res.send("Erro inesperado");
//     }
//   }
// });

app.delete("/students/:id", async (req: Request, res: Response) => {
  try {
    const students = await db("students");
    const idToDelete = req.params.id;
    const [student] = await db("students").where({ id: idToDelete });

    if (typeof idToDelete !== "string") {
      res.status(406); // appropriate status for method not acceptable
      throw new Error("'idToDelete' deve ser uma string");
    }

    const studentIndex = students.findIndex(
      (student) => student.id === idToDelete
    );

    if (studentIndex === -1) {
      res.status(404); // appropriate status for not found
      throw new Error("Estudante não encontrado");
    }
    if (!student) {
      res.status(404);
      throw new Error("'id' não encontrada");
    }

    await db("students").del().where({ id: idToDelete });
    // students.splice(studentIndex, 1);
    // res.status(204).send(); esse erro não permite mensagem
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
app.delete("/inactivStudents/:id", async (req: Request, res: Response) => {
  try {
    const inactivStudents = await db("inactive_students");
    const idToDelete = req.params.id;
    const [inactivStudent] = await db("inactive_students").where({
      id: idToDelete,
    });

    if (typeof idToDelete !== "string") {
      res.status(406); // appropriate status for method not acceptable
      throw new Error("'idToDelete' deve ser uma string");
    }

    const studentIndex = inactivStudents.findIndex(
      (inactivStudent) => inactivStudent.id === idToDelete
    );

    if (studentIndex === -1) {
      res.status(404); // appropriate status for not found
      throw new Error("Estudante não encontrado");
    }
    if (!inactivStudent) {
      res.status(404);
      throw new Error("'id' não encontrada");
    }

    await db("inactive_students").del().where({ id: idToDelete });
    // students.splice(studentIndex, 1);
    // res.status(204).send(); esse erro não permite mensagem
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
// app.post("/notes/:id", async (req: Request, res: Response) => {
//   try {
//     const studentId = req.params.id;
//     const { note } = req.body;

//     if (typeof studentId !== "string" || studentId.length === 0) {
//       res.status(422).send("'studentId' deve ser uma string não vazia");
//       return;
//     }

//     if (typeof note !== "string" || note.length === 0) {
//       res.status(422).send("'note' deve ser uma string não vazia");
//       return;
//     }

//     // Verifica se o aluno existe
//     const existingStudent = await db("students").where("id", studentId).first();

//     if (!existingStudent) {
//       res.status(404).send("Estudante não encontrado");
//       return;
//     }

//     // Atualiza a nota e adiciona a nova nota
//     const updatedNotes = existingStudent.notes
//       ? `${existingStudent.notes}\n${note}`
//       : note;

//     // Atualiza o campo notes do estudante
//     await db("students").where("id", studentId).update({
//       notes: updatedNotes,
//     });

//     // Insere a nota na tabela notes
//     await db("notes").insert({
//       student_id: studentId,
//       teacher_id: existingStudent.teacher_id,
//       note: note,
//     });

//     res.status(200).send("Nova nota adicionada com sucesso");
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Erro inesperado");
//   }
// });
