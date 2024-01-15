
-- Table teacher (professor): Stores information about teachers.

CREATE TABLE teachers (
  id TEXT PRIMARY KEY UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
   email_verified BOOLEAN DEFAULT FALSE, 
  created_at TEXT DEFAULT (DATETIME()) NOT NULL,
  role TEXT NOT NULL, 
);
INSERT INTO teachers (id, name, email, password, role) VALUES ('t01', 'Professor Smith', 'prof.smith@example.com', 'password123', 'ADMIN');

-- Table students (alunos): Stores information about students, including a foreign key teacher_id that references the teacher table to indicate which teacher is associated with each student.
CREATE TABLE students (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone INTEGER,
  age INTEGER,
  notes TEXT DEFAULT '[Nenhuma nota]',
  annotations TEXT DEFAULT '[Nenhuma anotação]',
  photo BLOB DEFAULT '../../img/noImageFound.png',
  teacher_id TEXT NOT NULL,
  class_id TEXT NOT NULL,
  password TEXT NOT NULL,
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TEXT DEFAULT (DATETIME()) NOT NULL,
  role TEXT NOT NULL,
  email_sent BOOLEAN DEFAULT FALSE,  -- Nova coluna adicionada para rastrear se o e-mail foi enviado
  updated_at TEXT DEFAULT (DATETIME()) NOT NULL,
  FOREIGN KEY (teacher_id) REFERENCES teachers (id)  ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (class_id) REFERENCES classes (id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Table notes: Stores notes associated with students, with foreign keys student_id and teacher_id referencing the students and teachers tables, respectively.
CREATE TABLE notes (
  id TEXT PRIMARY KEY,
  student_id TEXT UNIQUE NOT NULL,
  teacher_id TEXT UNIQUE NOT NULL,
  note TEXT NOT NULL,  
  created_at TEXT DEFAULT (DATETIME()) NOT NULL,
  updated_at TEXT DEFAULT (DATETIME()) NOT NULL,
  FOREIGN KEY (teacher_id) REFERENCES teachers (id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (student_id) REFERENCES students (id) ON DELETE CASCADE ON UPDATE CASCADE
);
-- Table annotations: Stores annotations associated with students, with foreign keys student_id and teacher_id referencing the students and teachers tables, respectively.

CREATE TABLE annotations (
  id TEXT PRIMARY KEY NOT NULL,
  student_id TEXT UNIQUE NOT NULL,
  teacher_id TEXT  UNIQUE NOT NULL,
  annotation TEXT NOT NULL,
  created_at TEXT DEFAULT (DATETIME()) NOT NULL,
  updated_at TEXT DEFAULT (DATETIME()) NOT NULL,
  FOREIGN KEY (teacher_id) REFERENCES teachers (id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (student_id) REFERENCES students (id) ON DELETE CASCADE ON UPDATE CASCADE
);
-- Table teacher_student_relationship: Establishes a many-to-many relationship between teachers and students, allowing a teacher to have multiple students and a student to have multiple teachers.
CREATE TABLE teacher_student_relationship (
  teacher_id TEXT NOT NULL,
  student_id TEXT NOT NULL,
  PRIMARY KEY (teacher_id, student_id),
  FOREIGN KEY (teacher_id) REFERENCES teachers (id)ON DELETE CASCADE ON UPDATE CASCADE ,
  FOREIGN KEY (student_id) REFERENCES students (id) ON DELETE CASCADE ON UPDATE CASCADE
);
-- Table class: Represents classes or lists of students associated with a teacher.
CREATE TABLE classes (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  teacher_id TEXT NOT NULL,
  FOREIGN KEY (teacher_id) REFERENCES teachers (id)
);
CREATE TABLE student_class_relationship (
  student_id TEXT NOT NULL,
  class_id TEXT NOT NULL,
  PRIMARY KEY (student_id, class_id),
  FOREIGN KEY (student_id) REFERENCES students (id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (class_id) REFERENCES classes  (id) ON DELETE CASCADE ON UPDATE CASCADE
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
  class_id TEXT NOT NULL,
  password TEXT NOT NULL,
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TEXT DEFAULT (DATETIME()) NOT NULL,
  role TEXT NOT NULL,
  inactive_at TEXT DEFAULT (DATETIME()) NOT NULL,
  FOREIGN KEY (teacher_id) REFERENCES teachers (id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (class_id) REFERENCES classes (id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Table password_reset teachers
CREATE TABLE password_reset_teacher (
  id INTEGER PRIMARY KEY,
  user_id TEXT NOT NULL,
  token TEXT NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  FOREIGN KEY (user_id) REFERENCES teachers (id)ON DELETE CASCADE ON UPDATE CASCADE
);
 -- Table password_reset students
CREATE TABLE password_reset_students (
  id INTEGER PRIMARY KEY,
  user_id TEXT NOT NULL,
  token TEXT NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  FOREIGN KEY (user_id) REFERENCES students (id)ON DELETE CASCADE ON UPDATE CASCADE
);
 DROP TABLE password_reset_students; 

-- Insert values into the class table to represent different classes
INSERT INTO classes (id, name, teacher_id) VALUES
  ('c03', 'English Class', 't01'),
  ('c04', 'French Class', 't01');

-- Insert students with fictitious IDs 's01', 's02' and 's03', associated with teacher 't01'
INSERT INTO students (id, name, email, phone, age, notes, annotations, teacher_id, class_id, photo)
VALUES
  ('s01', 'Student A', 'studentA@example.com', 123456789, 20, '', '', 't01', 'c03', x'F1F2F3F4'),
  ('s02', 'Student B', 'studentB@example.com', 987654321, 22, '', '', 't01', 'c03', x'F5F6F7F8'),
  ('s03', 'Student C', 'studentC@example.com', 555666777, 25, '', '', 't01', 'c04', x'F9FAFBFC');
INSERT INTO students (id, name, email, phone, age, notes, annotations, teacher_id, class_id, photo)
VALUES
  ('s01', 'Student A', 'studentA@example.com', 123456789, 20, '', '', 't01', 'c03', x'F1F2F3F4'),
  
  ('s03', 'Student C', 'studentC@example.com', 555666777, 25, '', '', 't01', 'c04', x'F9FAFBFC');

-- Inserting teacher-student relationships
INSERT INTO professor_student_relationship (teacher_id, student_id) VALUES
  ('t01', 's01'),
  ('t01', 's02'),
  ('t01', 's03');

-- Insert grades associated with students
INSERT INTO notes (student_id, teacher_id, note) VALUES
  ('s01', 't01', 'Note 1 for Student A'),
  ('s02', 't01', 'Note 1 for Student B'),
  ('s03', 't01', 'Note 1 for Student C');
  -- Inserting annotations associated with students
-- Replace 't01' and 's01' with the teacher and student IDs, and provide the appropriate annotation text
INSERT INTO annotations (student_id, teacher_id, annotation) VALUES
  ('s01', 't01', 'Annotation 1 for Student A'),
  ('s02', 't01', 'Annotation 1 for Student B'),
  ('s03', 't01', 'Annotation 1 for Student C');

-- INSERT INTO chat (student_id, teacher_id, message) VALUES
--   ('s01', 't01', 'Hello Student A, how are you?'),
--   ('s02', 't01', 'Hi Student B, did you understand the lecture?'),
--   ('s03', 't01', 'Student C, please review the assignment.');

-- INSERT INTO calendar (teacher_id, day_of_week, start_time, end_time)
-- VALUES
--   ('t01', 1, '09:00:00', '12:00:00'), -- Segunda-feira, 9h às 12h
--   ('t01', 3, '14:00:00', '18:00:00'); -- Quarta-feira, 14h às 18h

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

