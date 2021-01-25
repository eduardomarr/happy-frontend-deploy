import axios from 'axios';

const api = axios.create({
  baseURL: 'https://happy-deploy-em.herokuapp.com',
})

export default api;