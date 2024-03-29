import axios from 'axios';

const baseUrl = 'https://phonebook-vydg.onrender.com/api/persons'

const getAll = () => {
  const importance = {
    important: true,
  }
  return axios.get(baseUrl).then(response => response.data.concat(importance));
};

const create = newPerson => {
  return axios.post(baseUrl, newPerson).then(response => response.data);
};

const update = (id, updatedPerson) => {
  return axios.put(`${baseUrl}/${id}`, updatedPerson).then(response => response.data);
};

const remove = id => {
  return axios.delete(`${baseUrl}/${id}`).then(response => response.data);
};

export default { getAll, create, update, remove };
