import express from "express";
import { TeacherController } from "../controller/TeacherController";
import { TeacherBusiness } from "../business/TeacherBusiness";
import { TeacherDataBase } from "../database/TeacherDatabase";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";
import { HashManager } from "../services/HashManager";

export const teacherRouter = express.Router();

const teacherController = new TeacherController(
  new TeacherBusiness(
    new TeacherDataBase(),
    new IdGenerator(),
    new TokenManager(),
    new HashManager()
  )
);

teacherRouter.post("/signup", teacherController.signup);
teacherRouter.post("/login", teacherController.login);
teacherRouter.put("/resetPassword", teacherController.resetPassword);
teacherRouter.get("/teachers", teacherController.getTeachers);
