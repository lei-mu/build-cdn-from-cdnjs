import axios from 'axios'

const cdnHttp = axios.create({
  baseURL: 'https://api.cdnjs.com'
})

export default cdnHttp
