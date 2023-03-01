import OSS from 'ali-oss'
import axios from 'axios'
import { cdnFileFolder } from './index'
// import { getFileName } from '@/utils/cdnUtils'

const http = axios.create()
const client = new OSS({
  // yourregion填写Bucket所在地域。以华东1（杭州）为例，Region填写为oss-cn-hangzhou。
  region: 'oss-cn-beijing',
  // 阿里云账号AccessKey拥有所有API的访问权限，风险很高。强烈建议您创建并使用RAM用户进行API访问或日常运维，请登录RAM控制台创建RAM用户。
  accessKeyId: '',
  accessKeySecret: '',
  // 填写Bucket名称。关于Bucket名称命名规范的更多信息，请参见Bucket。
  bucket: 'cdn',
})


async function put (fileData, data) {
  return client.put(`${cdnFileFolder}${fileData.packageName}/${fileData.version}/${fileData.key}`, data)
}

export default {
  put
}
