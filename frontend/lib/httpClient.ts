import { RestApplicationClient } from '@/models/backend'
import Axios from 'axios'
require('dotenv').config()

const httpClient = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL!, 
  headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/json',
      'Accept': 'application/json'
  },
  withCredentials: true,
  xsrfCookieName: 'XSRF-TOKEN',
  withXSRFToken: true,
})

const backendClient =  Axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL!, 
  headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/json',
      'Accept': 'application/json'
  },
  withCredentials: true,
  xsrfCookieName: 'XSRF-TOKEN',
  withXSRFToken: true
})
backendClient.interceptors.response.use((response) => {
  return response.data
})

export const restClient = new RestApplicationClient(backendClient)

export default httpClient