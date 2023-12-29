-- Active: 1702490604086@@127.0.0.1@3306


-- Table teacher (professor): Stores information about teachers.

CREATE TABLE teacher (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
);
-- DROP TABLE teacher; 

-- Table class: Represents classes or lists of students associated with a teacher.
CREATE TABLE class (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  teacher_id TEXT NOT NULL,
  FOREIGN KEY (teacher_id) REFERENCES teacher (id)
);
-- DROP TABLE class;

-- Table students (alunos): Stores information about students, including a foreign key teacher_id that references the teacher table to indicate which teacher is associated with each student.
CREATE TABLE students (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone INTEGER,
  age INTEGER,
  notes TEXT DEFAULT '', --Starts as an empty string if no value is supplied
  annotations TEXT DEFAULT '', --Starts as an empty string if no value is supplied
  photo BLOB DEFAULT x'F1F2F3F4', -- Default value for a dummy image (change as necessary)
  teacher_id TEXT NOT NULL,
    class_id TEXT NOT NULL,
    
  FOREIGN KEY (class_id) REFERENCES class (id),
  FOREIGN KEY (teacher_id) REFERENCES teacher (id)
  
);
-- CREATE TABLE students (
--   id TEXT PRIMARY KEY NOT NULL,
--   name TEXT NOT NULL,
--   email TEXT UNIQUE NOT NULL,
--   phone INTEGER,
--   age INTEGER,
--   notes JSON DEFAULT '[]', -- JSON array as the default value
--   annotations JSON DEFAULT '[]', -- JSON array as the default value
--   photo BLOB DEFAULT x'F1F2F3F4',
--   teacher_id TEXT NOT NULL,
--   class_id TEXT NOT NULL,
--   FOREIGN KEY (class_id) REFERENCES class (id),
--   FOREIGN KEY (teacher_id) REFERENCES teacher (id)
-- );

-- Table professor_student_relationship: Establishes a many-to-many relationship between teachers and students, allowing a teacher to have multiple students and a student to have multiple teachers.
CREATE TABLE professor_student_relationship (
      teacher_id TEXT NOT NULL,
  student_id TEXT NOT NULL,
  PRIMARY KEY (teacher_id, student_id),
  FOREIGN KEY (teacher_id) REFERENCES teacher (id),
  FOREIGN KEY (student_id) REFERENCES students (id) ON DELETE CASCADE
);
-- DROP TABLE professor_student_relationship; 

-- Table notes: Stores notes associated with students, with foreign keys student_id and teacher_id referencing the students and teachers tables, respectively.
CREATE TABLE notes (
  id INTEGER PRIMARY KEY,
  student_id TEXT,
  teacher_id TEXT,
  note TEXT NOT NULL,  
  FOREIGN KEY (teacher_id) REFERENCES teacher (id),
  FOREIGN KEY (student_id) REFERENCES students (id) ON DELETE CASCADE
);
-- DROP TABLE notes; 

-- Table chat: Stores chat messages between teachers and students, with foreign keys student_id and teacher_id referencing the students and teachers tables, respectively.
CREATE TABLE chat (
  id INTEGER PRIMARY KEY,
  student_id TEXT,
  teacher_id TEXT,
  message TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
  FOREIGN KEY (teacher_id) REFERENCES teacher (id),
  FOREIGN KEY (student_id) REFERENCES students (id) ON DELETE CASCADE
);
-- DROP TABLE chat; 

-- Table inactive_students: Stores information about inactive students.
CREATE TABLE inactive_students (
  id TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT  NOT NULL,
  phone INTEGER,
  age INTEGER,
  notes TEXT DEFAULT '', --Starts as an empty string if no value is supplied
  annotations TEXT DEFAULT '', --Starts as an empty string if no value is supplied
  photo BLOB DEFAULT x'F1F2F3F4', -- Default value for a dummy image (change as necessary)
  teacher_id TEXT NOT NULL,
    class_id TEXT NOT NULL,
      FOREIGN KEY (class_id) REFERENCES class (id),
  FOREIGN KEY (teacher_id) REFERENCES teacher (id)
);
-- DROP TABLE inactive_students; 

