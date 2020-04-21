const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require('cors')

app.use(express.static('build'))
app.use(cors())
app.use(express.json());
morgan.token("data", (req, res) => {
  return JSON.stringify(req.body);
});

const log = () => morgan(':method :url :status :res[content-length] :response-time :data');
app.use(log()); 

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1,
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2,
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3,
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4,
  },
];

app.get("/", (request, response) => {
  response.send("<h1>Phonebook Backend</h1>");
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.get("/info", (request, response) => {
  const date = new Date();
  response.send(
    `<p>Phonebook has info for ${persons.length} people </p> ${date}`
  );
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);
  res.status(204).end();
});

const generateId = () => {
  const id = Math.round(Math.random() * 1000000000);
  return id;
};

const nameCheck = (name) => {
  // console.log(name);
  const v = persons.filter(
    (person) => person.name.toLowerCase() === name.toLowerCase()
  );
  return v.length == 0 ? true : false;
};

// app.put('/api/persons/:id')

app.post("/api/persons", (req, res) => {
  const body = req.body;
  if (
    body.name === undefined ||
    body.name === "" ||
    body.number == undefined ||
    body.number === ""
  ) {
    res.status(400).json({
      error: "name or number missing",
    });
  } else if (!nameCheck(body.name)) {
    res.status(400).json({
      error: "name must be unique",
    });
  } else {
    const person = {
      name: body.name,
      number: body.number,
      id: generateId(),
    };
    persons = persons.concat(person);

    res.json(persons)
  }
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
