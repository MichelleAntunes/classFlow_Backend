import express, { Request, Response } from "express";
import cors from "cors";
import { TStudents } from "./types";
import multer, { Multer } from "multer";
import { db } from "../src/database/knex";

const app = express();

app.use(express.json());
app.use(cors());

// Configuração de armazenamento
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    // Extração da extensão do arquivo original:
    const extensaoArquivo = file.originalname.split(".")[1];

    // Cria um código randômico que será o nome do arquivo
    const novoNomeArquivo = require("crypto").randomBytes(64).toString("hex");

    // Indica o novo nome do arquivo:
    cb(null, `${novoNomeArquivo}.${extensaoArquivo}`);
  },
});

const upload: Multer = multer({ storage });

app.listen(3003, () => {
  console.log("Servidor rodando na porta 3003");
});

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

// app.post("/students", async (req: Request, res: Response) => {
//   try {
//     const {
//       id,
//       name,
//       age,
//       email,
//       phone,
//       notes,
//       annotations,
//       teacher_id,
//       class_id,
//     } = req.body;

//     const photoData = req.file?.buffer; // Assumindo que você está usando multer ou outro middleware para upload de arquivo
//     const mimeType = req.file?.mimetype; // Assumindo que você está usando multer ou outro middleware para upload de arquivo

//     if (id !== undefined) {
//       if (typeof id !== "string" || id.length < 1) {
//         res.status(406); // status apropriado para método não aceitável
//         throw new Error(
//           "'id' deve ser uma string e ser maior que um caractere"
//         );
//       }
//     }
//     if (name !== undefined) {
//       if (typeof name !== "string") {
//         res.status(400);
//         throw new Error("'name' deve ser string");
//       }

//       if (name.length < 2) {
//         res.status(400);
//         throw new Error("'name' deve possuir pelo menos 2 caracteres");
//       }
//     }

//     if (age !== undefined) {
//       if (typeof age !== "number") {
//         res.status(406); // appropriate status for method not acceptable
//         throw new Error("'age' deve ser uma number");
//       }
//     }

//     if (email !== undefined) {
//       if (typeof email !== "string") {
//         res.status(406); // appropriate status for method not acceptable
//         throw new Error("'email' deve ser uma string");
//       }
//       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//       if (!emailRegex.test(email)) {
//         res.status(406); // appropriate status for method not acceptable
//         throw new Error("'newEmail' deve ser um email válido");
//       }
//     }

//     if (phone !== undefined) {
//       if (typeof phone !== "number") {
//         res.status(406); // appropriate status for method not acceptable
//         throw new Error("'phone' deve ser uma number");
//       }
//       const newTelephoneString: string = phone.toString();
//       const phoneRegex = /^(?:\+\d{1,4}\s?)?\d{6,14}$/;
//       // May or may not have a country prefix (country code) starting with + and followed by up to 4 digits.
//       // May or may not have a blank space after the country code.
//       // The phone number must have between 6 and 14 digits.

//       if (!phoneRegex.test(newTelephoneString)) {
//         res.status(406); // appropriate status for method not acceptable
//         throw new Error("'newTelephone' deve ser um número de telefone válido");
//       }
//     }
//     if (notes !== undefined) {
//       if (typeof notes !== "string") {
//         res.status(406); // appropriate status for method not acceptable
//         throw new Error("'notes' deve ser uma string");
//       }
//     }
//     if (annotations !== undefined) {
//       if (typeof annotations !== "string") {
//         res.status(406); // appropriate status for method not acceptable
//         throw new Error("'annotations' deve ser uma string");
//       }
//     }
//     if (teacher_id !== undefined) {
//       if (typeof teacher_id !== "string" || teacher_id.length < 1) {
//         res.status(406); // appropriate status for method not acceptable
//         throw new Error(
//           "'teacher_id' deve ser uma string e ser maior que um caractere"
//         );
//       }
//     }
//     if (class_id !== undefined) {
//       if (typeof class_id !== "string" || class_id.length < 1) {
//         res.status(406); // appropriate status for method not acceptable
//         throw new Error(
//           "'class_id' deve ser uma string e ser maior que um caractere"
//         );
//       }
//     }

//     const newStudent: TStudents = {
//       id,
//       name,
//       age,
//       email,
//       phone,
//       notes,
//       annotations,
//       photo: {
//         data: Buffer.from() ,
//         mimeType: "image/png" ||  "image/jpeg"
//       },
//       teacher_id,
//       class_id,
//     };
//     await db("students").insert(newStudent);
//     // students.push(newStudent);
//     res.status(201).send("Cadastro do novo aluno realizado com sucesso");
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

// app.post("/notes/:id/:teacher_id", async (req: Request, res: Response) => {
//   try {
//     const student_id = req.params.id;
//     const teacher_id = req.params.teacher_id;
//     const newNotes = req.body.notes as string;
//     const students = await db("students");

//     if (typeof student_id !== "string") {
//       res.status(406); // appropriate tatus for unacceptable method
//       throw new Error("'student_id' deve ser uma string");
//     }
//     if (typeof newNotes !== "string") {
//       res.status(406); // appropriate tatus for unacceptable method
//       throw new Error("'newNotes' deve ser uma string");
//     }
//     if (typeof teacher_id !== "string") {
//       res.status(406); // appropriate tatus for unacceptable method
//       throw new Error("'teacher_id' deve ser uma string");
//     }
//     const resultStudent = students.find((student) => student.id === student_id);

//     if (!resultStudent) {
//       res.status(404); // appropriate status for not found
//       throw new Error("Estudante não encontrado");
//     }

//     // if (resultStudent) {
//     //   resultStudent.notes = Array.isArray(resultStudent.notes)
//     //     ? resultStudent.notes
//     //     : [resultStudent.notes];
//     //   await db("students").push(newNotes);

//     // }
//     await db("notes").insert({
//       student_id,
//       teacher_id,
//       notes: newNotes,
//     });
//     res.status(200).send("Novo comentário adicionado comsucesso");
//   } catch (error) {
//     if (res.statusCode === 200) {
//       // if it arrives still worth 200 we know it was an unexpected mistake
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