-- Table to store the calendar with the teacher's availability
CREATE TABLE calendar (
  id INTEGER PRIMARY KEY,
  teacher_id TEXT NOT NULL,
  day_of_week INTEGER NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  FOREIGN KEY (teacher_id) REFERENCES teacher (id)
);
-- DROP TABLE calendar; 

-- Table password_reset teachers
CREATE TABLE password_reset_teacher (
  id INTEGER PRIMARY KEY,
  user_id TEXT NOT NULL,
  token TEXT NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  FOREIGN KEY (user_id) REFERENCES teacher (id) ON DELETE CASCADE
);
--  DROP TABLE password_reset_teacher; 

 -- Table password_reset students
CREATE TABLE password_reset_students (
  id INTEGER PRIMARY KEY,
  user_id TEXT NOT NULL,
  token TEXT NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  FOREIGN KEY (user_id) REFERENCES students (id) ON DELETE CASCADE
);
--  DROP TABLE password_reset_students; 

-- Table annotations: Stores annotations associated with students, with foreign keys student_id and teacher_id referencing the students and teachers tables, respectively.
CREATE TABLE annotations (
  id INTEGER PRIMARY KEY,
  student_id TEXT,
  teacher_id TEXT,
  annotation TEXT NOT NULL,
  FOREIGN KEY (student_id) REFERENCES students (id) ON DELETE CASCADE,
  FOREIGN KEY (teacher_id) REFERENCES teacher (id)
);
-- DROP TABLE annotations; 

INSERT INTO teacher (id, name, email, password) VALUES ('t01', 'Professor Smith', 'prof.smith@example.com', 'password123');

 -- Insert values into the class table to represent different classes
INSERT INTO class (id, name, teacher_id) VALUES
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
  SELECT * FROM notes;

SELECT * FROM annotations;


  -- Inserting annotations associated with students
-- Replace 't01' and 's01' with the teacher and student IDs, and provide the appropriate annotation text
INSERT INTO annotations (student_id, teacher_id, annotation) VALUES
  ('s01', 't01', 'Annotation 1 for Student A'),
  ('s02', 't01', 'Annotation 1 for Student B'),
  ('s03', 't01', 'Annotation 1 for Student C');

-- Insert chat messages between teacher and students
INSERT INTO chat (student_id, teacher_id, message) VALUES
  ('s01', 't01', 'Hello Student A, how are you?'),
  ('s02', 't01', 'Hi Student B, did you understand the lecture?'),
  ('s03', 't01', 'Student C, please review the assignment.');

-- Move student to the inactive students table
INSERT INTO inactive_students SELECT * FROM students WHERE id = 's01';

-- Now, delete the student from the students table
DELETE FROM students WHERE id = 's01';

SELECT * FROM students WHERE id = 's01';

-- Insert availability example for teacher 't01'
INSERT INTO calendar (teacher_id, day_of_week, start_time, end_time)
VALUES
  ('t01', 1, '09:00:00', '12:00:00'), -- Segunda-feira, 9h às 12h
  ('t01', 3, '14:00:00', '18:00:00'); -- Quarta-feira, 14h às 18h

--Teacher's Student List:
--Replace 't01' with the logged in teacher's ID
SELECT students.id, students.name
FROM students
JOIN professor_student_relationship ON students.id = professor_student_relationship.student_id
WHERE professor_student_relationship.teacher_id = 't01';

--Selected Student Details:
--Replace 't01' with the logged in teacher ID and 's01' with the selected student ID
SELECT students.name, students.phone, students.email, students.notes, students.photo
FROM students
JOIN professor_student_relationship ON students.id = professor_student_relationship.student_id
WHERE professor_student_relationship.teacher_id = 't01'
  AND students.id = 's01';


-- Replace 't01' with the ID of the logged-in teacher and provide the appropriate new values
UPDATE teacher
SET name = 'Novo Nome',
    email = 'novo.email@example.com',
    password = 'nova_senha'
WHERE id = 't01';

SELECT * FROM inactive_students; 
DELETE FROM inactive_students;


