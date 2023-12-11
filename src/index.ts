import express, { Request, Response } from "express";
import cors from "cors";
import { students } from "./dataBase";
import { TStudents } from "./types";

const app = express();

app.use(express.json());
app.use(cors());

app.listen(3003, () => {
  console.log("Servidor rodando na porta 3003");
});

app.get("/students", (req: Request, res: Response) => {
  try {
    const nameToFind = req.query.name as string;

    if (nameToFind) {
      const result: TStudents[] = students.filter((student) =>
        student.name.toLowerCase().includes(nameToFind.toLowerCase())
      );

      if (result.length === 0) {
        res.status(404); // status apropriado para não encontrado
        throw new Error("Estudante não encontrado");
      }

      res.status(200).send(result);
    } else {
      res.status(200).send(students);
    }
  } catch (error) {
    if (res.statusCode === 200) {
      // se chegar ainda valendo 200 sabemos que foi um erro inesperado
      res.status(500); // definimos 500 porque é algo que o servidor não previu
    }
    // adicionamos um fluxo de validação do parâmetro 'error'
    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado");
    }
  }
});

app.post("/students", (req: Request, res: Response) => {
  try {
    const id = req.body.id as string;
    const name = req.body.name as string;
    const age = req.body.age as number;
    const email = req.body.email as string;
    const telepfone = req.body.telepfone as number;
    const notes = req.body.notes as string[];

    if (id !== undefined) {
      if (typeof id !== "string" || id.length < 1) {
        res.status(406); // status apropriado para método não aceitável
        throw new Error(
          "'id' deve ser uma string e ser maior que um caractere"
        );
      }
    }
    if (name !== undefined) {
      if (typeof name !== "string" || name.length < 2) {
        res.status(406); // status apropriado para método não aceitável
        throw new Error(
          "'name' deve ser uma string e ter mais de dois caracteres"
        );
      }
    }
    if (age !== undefined) {
      if (typeof age !== "number") {
        res.status(406); // status apropriado para método não aceitável
        throw new Error("'age' deve ser uma number");
      }
    }

    if (email !== undefined) {
      if (typeof email !== "string") {
        res.status(406); // status apropriado para método não aceitável
        throw new Error("'email' deve ser uma string");
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        res.status(406); // status apropriado para método não aceitável
        throw new Error("'newEmail' deve ser um email válido");
      }
    }

    if (telepfone !== undefined) {
      if (typeof telepfone !== "number") {
        res.status(406); // status apropriado para método não aceitável
        throw new Error("'telepfone' deve ser uma number");
      }
      const newTelephoneString: string = telepfone.toString();
      const phoneRegex = /^(?:\+\d{1,4}\s?)?\d{6,14}$/;
      //       Pode ou não ter um prefixo de país (código de país) começando com + e seguido por até 4 dígitos.
      // Pode ou não ter um espaço em branco após o código de país.
      // Deve ter de 6 a 14 dígitos no número de telefone.

      if (!phoneRegex.test(newTelephoneString)) {
        res.status(406); // status apropriado para método não aceitável
        throw new Error("'newTelephone' deve ser um número de telefone válido");
      }
    }
    if (notes !== undefined) {
      if (typeof notes !== "string") {
        res.status(406); // status apropriado para método não aceitável
        throw new Error("'notes' deve ser uma string");
      }
    }

    const newStudent: TStudents = {
      id,
      name,
      age,
      email,
      telepfone,
      notes,
    };

    students.push(newStudent);
    res.status(201).send("Cadastro do novo aluno realizado com sucesso");
  } catch (error) {
    if (res.statusCode === 200) {
      // se chegar ainda valendo 200 sabemos que foi um erro inesperado
      res.status(500); // definimos 500 porque é algo que o servidor não previu
    }
    // adicionamos um fluxo de validação do parâmetro 'error'
    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado");
    }
  }
});

