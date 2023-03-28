import express from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3000;
const persons = JSON.parse(fs.readFileSync(`${__dirname}/person.json`));

app.use(express.json());

app.get("/person", (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      persons: persons,
    },
  });
});

app.get("/person/:id", (req, res) => {
  const id = req.params.id * 1;
  const person = persons.find((e) => e.id === id);

  if (!person) {
    res.status(404).json({
      status: "success",
      message: `person with id ${id} doesn't exist`,
    });
  }

  res.status(200).json({
    status: "success",
    data: {
      person,
    },
  });
});

app.post("/person", (req, res) => {
  const newId = persons.length + 1;
  const newPerson = Object.assign({ _id: newId }, req.body);

  if (req.body.age === "" || req.body.eyeColor === "" || req.body.name === "" || req.body.gender === "" || req.body.phone === "") {
    res.status(401).json({
      status: "success",
      message: "the body must be filled",
    });
  } else if (req.body.name.length < 5) {
    res.status(401).json({
      status: "success",
      message: "name must be at least 5 characters",
    });
  } else if (req.body.age < 17) {
    res.status(401).json({
      status: "success",
      message: "age must be over 17",
    });
  } else if (req.body.gender !== "male" && req.body.gender !== "female") {
    res.status(401).json({
      status: "success",
      message: "please input a valid gender",
    });
  } else {
    persons.push(newPerson);
    fs.writeFile(`${__dirname}/person.json`, JSON.stringify(persons), () => {
      res.status(200).json({
        status: "success",
        data: {
          person: newPerson,
        },
      });
    });
  }
});

app.put("/person/:id", (req, res) => {
  const id = req.params.id * 1;
  const index = persons.findIndex((element) => element.id === id);

  if (index === -1) {
    res.status(404).json({
      status: "success",
      message: `person with id ${id} doesn't exist`,
    });
  } else if (req.body.age === "" || req.body.eyeColor === "" || req.body.name === "" || req.body.gender === "" || req.body.phone === "") {
    res.status(401).json({
      status: "success",
      message: "the body must be filled",
    });
  } else if (req.body.name.length < 5) {
    res.status(401).json({
      status: "success",
      message: "name must be at least 5 characters",
    });
  } else if (req.body.age < 17) {
    res.status(401).json({
      status: "success",
      message: "age must be over 17",
    });
  } else if (req.body.gender !== "male" && req.body.gender !== "female") {
    res.status(401).json({
      status: "success",
      message: "please input a valid gender",
    });
  } else {
    req.body.id = id;
    persons[index] = req.body;
    fs.writeFile(`${__dirname}/person.json`, JSON.stringify(persons), () => {
      res.status(200).json({
        status: "success",
        data: {
          persons: persons[index],
        },
      });
    });
  }
});

app.delete("/person/:id", (req, res) => {
  const id = req.params.id * 1;
  const index = persons.findIndex((element) => element.id === id);

  if (index === -1) {
    res.status(404).json({
      status: "success",
      message: `person with id ${id} doesn't exist`,
    });
  } else {
    persons.splice(index, 1);
  }

  fs.writeFile(`${__dirname}/person.json`, JSON.stringify(persons), () => {
    res.status(200).json({
      status: "success",
      message: `person with id ${id} has been deleted`,
    });
  });
});

app.listen(PORT, "localhost", () => {
  console.log(`server listening on ${PORT}`);
});
