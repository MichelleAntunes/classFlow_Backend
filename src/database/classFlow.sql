-- Active: 1705419633255@@127.0.0.1@5432

-- Table teacher (professor): Stores information about teachers.

CREATE TABLE teachers (
  id TEXT PRIMARY KEY UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,   
  created_at TEXT DEFAULT (DATETIME()) NOT NULL,
  photo BLOB DEFAULT '../img/noImg.jpg',
  role TEXT NOT NULL
);

-- Table students (alunos): Stores information about students, including a foreign key teacher_id that references the teacher table to indicate which teacher is associated with each student.
CREATE TABLE students (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone INTEGER,
  age INTEGER,  
  notes TEXT,
  annotations TEXT ,
  photo BLOB DEFAULT '../../img/noImageFound.png',
  teacher_id TEXT NOT NULL,
  created_at TEXT DEFAULT (DATETIME()) NOT NULL,
  role TEXT NOT NULL,
  updated_at TEXT DEFAULT (DATETIME()) NOT NULL,
  FOREIGN KEY (teacher_id) REFERENCES teachers (id)  ON DELETE CASCADE ON UPDATE CASCADE
  );
DROP TABLE students;
-- Table notes: Stores notes associated with students, with foreign keys student_id and teacher_id referencing the students and teachers tables, respectively.
CREATE TABLE notes (
  id TEXT PRIMARY KEY,
  student_id TEXT,
  teacher_id TEXT,
  notes TEXT,  
  created_at DATETIME,
  updated_at DATETIME,
  UNIQUE (teacher_id, student_id, id),
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (teacher_id) REFERENCES teachers(id)
);

DROP TABLE notes;
-- Table annotations: Stores annotations associated with students, with foreign keys student_id and teacher_id referencing the students and teachers tables, respectively.

CREATE TABLE annotations (
  id TEXT PRIMARY KEY NOT NULL,
  student_id TEXT ,
  teacher_id TEXT ,
  annotations TEXT NOT NULL,
  created_at TEXT DEFAULT (DATETIME()) NOT NULL,
  updated_at TEXT DEFAULT (DATETIME()) NOT NULL,
  FOREIGN KEY (teacher_id) REFERENCES teachers (id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (student_id) REFERENCES students (id) ON DELETE CASCADE ON UPDATE CASCADE
);
DROP TABLE annotations;
-- Table teacher_student_relationship: Establishes a many-to-many relationship between teachers and students, allowing a teacher to have multiple students and a student to have multiple teachers.
CREATE TABLE teacher_student_relationship (
  teacher_id TEXT NOT NULL,
  student_id TEXT NOT NULL,
  PRIMARY KEY (teacher_id, student_id),
  FOREIGN KEY (teacher_id) REFERENCES teachers (id)ON DELETE CASCADE ON UPDATE CASCADE ,
  FOREIGN KEY (student_id) REFERENCES students (id) ON DELETE CASCADE ON UPDATE CASCADE
);
-- Table inactive_students: Stores information about inactive students.
CREATE TABLE inactive_students (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone INTEGER,
  age INTEGER,
  notes TEXT DEFAULT '[Nenhuma nota]',
  annotations TEXT DEFAULT '[Nenhuma anotação]',
  photo BLOB DEFAULT '../../img/noImageFound.png',
  teacher_id TEXT NOT NULL,
  created_at TEXT DEFAULT (DATETIME()) NOT NULL,
  role TEXT NOT NULL,
  inactive_at TEXT DEFAULT (DATETIME()) NOT NULL,
  FOREIGN KEY (teacher_id) REFERENCES teachers (id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Table password_reset teachers
CREATE TABLE password_reset_teacher (
  id INTEGER PRIMARY KEY,
  user_id TEXT NOT NULL,
  token TEXT NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  FOREIGN KEY (user_id) REFERENCES teachers (id)ON DELETE CASCADE ON UPDATE CASCADE
);

-- CREATE TABLE calendar (
--   id INTEGER PRIMARY KEY,
--   teacher_id TEXT NOT NULL,
--   day_of_week INTEGER NOT NULL,
--   start_time TIME NOT NULL,
--   end_time TIME NOT NULL,
--   FOREIGN KEY (teacher_id) REFERENCES teachers(id)
-- );
-- CREATE TABLE chat (
--   id TEXT PRIMARY KEY,
--   student_id TEXT,
--   teacher_id TEXT,
--   message TEXT NOT NULL,
--   timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
--   FOREIGN KEY (teacher_id) REFERENCES teachers (id),
--   FOREIGN KEY (student_id) REFERENCES students (id) ON DELETE CASCADE
-- ); DROP TABLE chat; 

-- CREATE TABLE classes (
--   id TEXT PRIMARY KEY NOT NULL,
--   name TEXT NOT NULL,
--   teacher_id TEXT NOT NULL,
--   FOREIGN KEY (teacher_id) REFERENCES teachers (id)
-- );

-- CREATE TABLE student_class_relationship (
--   student_id TEXT NOT NULL,
--   class_id TEXT NOT NULL,
--   PRIMARY KEY (student_id, class_id),
--   FOREIGN KEY (student_id) REFERENCES students (id) ON DELETE CASCADE ON UPDATE CASCADE,
--   FOREIGN KEY (class_id) REFERENCES classes  (id) ON DELETE CASCADE ON UPDATE CASCADE
-- );

