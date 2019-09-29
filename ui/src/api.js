import axios from 'axios'

export const addEvent = (id, name, aisle) => {
  return axios.post('/api/events', { id, name, aisle })
}

export const removeEvent = (id) => {
  return axios.delete(`/api/events/${id}`)
}

export const listEvents = () => {
  return axios.get('/api/events')
}
