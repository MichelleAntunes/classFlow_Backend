import express, { Request, Response } from "express";
import cors from "cors";
import { students } from "./dataBase";

const app = express();

app.use(express.json());
app.use(cors());

app.listen(3003, () => {
  console.log("Servidor rodando na porta 3003");
});

//Restfull - get of students
app.get("/students", (req: Request, res: Response) => {
  res.status(200).send(students);
});
