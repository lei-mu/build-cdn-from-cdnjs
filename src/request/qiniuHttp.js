import axios from 'axios'

const qiniuHttp = axios.create({
  baseURL: 'https://api.cdn.com'
})


export default qiniuHttp
