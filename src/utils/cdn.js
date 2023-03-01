/**
 * oss,qiniu
 * */
// import { checkAllFiles, checkFile, fileSynchronization, cdnDomain, cdnFileFolder, copyScript, copyURL } from './oss'
import { checkAllFiles, checkFile, fileSynchronization, cdnDomain, cdnFileFolder, copyScript, copyURL } from './qiniu'

export default {
  checkAllFile: checkAllFiles,
  checkFile: checkFile,
  copyHtml: copyScript,
  copyURL: copyURL,
  fileSynchronization: fileSynchronization,
  cdnDomain: cdnDomain,
  cdnFileFolder: cdnFileFolder,
  concurrency: 10
}
