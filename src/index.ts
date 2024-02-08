import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { teacherRouter } from "./router/teacherRouter";
import { studentRouter } from "./router/studentRouter";
import { inactiveStudentRouter } from "./router/inactiveStudentRouter";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.listen(Number(process.env.PORT) || 3003, () => {
  console.log(`Servidor rodando na porta ${Number(process.env.PORT) || 3003}`);
});

app.use("/teachers", teacherRouter);
app.use("/students", studentRouter);
app.use("/inactiveStudent", inactiveStudentRouter);
