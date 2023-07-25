import axios from 'axios'

const clientAPI = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

export default clientAPI
