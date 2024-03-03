const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const Phone = require('./models/phone');
require('dotenv').config();

app.use(express.json());
app.use(express.static('dist'));
app.use(cors());

const errorHandler = (error, request, response, next) => {
  console.error(error.message);
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  }
  next(error);
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

app.get('/api/persons/:id', (request, response, next) => {
  Phone.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch(error => next(error));
});

app.get('/info', (request, response) => {
  Phone.countDocuments({}, (err, count) => {
    const time = new Date();
    const responseText = `<p>total persons in list ${count}</p><p> time ${time}</p>`;
    response.send(responseText);
  });
});

app.get('/api/persons', (request, response) => {
  Phone.find({})
    .then(persons => {
      response.json(persons);
    })
    .catch(error => next(error));
});

app.delete('/api/persons/:id', (request, response, next) => {
  Phone.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end();
    })
    .catch(error => next(error));
});

app.post('/api/persons', (request, response, next) => {
  const body = request.body;

  if (!body.name || body.name.length < 3 || !body.number || !/\d{2,3}-\d{7,}/.test(body.number)) {
    return response.status(400).json({ error: 'Name must be at least 3 characters long, number is missing, or number is invalid' });
  }

  Phone.findOne({ name: body.name })
    .then(existingPerson => {
      if (existingPerson) {
        return response.status(400).json({ error: 'Name already exists' });
      }

      const person = new Phone({
        name: body.name,
        number: body.number,
      });

      return person.save();
    })
    .then(savedPerson => {
      response.json(savedPerson);
    })
    .catch(error => next(error));
});


app.put('/api/persons/:id', (request, response, next) => {
  const id = request.params.id;
  const body = request.body;

  const updatedPerson = {
    number: body.number,
  };

  Phone.findByIdAndUpdate(id, updatedPerson, { new: true })
    .then(updated => {
      response.json(updated);
    })
    .catch(error => next(error));
});


app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
    