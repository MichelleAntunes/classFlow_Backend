-- Active: 1702310954575@@127.0.0.1@3306

-- Table teacher (professor): Stores information about teachers.

CREATE TABLE teacher (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
);

-- Table students (alunos): Stores information about students, including a foreign key teacher_id that references the teacher table to indicate which teacher is associated with each student.
CREATE TABLE students (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone INTEGER,
  age INTEGER,
  notes TEXT,
  teacher_id INTEGER,
  FOREIGN KEY (teacher_id) REFERENCES teacher (id)
);

-- Table professor_student_relationship: Establishes a many-to-many relationship between teachers and students, allowing a teacher to have multiple students and a student to have multiple teachers.
CREATE TABLE professor_student_relationship (
  teacher_id INTEGER,
  student_id INTEGER,
  PRIMARY KEY (teacher_id, student_id),
  FOREIGN KEY (teacher_id) REFERENCES teacher (id),
  FOREIGN KEY (student_id) REFERENCES students (id)
);

-- Table notes: Stores notes associated with students, with foreign keys student_id and teacher_id referencing the students and teachers tables, respectively.
CREATE TABLE notes (
  id INTEGER PRIMARY KEY,
  student_id INTEGER,
  teacher_id INTEGER,
  note TEXT NOT NULL,
  FOREIGN KEY (student_id) REFERENCES students (id),
  FOREIGN KEY (teacher_id) REFERENCES teacher (id)
);

-- Table chat: Stores chat messages between teachers and students, with foreign keys student_id and teacher_id referencing the students and teachers tables, respectively.
CREATE TABLE chat (
  id INTEGER PRIMARY KEY,
  student_id INTEGER,
  teacher_id INTEGER,
  message TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students (id),
  FOREIGN KEY (teacher_id) REFERENCES teacher (id)
);
