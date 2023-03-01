import axios from 'axios'
import upload from './upload'

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
    http.get(data.fullURL, { responseType: 'blob' }).then(res => {
      console.log('获取文件')
      console.log(res)
      upload.put(data, res.data, {
        // ali-oss 不支持上传进度
        // onUploadProgress: ({progress}) => {
        //   console.log((progress * 100).toFixed(2));
        //   handle.onProgress((progress * 100).toFixed(2))
        // },
      }).then(() => {
        resolve({
          key: data.key
        })
      }).catch(putErr => {
        reject(putErr)
      })
    }).catch(err => {
      reject(err)
    })
  })
}

export const cdnBaseURL = 'https://cdn.oss-cn-beijing.aliyuncs.com/libs/'
export const cdnDomain = 'https://cdn.oss-cn-beijing.aliyuncs.com'
export const cdnFileFolder = '/libs/'

export const copyScript = null
export const copyURL = null
