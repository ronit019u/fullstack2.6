const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const Phone = require('./models/phone');

app.use(express.json());
require('dotenv').config();
app.use(express.static('dist'));
app.use(cors());

morgan.token('postData', (req) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body);
  }
  return '';
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postData', {
  stream: process.stdout,
}));

let persons = [
  {
    "id": 1,
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": 2,
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": 3,
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": 4,
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
]

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const phone = persons.find(person => person.id === id);
  if (phone) {
    response.json(phone);
  } else {
    response.status(404).json({ error: 'Phone not found' });
  }
});

app.get('/info', (request, response) => {
  const time = new Date();
  const total = persons.length;

  const responseText = `<p>toal persons in list ${total}</p>
       <p> time ${time}</p>`

  response.send(responseText)
})

app.get('/api/persons', (request, response) => {
  response.json(persons);
});


app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  let newPersons = persons.filter(person => person.id !== id)
  persons = newPersons
  response.json(persons)
})

app.post('/api/persons', (request, response) => {
  const body = request.body;
  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'Name or number is missing' })
  }

  if (persons.some(person => person.name === body.name)) {
    return response.status(400).json({ error: 'Don\'t add same name' })
  }

  const person = new Phone({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPhone => {
    response.json(savedPhone)
  })
})

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
