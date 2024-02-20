## ClassFlow Project

### Online Platform for Independent Teachers

## Table of Contents::

- <a href="#Objective"> Objective </a>
- <a href="#API Documentation"> API Documentation </a>
- <a href="#Database Structuring "> Database Structuring </a>
  <a href="#How to Run This Project?"> How to Run This Project? </a>
- <a href="#Technologies Used"> Technologies Used </a>
- <a href="#Testing"> Testing </a>
- <a href="# Next Steps"> Next Steps </a>
- <a href="#Authorship"> Authorship </a>

## Objective

I will develop an online platform to help independent teachers organize their daily classes with specific information for each student. The main functionalities include:

**Student Management:**

- Teachers can register new students, edit and delete students, move students from the "active" list to the "inactive" list, if necessary, while maintaining personalized grades and notes for each one.

## API Documentation

[API Documentation Link](https://documenter.getpostman.com/view/25825355/2sA2r3amFv)

Front-End Repository Link (https://github.com/MichelleAntunes/classFlow_Frontend.git)
Front-End Deploy Link (Under Development)

### Database Structuring

[ClassFlow Back-End Diagram](./img/diagram.png)

## How to run this project?

```bash
#Clone this repository
$ git clone https://github.com/MichelleAntunes/classFlow_Backend.git

#Access the project folder in your terminal
$ cd classFlow_Backend

# Install the dependencies
$ npm install

# Run the application
$ npm run dev

# The application will start on port 3003, access it through the browser: http://localhost:3003

# Use an API Client to make the requests

# Run all the unit tests
$ npm run test
```

## Technologies Used

### Front-End:

1. [JavaScript](https://www.javascript.com/)
2. [React] (https://react.dev/)
3. [useEffect] (https://legacy.reactjs.org/docs/hooks-effect.html)
4. [useState] (https://legacy.reactjs.org/docs/hooks-state.html)
5. [React Router] (https://reactrouter.com/en/main)
6. [Custom Hooks] (https://legacy.reactjs.org/docs/hooks-custom.html)
7. [Context] (https://legacy.reactjs.org/docs/context.html)
8. [Tailwind CSS] (https://tailwindcss.com/)

### Back-End:

1. [Node.js](https://nodejs.org/en)
2. [TypeScript](https://www.typescriptlang.org/)
3. [ExpressJs](https://expressjs.com/)
4. [SQLite3 / SQL](https://sqlite.org/index.html)
5. [Knex](https://knexjs.org/)
6. [OOP](https://pt.wikipedia.org/wiki/Programa%C3%A7%C3%A3o_orientada_a_objetos)
7. [Layered Architecture](https://pt.wikipedia.org/wiki/Arquitetura_multicamada)
8. [UUID generation](https://pt.wikipedia.org/wiki/Identificador_%C3%BAnico_universal)
9. [Hash generation](https://pt.wikipedia.org/wiki/Fun%C3%A7%C3%A3o_hash_criptogr%C3%A1fica)
10. [Authentication and authorization](https://pt.wikipedia.org/wiki/Autoriza%C3%A7%C3%A3o)
11. [Routing](https://acervolima.com/roteamento-em-node-js/)
12. [Postman](https://www.postman.com/)

### Testing

All endpoints have been tested and approved using the Postman platform. Documentation link:

https://documenter.getpostman.com/view/25825355/2sA2r3amFv

Automated testing is also being carried out using Jest.
The main focus of automated testing in this project is the Business layer, as this is where all the platform's business rules are located.
Currently (Feb/2024): TeacherBusiness Automated Tests 100%

### Next steps

1 - **Class calendar:**

- A calendar allows teachers to view and manage the class hours occupied and available in different periods (daily, monthly, yearly).

2 - **Communication between students and teachers:**

- Students receive an access link when they register, which allows them to view their attendance history, grades and use a chat feature to interact with the teacher.

3 - **Automated testing**

- Perform tests on the entire Business layer, including teachers, students and inactive students.

### Authorship

Michelle Antunes, maio/2023.
<br>

<kbd>[Linkedin](www.linkedin.com/in/michelle-antunes-868b24156)</kbd>
<br>
Email: miichelleantunes@outlook.com

### Project status

In process. ⏳
