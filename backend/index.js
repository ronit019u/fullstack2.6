const http = require('http')
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
app.use(express.json())

app.use(express.static('dist'))
app.use(cors());


morgan.token('postData', (req) => {
  if(req.method === 'POST') {
    return JSON.stringify(req.body);
  }
  return '';
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postData', {
  stream: process.stdout,
}));

app.use(express.json());

let persons =  [
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


app.get('/api/persons', (request, response ) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    const time = new Date();
    const total = persons.length;

    const responseText = `<p>toal persons in list ${total}</p>
       <p> time ${time}</p>`

       response.send(responseText)

})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  let newPersons = persons.filter(person => person.id !== id)
  persons = newPersons    
  response.json(persons)
})

app.post('/api/persons', (request, response) => {
  const body = request.body;
  if(!body.name || !body.number) {
    return response.status(400).json({error: 'Name or number is missing'})
  }
  const newId = Math.floor(Math.random() * 10000)

  if(persons.some(person => person.name === body.name)) {
    return response.status(400).json({error: 'donot add same name'})
  }


   const newPerson = {
    name: body.name,
    number: body.number,
    id: newId,
  };
  persons.concat(newPerson)

  return response.json(newPerson);
})

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)