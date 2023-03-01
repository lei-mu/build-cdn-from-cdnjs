import axios from 'axios'
// import upload from './upload'
import qiniuHttp from '@/request/qiniuHttp'

const http = axios.create()

// 检测单个文件
export const checkFile = (file) => {
  return new Promise((resolve) => {
    http.head(`${cdnBaseURL}${file.name}/${file.version}/${file.path}`).then(() => {
      resolve({
        key: file.path,
        status: 'yes'
      })
    }).catch((err) => {
      if (err && err.response && err.response.status === 404) {
        resolve({
          key: file.path,
          status: 'no'
        })
      } else {
        resolve({
          key: file.path,
          status: 'fail'
        })
      }
    })
  })
}

// 批量检测文件
export const checkAllFiles = null
// export const checkAllFiles = (fileList) => {
//   return new Promise(resolve => {
//     const result = fileList.map(p1 => {
//       return {
//         status: Math.random() > 0.5 ? 'yes' : 'no',
//         key: p1.path
//       }
//     })
//     resolve(result)
//   })
// }

// 同步文件
export const fileSynchronization = (data, handle) => {
  return new Promise((resolve, reject) => {
    // upload.put(data.url)
    qiniuHttp.post('/api/v2/object-storage', {
      version: data.version,
      key: data.key,
      name: data.packageName
    }).then(res => {
      const resData = res.data
      console.log(resData)
      resolve({
        key: data.key
      })
    }).catch(err => {
      reject(err)
    })
  })
}

export const cdnDomain = 'https://cdnjs.static.ti3.cn'
export const cdnFileFolder = '/ajax/libs/'
export const cdnBaseURL = `${cdnDomain}${cdnFileFolder}`

export const copyScript = null
export const copyURL = null
