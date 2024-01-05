import express from "express";
import { StudentController } from "../controller/StudentController";
import { StudentBusiness } from "../business/StudentsBusiness";
import { StudentDatabase } from "../database/StudentDatabase";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";
import { HashManager } from "../services/HashManager";
import multer, { Multer } from "multer";

export const userRouter = express.Router();

const studentController = new StudentController(
  new StudentBusiness(
    new StudentDatabase(),
    new IdGenerator(),
    new TokenManager(),
    new HashManager()
  )
);
// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    // Extraction of the original file extension:
    const fileExtension = file.originalname.split(".")[1];

    // Creates a random code that will be the name of the file
    const newFileName = require("crypto").randomBytes(64).toString("hex");

    // Indicates the new file name:
    cb(null, `${newFileName}.${fileExtension}`);
  },
});
const upload: Multer = multer({ storage });

userRouter.get("/students", studentController.getStudents);
userRouter.post(
  "/students",
  upload.single("photo"),
  studentController.createStudent
);
userRouter.get("/students/:id", studentController.getStudentById);
userRouter.put("/students/:id", studentController.editStudentById);
userRouter.delete("/students/:id", studentController.delteStudentById);