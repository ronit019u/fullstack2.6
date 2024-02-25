// App.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Notification from './components/Notification';
import './index.css';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('some error happened...')

  useEffect(() => {
    axios.get('http://localhost:3001/api/persons')
      .then(response => setPersons(response.data))
      .catch(error => console.error('Error fetching initial data', error));
  }, []);

  const addNewName = (event) => {
    event.preventDefault();

    const existingPerson = persons.find(person => person.name === newName);

    if (existingPerson) {
      const confirmUpdate = window.confirm(`${newName} is already in the phonebook. Do you want to update the number?`);

      if (confirmUpdate) {
        const updatedPerson = { ...existingPerson, number: newNumber };

        axios.put(`http://localhost:3001/api/persons/${existingPerson.id}`, updatedPerson)
          .then(response => {
            setPersons(persons.map(person => (person.id !== existingPerson.id ? person : response.data)));
            setErrorMessage(`${newName} is added`)
          })
          .catch(error => {
            setErrorMessage(`failed to update ${newName}`) 
            console.error('Error updating phone number', error);
          })     
           }
    } else {
      const newPerson = {
        name: newName,
        number: newNumber,
        id: persons.length + 1,
      };

      axios.post('http://localhost:3001/api/persons', newPerson)
        .then(response => setPersons([...persons, response.data]))
    
        .catch(error => {
          setErrorMessage(`Failed to add ${newPerson.name}`);
          console.error('Error adding new person', error);
        });
          
    }

    setNewName('');
    setNewNumber('');
  };

  const handleDelete = (id, name) => {
    const confirmDelete = window.confirm(`Delete ${name}?`);

    if (confirmDelete) {
      axios.delete(`http://localhost:3001/api/persons/${id}`)
        .then(() => setPersons(persons.filter(person => person.id !== id)))
        .catch(error =>{
           setErrorMessage(`not able to delete ${name}`)
          console.error('Error deleting entry', error);
        })
    }
  };

  const filterPerson = persons.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage}/>
      <div>
        <label>Search:</label>
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder='Type here'
        />
      </div>

      <h2>Add a new</h2>
      <form onSubmit={addNewName}>
        <div>
          name: <input value={newName} onChange={(e) => setNewName(e.target.value)} />
        </div>
        <div>
          phone-number: <input value={newNumber} onChange={(e) => setNewNumber(e.target.value)} />
        </div>
        <button type='submit'>add</button>
      </form>

      <h3>Numbers</h3>
      <ul>
        {filterPerson.map(person => (
          <li key={person.id}>
            {person.name} - {person.number}
            <button onClick={() => handleDelete(person.id, person.name)}>delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
  



//rtrtretetrrt