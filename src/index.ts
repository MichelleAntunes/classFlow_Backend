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

  res.status(201).send("Cadastro do novo aluno realizado com sucesso");
});

app.get("/students/:id", (req: Request, res: Response) => {
  //:id poderia ser qualquer outro filtro necessário
  const idToFind = req.params.id; // não precisamos forçar a tipagem aqui, porque todo path params é string

  const result = students.find((student) => student.id === idToFind);

  res.status(200).send(result);
  // .send('O estudante localizado foi: ${result} seu nome é ${result?.name}');
});

//edit student
app.put("/students/:id", (req: Request, res: Response) => {
  const idToEdit = req.params.id;

  const newId = req.body.id as string | undefined;
  const newName = req.body.name as string | undefined;
  const newEmail = req.body.email as string | undefined;
  const newAge = req.body.age as number | undefined;
  const newTelephone = req.body.telepfone as number | undefined;
  const newNotes = req.body.notes as string | undefined;

  const student = students.find((student) => student.id === idToEdit);

  if (student) {
    student.id = newId || student.id;
    student.name = newName || student.name;
    student.email = newEmail || student.email;
    student.age = newAge || student.age;
    student.telepfone = newTelephone || student.telepfone;
    student.notes = newNotes || student.notes;

    // quando o valor for um número, é possível que seja 0 (que também é falsy)
    // então para possibilitar que venha 0, podemos fazer um ternário
    // o isNaN é uma função que checa se o argumento é um número ou não
    // caso não seja um número o isNaN retorna true, caso contrário false
    // por isso mantemos o antigo (pet.age) no true e atualizamos no false
    student.age = isNaN(Number(newAge)) ? student.age : (newAge as number);
  }

  res.status(200).send("Atualização realizada com sucesso");
});

app.delete("/students/:id", (req: Request, res: Response) => {
  const idToDelete = req.params.id;

  const studentIndex = students.findIndex(
    (student) => student.id === idToDelete
  );

  if (studentIndex >= 0) {
    students.splice(studentIndex, 1);
  }

  res.status(200).send("Item deletado com sucesso");
});
