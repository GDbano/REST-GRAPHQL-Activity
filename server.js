const express = require("express");
const path = require("path");
const { buildSchema, graphql } = require("graphql");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

let students = [
  {
    id: "1",
    name: "John Doe",
    age: 20,
    email: "john.doe@example.com",
    course: "Computer Science",
    year: 2
  },
  {
    id: "2",
    name: "Jane Smith",
    age: 22,
    email: "jane.smith@example.com",
    course: "Mathematics",
    year: 3
  }
];

app.get("/api/students", (req, res) => {
  res.json(students);
});

app.get("/api/students/:id", (req, res) => {
  const student = students.find((s) => s.id === parseInt(req.params.id));
  if (!student) {
    return res.status(404).json({ error: "Student not found" });
  }
  res.json(student);
});

app.post("/api/students", (req, res) => { 
  const {
    name,
    age,
    email,
    course,
    year,
  } = req.body;

  if(!name || !age || !email || !course || !year) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const newStudent = {

    id: String(nextId++),
    name: name,
    age: age,
    email: email,
    course: course,
    year: year,
  };
  students.push(newStudent);

  res.status(201).json({
    message: "Student added successfully",
    data: newStudent,
  });

});

app.put("/api/students/:id", (req, res) => {
  const student = students.find((s) => s.id === req.params.id);

if(!student) {
  return res.status(404).json({ error: "Student not found" });
}

const {
  name,
  email,
  course,
  year,
} = req.body;

if(!name || !email) {
  return res.status(400).json({ error: "Name and email are required" });
}

student.name = name;
student.email = email;
student.course = course;
student.year = year ?? null;

res.json({
    message: "Student updated successfully",
    data: student
  });
});

app.patch("/api/students/:id", (req, res) => {
  const student = students.find((s) => s.id === req.params.id);

  if(!student) {
    return res.status(404).json({ error: "Student not found" });
  }

  if(req.body.name !== undefined) {
    student.name = req.body.name;
  }

  if(req.body.email !== undefined) {
    student.email = req.body.email;
  }

  if(req.body.course !== undefined) {
    student.course = req.body.course;
  }

  if(req.body.year !== undefined) {
    student.year = req.body.year;
  }

  res.json({
    message: "Student updated successfully",
    data: student
  });
});

app.delete("/api/students/:id", (req, res) => {
  const studentIndex = students.findIndex((s) => s.id === req.params.id);

  if(studentIndex === -1) {
    return res.status(404).json({ error: "Student not found" });
  }


  students.splice(studentIndex, 1);

  res.json({
    message: "Student deleted successfully"
  });
});


const schema = buildSchema(`
  type Student {
  id: ID
  name: String!
  age: Int!
  email: String!
  course: String!
  year: Int
  }

  type Query {
  students: [Student]
  student(id: ID!): Student
  }

`);

const rootValue = {
  students: () => students,
  student: ({ id }) => students.find((s) => s.id === id),
};




app.listen(PORT, () => {
  console.log(`Student portal demo running on http://localhost:${PORT}`);
  console.log(`REST: http://localhost:${PORT}/api/students`);
  console.log(`GraphQL: http://localhost:${PORT}/graphql`);
});