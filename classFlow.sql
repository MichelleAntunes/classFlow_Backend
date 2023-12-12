-- Active: 1702310954575@@127.0.0.1@3306

-- Table teacher (professor): Stores information about teachers.

CREATE TABLE teacher (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
);
DROP TABLE teacher; -- Exemple

-- Table students (alunos): Stores information about students, including a foreign key teacher_id that references the teacher table to indicate which teacher is associated with each student.
CREATE TABLE students (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone INTEGER,
  age INTEGER,
  notes TEXT,
  teacher_id TEXT  NOT NULL,
   photo BLOB,
  FOREIGN KEY (teacher_id) REFERENCES teacher (id)
 
);

DROP TABLE students;

-- Table professor_student_relationship: Establishes a many-to-many relationship between teachers and students, allowing a teacher to have multiple students and a student to have multiple teachers.
CREATE TABLE professor_student_relationship (
  teacher_id TEXT NOT NULL,
  student_id TEXT NOT NULL,
  PRIMARY KEY (teacher_id, student_id),
  FOREIGN KEY (teacher_id) REFERENCES teacher (id),
  FOREIGN KEY (student_id) REFERENCES students (id)
);

DROP TABLE professor_student_relationship; 
-- Table notes: Stores notes associated with students, with foreign keys student_id and teacher_id referencing the students and teachers tables, respectively.
CREATE TABLE notes (
  id INTEGER PRIMARY KEY,
  student_id INTEGER,
  teacher_id TEXT,
  note TEXT NOT NULL,
  FOREIGN KEY (student_id) REFERENCES students (id),
  FOREIGN KEY (teacher_id) REFERENCES teacher (id)
);

DROP TABLE notes; 

-- Table chat: Stores chat messages between teachers and students, with foreign keys student_id and teacher_id referencing the students and teachers tables, respectively.
CREATE TABLE chat (
  id INTEGER PRIMARY KEY,
  student_id INTEGER,
  teacher_id TEXT,
  message TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students (id),
  FOREIGN KEY (teacher_id) REFERENCES teacher (id)
);
DROP TABLE chat; 

INSERT INTO teacher (id, name, email, password) VALUES ('t01', 'Professor Smith', 'prof.smith@example.com', 'password123');

-- Inserir alunos com IDs fictícios 's01', 's02' e 's03', associados ao professor 't01'
INSERT INTO students (id, name, email, phone, age, notes, teacher_id, photo) VALUES
  ('s01', 'Student A', 'studentA@example.com', 123456789, 20, 'Note for Student A', 't01', x'F1F2F3F4'),
  ('s02', 'Student B', 'studentB@example.com', 987654321, 22, 'Note for Student B', 't01', x'F5F6F7F8'),
  ('s03', 'Student C', 'studentC@example.com', 555666777, 25, 'Note for Student C', 't01', x'F9FAFBFC');

-- Inserir relações professor-aluno
INSERT INTO professor_student_relationship (teacher_id, student_id) VALUES
  ('t01', 's01'),
  ('t01', 's02'),
  ('t01', 's03');

-- Inserir notas associadas aos alunos
INSERT INTO notes (student_id, teacher_id, note) VALUES
  ('s01', 't01', 'Note 1 for Student A'),
  ('s02', 't01', 'Note 1 for Student B'),
  ('s03', 't01', 'Note 1 for Student C');

-- Inserir mensagens de chat entre professor e alunos
INSERT INTO chat (student_id, teacher_id, message) VALUES
  ('s01', 't01', 'Hello Student A, how are you?'),
  ('s02', 't01', 'Hi Student B, did you understand the lecture?'),
  ('s03', 't01', 'Student C, please review the assignment.');

DROP TABLE students; -- Exemple

--Lista de Alunos do Professor:
-- Substitua 't01' pelo ID do professor logado
SELECT students.id, students.name
FROM students
JOIN professor_student_relationship ON students.id = professor_student_relationship.student_id
WHERE professor_student_relationship.teacher_id = 't01';

--Detalhes do Aluno Selecionado:
-- Substitua 't01' pelo ID do professor logado e 's01' pelo ID do aluno selecionado
SELECT students.name, students.phone, students.email, students.notes, students.photo
FROM students
JOIN professor_student_relationship ON students.id = professor_student_relationship.student_id
WHERE professor_student_relationship.teacher_id = 't01'
  AND students.id = 's01';


 --Incluir Novo Aluno:
 -- Substitua 't01' pelos dados do professor e forneça os valores apropriados para o novo aluno
INSERT INTO students (id, name, email, phone, age, notes, teacher_id)
VALUES ('s04', 'Novo Aluno', 'novo.aluno@example.com', 123456789, 20, 'Notas do Novo Aluno', 't01');

-- Substitua 't01' pelo ID do professor logado e forneça os novos valores apropriados
UPDATE teacher
SET name = 'Novo Nome',
    email = 'novo.email@example.com',
    password = 'nova_senha'
WHERE id = 't01';
