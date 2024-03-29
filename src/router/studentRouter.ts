import express from "express";
import { StudentController } from "../controller/StudentController";
import { StudentBusiness } from "../business/StudentsBusiness";
import { StudentDatabase } from "../database/StudentDatabase";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";
import multer, { Multer } from "multer";

export const studentRouter = express.Router();

const studentController = new StudentController(
  new StudentBusiness(
    new StudentDatabase(),
    new IdGenerator(),
    new TokenManager()
  )
);
studentRouter.use(express.json());

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
//Students
studentRouter.post(
  "/create",
  upload.single("photo"),
  studentController.createStudent
);
studentRouter.get("/", studentController.getStudents);
studentRouter.put("/:id", studentController.editStudent);
studentRouter.delete("/:id", studentController.deleteStudent);
//Notes
studentRouter.put("/note/:studentId", studentController.createNotesByStudentId);
studentRouter.delete("/note/:id", studentController.deleteNotesByNoteId);
studentRouter.put("/noteEdit/:noteid", studentController.editNoteByNoteId);
//Anotations
studentRouter.put(
  "/annotation/:studentId",
  studentController.createAnnotationByStudentId
);
studentRouter.delete(
  "/annotation/:id",
  studentController.deleteAnnotationsByAnnotationId
);
studentRouter.put(
  "/annotationEdit/:annotationId",
  studentController.editAnnotationByAnnotationId
);