app.get("/students/:id", (req: Request, res: Response) => {
  try {
    //:id poderia ser qualquer outro filtro necessário
    const idToFind = req.params.id; // não precisamos forçar a tipagem aqui, porque todo path params é string

    if (typeof idToFind !== "string") {
      res.status(406); // status apropriado para método não aceitável
      throw new Error("'idToFind' deve ser uma string");
    }

    const result = students.find((student) => student.id === idToFind);

    if (!result) {
      res.status(404); // status apropriado para não encontrado
      throw new Error("Estudante não encontrado");
    }
    res.status(200).send(result);
    // .send('O estudante localizado foi: ${result} seu nome é ${result?.name}');
  } catch (error) {
    if (res.statusCode === 200) {
      // se chegar ainda valendo 200 sabemos que foi um erro inesperado
      res.status(500); // definimos 500 porque é algo que o servidor não previu
    }
    // adicionamos um fluxo de validação do parâmetro 'error'
    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado");
    }
  }
});
//edit
app.put("/students/:id", (req: Request, res: Response) => {
  try {
    const idToEdit = req.params.id;

    if (typeof idToEdit !== "string") {
      res.status(406); // status apropriado para método não aceitável
      throw new Error("'id' deve ser uma string");
    }

    const student = students.find((student) => student.id === idToEdit);

    if (!student) {
      res.status(404); // status apropriado para não encontrado
      throw new Error("Estudante não encontrado");
    }

    const newId = req.body.id as string | undefined;
    const newName = req.body.name as string | undefined;
    const newEmail = req.body.email as string | undefined;
    const newAge = req.body.age as number | undefined;
    const newTelephone = req.body.telephone as number | undefined;
    const newNotes = req.body.notes as string[] | undefined;

    if (newId !== undefined) {
      if (typeof newId !== "string" || newId.length < 1) {
        res.status(406); // status apropriado para método não aceitável
        throw new Error(
          "'newId' deve ser uma string e ter pelo menos um caractere"
        );
      }
    }

    if (newName !== undefined) {
      if (typeof newName !== "string" || newName.length < 2) {
        res.status(406); // status apropriado para método não aceitável
        throw new Error(
          "'newName' deve ser uma string e ter pelo menos dois caracteres"
        );
      }
    }

    if (newEmail !== undefined) {
      if (typeof newEmail !== "string") {
        res.status(406); // status apropriado para método não aceitável
        throw new Error("'newEmail' deve ser uma string");
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(newEmail)) {
        res.status(406); // status apropriado para método não aceitável
        throw new Error("'newEmail' deve ser um email válido");
      }
    }
    if (newAge !== undefined) {
      if (typeof newAge !== "number") {
        res.status(406); // status apropriado para método não aceitável
        throw new Error("'newAge' deve ser um número");
      }
    }

    if (newTelephone !== undefined) {
      if (typeof newTelephone !== "number") {
        res.status(406); // status apropriado para método não aceitável
        throw new Error("'newTelephone' deve ser um número");
      }

      const newTelephoneString: string = newTelephone.toString();
      const phoneRegex = /^(?:\+\d{1,4}\s?)?\d{6,14}$/;

      if (!phoneRegex.test(newTelephoneString)) {
        res.status(406); // status apropriado para método não aceitável
        throw new Error("'newTelephone' deve ser um número de telefone válido");
      }
    }

    if (newNotes !== undefined) {
      if (typeof newNotes !== "string") {
        res.status(406); // status apropriado para método não aceitável
        throw new Error("'newNotes' deve ser uma string");
      }
    }

    res.status(200).send("Atualização realizada com sucesso");
  } catch (error) {
    if (res.statusCode === 200) {
      // se chegar ainda valendo 200 sabemos que foi um erro inesperado
      res.status(500); // definimos 500 porque é algo que o servidor não previu
    }
    // adicionamos um fluxo de validação do parâmetro 'error'
    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado");
    }
  }
});

app.delete("/students/:id", (req: Request, res: Response) => {
  try {
    const idToDelete = req.params.id;

    if (typeof idToDelete !== "string") {
      res.status(406); // status apropriado para método não aceitável
      throw new Error("'idToDelete' deve ser uma string");
    }

    const studentIndex = students.findIndex(
      (student) => student.id === idToDelete
    );

    if (studentIndex === -1) {
      res.status(404); // status apropriado para não encontrado
      throw new Error("Estudante não encontrado");
    }

    students.splice(studentIndex, 1);

    // res.status(204).send(); esse erro não permite mensagem
    res.status(200).send("Estudante deletado com sucesso.");
  } catch (error) {
    if (res.statusCode === 200) {
      // se chegar ainda valendo 200 sabemos que foi um erro inesperado
      res.status(500); // definimos 500 porque é algo que o servidor não previu
    }
    // adicionamos um fluxo de validação do parâmetro 'error'
    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado");
    }
  }
});

app.post("/notes/:id", (req: Request, res: Response) => {
  try {
    const idStudent = req.params.id;
    const newNotes = req.body.notes as string;

    if (typeof idStudent !== "string") {
      res.status(406); // status apropriado para método não aceitável
      throw new Error("'idStudent' deve ser uma string");
    }
    if (typeof newNotes !== "string") {
      res.status(406); // status apropriado para método não aceitável
      throw new Error("'newNotes' deve ser uma string");
    }

    const resultStudent = students.find((student) => student.id === idStudent);

    if (!resultStudent) {
      res.status(404); // status apropriado para não encontrado
      throw new Error("Estudante não encontrado");
    }

    if (resultStudent) {
      resultStudent.notes = Array.isArray(resultStudent.notes)
        ? resultStudent.notes
        : [resultStudent.notes];

      resultStudent.notes.push(newNotes);
    }
    // resultStudent.notes = Array.isArray(resultStudent.notes)
    //   ? [...resultStudent.notes, newNotes]
    //   : [newNotes];

    // resultStudent.notes = (Array.isArray(resultStudent.notes)
    // ? resultStudent.notes.concat(newNotes)
    // : [newNotes]) as string[];

    res.status(200).send("Novo comentário adicionado com sucesso");
  } catch (error) {
    if (res.statusCode === 200) {
      // se chegar ainda valendo 200 sabemos que foi um erro inesperado
      res.status(500); // definimos 500 porque é algo que o servidor não previu
    }
    // adicionamos um fluxo de validação do parâmetro 'error'
    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado");
    }
  }
});
