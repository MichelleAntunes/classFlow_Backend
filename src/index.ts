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
