import axios from 'axios'

const clientAPI = axios.create({
  baseURL: 'http://localhost:3001',
})

export default clientAPI
