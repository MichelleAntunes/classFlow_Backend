import express from "express";

import { StudentDatabase } from "../database/StudentDatabase";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";

import { InactiveStudentBusiness } from "../business/InactiveStudents";
import { InactiveStudentController } from "../controller/InactiveStudentController";
import { InactiveStudentDatabase } from "../database/InactiveStudentDatabse";

export const inactiveStudentRouter = express.Router();

const inactiveStudentController = new InactiveStudentController(
  new InactiveStudentBusiness(
    new StudentDatabase(),
    new InactiveStudentDatabase(),
    new TokenManager()
  )
);
inactiveStudentRouter.use(express.json());

inactiveStudentRouter.get("/", inactiveStudentController.getInactiveStudents);
inactiveStudentRouter.put(
  "/moveStudentToInactive/:studentId",
  inactiveStudentController.moveStudentToInactive
);
inactiveStudentRouter.delete(
  "/:id",
  inactiveStudentController.deleteInactiveStudent
);
