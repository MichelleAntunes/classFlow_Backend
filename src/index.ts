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

//Restfull - get of students
// app.get("/students", (req: Request, res: Response) => {
//   res.status(200).send(students);
// });

//
app.get("/students", (req: Request, res: Response) => {
  const nameToFind = req.query.name as string;

  if (nameToFind) {
    const result: TStudents[] = students.filter((student) =>
      student.name.toLowerCase().includes(nameToFind.toLowerCase())
    );
    res.status(200).send(result);
  } else {
    res.status(200).send(students);
  }
});

app.post("/students", (req: Request, res: Response) => {
  const id = req.body.id as string;
  const name = req.body.name as string;
  const age = req.body.age as number;
  const email = req.body.email as string;
  const telepfone = req.body.telepfone as number;
  const notes = req.body.notes as string;

  const newStudent: TStudents = {
    id,
    name,
    age,
    email,
    telepfone,
    notes,
  };

  students.push(newStudent);

  res.status(201).send("Cadastro realizado com sucesso");
});
