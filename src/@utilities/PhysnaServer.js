import axios from 'axios'

const PhysnaServer = axios.create({
  baseURL: process.env.REACT_APP_API_KEY,
})

export { PhysnaServer }
