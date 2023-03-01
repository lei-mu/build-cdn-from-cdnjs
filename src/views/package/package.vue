<template>
  <div class="do-main-container package-info" v-loading="packageInfoLoading" element-loading-text="加载中...">
    <div class="package-info-header">
      <div class="package-name am-text-break">{{ state.packageData.name }}</div>
      <div class="header-link-content">
        <a :href="state.packageData.homepage" title="官网" class="link-list am-flex-rc-center"
          v-if="state.packageData.homepage" target="_blank">
          <el-icon :size="25">
            <House />
          </el-icon>
        </a>
        <a :href="state.packageData.repository.url" title="代码仓库" class="link-list am-flex-rc-center"
          v-if="state.packageData.repository?.url" target="_blank">
          <el-icon :size="25">
            <Memo />
          </el-icon>
        </a>
        <a :href="`https://cdnjs.com/libraries/${state.packageData.name}/${state.currentVersion}`" title="cdnjs"
          class="link-list am-flex-rc-center" v-if="state.packageData.name" target="_blank">
          <el-icon :size="25">
            <MostlyCloudy />
          </el-icon>
        </a>
        <a :href="`https://www.jsdelivr.com/package/npm/${state.packageData.name}?version=${state.currentVersion}`"
          title="jsdelivr" class="link-list am-flex-rc-center" v-if="state.packageData.name" target="_blank">
          <el-icon :size="25">
            <Sunrise />
          </el-icon>
        </a>
      </div>
    </div>
    <div class="package-info-arg am-flex-row-center">
      <span class="user-name am-flex-row-center" v-if="state.packageData.author">
        <el-icon :size="16">
          <User />
        </el-icon>
        <span style="margin-left: 10px">
          {{ state.packageData.author }}
        </span>
      </span>
      <el-tag v-if="state.packageData.version" type="info" effect="plain" style="margin-left: 15px">
        {{ state.packageData.version }}
      </el-tag>
      <el-tag v-if="state.packageData.license" type="info" effect="plain" style="margin-left: 15px">
        {{ state.packageData.license }}
      </el-tag>
    </div>
    <div class="package-info-des am-text-break" v-if="state.packageData.description">
      {{ state.packageData.description }}
    </div>
    <div class="package-info-tag am-text-break" v-if="state.packageData.keywords && state.packageData.keywords.length">
      tags: {{ state.packageData.keywords.toString() }}
    </div>
  </div>
  <div class="do-main-container">
    <div class="package-list">
      <div class="package-list-header am-flex-rc-between">
        <span class="package-header-name">{{ state.packageData.name }}</span>
        <div>
          <el-select v-model="state.currentVersion" filterable placeholder="Select" @change="versionChange">
            <el-option v-for="item in state.packageData.versions" :key="item" :label="item" :value="item" />
          </el-select>
        </div>
      </div>
      <div class="files-wrap">
        <el-table :data="filterTableData" stripe style="width: 100%" v-loading="state.fileListLoading">
          <el-table-column label="文件">
            <template #default="scope">
              <div>{{ scope.row.key }}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #default="scope">
              <div class="upload-progress" v-if="state.fileStatus[scope.row.key].uploading">
                <el-progress :percentage="state.fileStatus[scope.row.key].uploadPercent" />
              </div>
              <div v-if="state.fileStatus[scope.row.key].loading">
                <el-link :underline="false">查询中...</el-link>
              </div>
              <template v-else>
                <template v-if="state.fileStatus[scope.row.key].status === 'yes'">
                  <el-button text type="primary" @click="copyScript(scope.row)"
                    v-if="!!state.currentData.sri[scope.row.key]">复制Html标签
                  </el-button>
                  <el-button text type="primary" @click="copyURL(scope.row)">复制链接</el-button>
                </template>
                <template v-else-if="state.fileStatus[scope.row.key].status === 'no'">
                  <el-button text type="primary" @click="fileSynchronization(scope.row)"
                    :loading="state.fileStatus[scope.row.key].uploading">同步至cdn
                  </el-button>
                </template>
                <template v-else>
                  <el-button text type="primary" @click="checkAgain(scope.row)">同步状态查询失败，重新查询
                  </el-button>
                </template>

              </template>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="file-wrap-bot am-flex-rc-center" v-if="state.hasHidden">
        <el-button type="text" @click="state.showAllFile = !state.showAllFile">
          {{ state.showAllFile ? '已显示所有文件，点击以隐藏非必需文件' : '一些文件被隐藏，点击显示所有' }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { House, Memo, User, MostlyCloudy, Sunrise } from '@element-plus/icons-vue'
import { packageInfo, packageCurrentInfo } from '@/api/cdnjs'
import { useRoute, useRouter } from 'vue-router'
import { useClipboard } from '@vueuse/core'
import cdnUtils from '@/utils/cdn'
import { cdnjsBaseURL } from '@/types/cdnjs.js'
// import pSettle from 'p-settle'
// import pMapSeries from 'p-map-series'
import pMap from 'p-map'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()

const packageName = route.params.name
const {
  copy,
  isSupported: copyIsSupported
} = useClipboard({ legacy: true })
const state = reactive({
  // 包的基本信息
  packageData: {},
  // 选择的版本
  currentVersion: '',
  // 当前版本的数据
  currentData: {},
  // 管理每一个文件的状态
  fileStatus: {},
  filesTable: [], // 所有格式化后的数据
  showAllFile: false, // 是否展示所有文件
  hasHidden: false, // 存在非必要文件
  // 文件列表查询中
  fileListLoading: false
})
let packageInfoLoading = ref(true)

// 过滤table 数据
const filterTableData = computed(() => {
  console.log(state.showAllFile)
  if (state.showAllFile) {
    return state.filesTable
  } else {
    return state.filesTable.filter(p1 => p1.isWhite)
  }
})

const getPackageInfo = () => {
  // ['name', 'filename', 'description', 'version', 'keywords', 'alternativeNames', 'fileType', 'github', 'objectID', 'license', 'homepage', 'repository', 'author', 'originalName', 'sri', 'assets', 'versions']
  packageInfo(packageName, {
    // fields: ['name', 'filename', 'description', 'version', 'keywords', 'alternativeNames', 'fileType', 'github', 'objectID', 'license', 'homepage', 'repository', 'author', 'originalName', 'sri', 'versions'].toString()
  }).then(res => {
    let resData = res.data
    console.log(resData)
    let query = route.query
    if (resData.versions.includes(query.version)) {
      state.currentVersion = query.version
    } else {
      state.currentVersion = resData.version
    }
    resData.versions.reverse()

    state.packageData = resData
    packageInfoLoading.value = false
    getPackageCurrent()
  }).catch(() => {
    packageInfoLoading.value = false
  })
}
getPackageInfo()
// 查询当前版本的 文件列表
const getPackageCurrent = () => {
  state.fileListLoading = true
  packageCurrentInfo(packageName, state.currentVersion, {
    // fields: ['files', 'sri', 'rawFiles'].toString()
  }).then(res => {
    const {
      rawFiles,
      files
    } = res.data
    state.currentData = res.data
    const fileStatus = {}
    const filesTable = []
    const checkTasks = []
    const allCheckNull = !cdnUtils.checkAllFile && !cdnUtils.checkFile
    // const useCheckFile = !cdnUtils.checkAllFile && cdnUtils.checkFile
    const checkFileArg = []
    state.hasHidden = files.length !== rawFiles.length
    rawFiles.forEach(p1 => {
      filesTable.push({
        key: p1,
        isWhite: files.includes(p1)
        // file: p1
      })
      fileStatus[p1] = {
        loading: !allCheckNull,
        status: 'no', // yes 自己的cdn 服务器存在该文件； no 自己的cdn 服务器不存在该文件；fail 查询自己的服务器是否存在失败
        uploading: false,
        uploadPercent: 0
      }
      // if (useCheckFile) {
      checkFileArg.push({
        name: packageName,
        version: state.currentVersion,
        path: p1
      })
      // }
    })
    state.fileStatus = fileStatus
    console.log('cdnUtils')
    console.log(cdnUtils)
    if (cdnUtils.checkAllFile) {
      console.log(checkFileArg)
      cdnUtils.checkAllFile(checkFileArg).then(checkAllRes => {
        console.log(checkAllRes)
        checkAllRes.forEach(p1 => {
          state.fileStatus[p1.key].status = p1.status
          state.fileStatus[p1.key].loading = false
        })
      }).catch(checkErr => {
        checkFileArg.forEach(p1 => {
          state.fileStatus[p1.path].status = 'fail'
          state.fileStatus[p1.path].loading = false
        })
      })
    } else if (cdnUtils.checkFile) {
      // pSettle(checkTasks, { concurrency: 10 }).then(res => {
      //   console.log(res)
      // })
      const packingCheck = (arg) => {
        return cdnUtils.checkFile(arg).then(checkRes => {
          state.fileStatus[checkRes.key].status = checkRes.status
          state.fileStatus[checkRes.key].loading = false
          return checkRes
        }).catch((checkErr) => {
          state.fileStatus[arg.path].status = 'fail'
          state.fileStatus[arg.path].loading = false
          return Promise.reject(checkErr)
        })
      }

      pMap(checkFileArg, packingCheck, { concurrency: cdnUtils.concurrency })
    } else {
      console.warn('未提供检测方法，无法检测文件是否存在')
    }
    console.log(filesTable)
    state.filesTable = filesTable
    state.fileStatus = fileStatus
  }).finally(() => {
    state.fileListLoading = false
  })
}

// 文件同步
const fileSynchronization = (row) => {
  if (state.fileStatus[row.key].uploading) return
  const handle = {
    onProgress(percent) {
      state.fileStatus[row.key].uploadPercent = percent
    }
  }
  state.fileStatus[row.key].uploading = true
  cdnUtils.fileSynchronization({
    fullURL: `${cdnjsBaseURL}${packageName}/${state.currentVersion}/${row.key}`,
    packageName,
    version: state.currentVersion,
    key: row.key
  }, handle).then(syncRes => {
    state.fileStatus[syncRes.key].status = 'yes'
    state.fileStatus[row.key].uploading = false
  }).catch(err => {
    console.log(err)
    state.fileStatus[row.key].uploading = false
  })
}

// 版本修改
const versionChange = (val) => {
  const curRoute = route
  let curQuery = { ...curRoute.query }
  console.log(curQuery)
  curQuery.version = val
  router.replace({ query: curQuery })
  getPackageCurrent()
}

// 复制字符串
const copyStr = (str) => {
  if (copyIsSupported) {
    copy(str)
  } else {
    ElMessage({
      message: '复制失败！',
      type: 'warning'
    })
  }
}
// 点击复制script
const copyScript = (row) => {
  console.log(row)
  const sri = state.currentData.sri[row.key]

  if (cdnUtils.copyHtml) {
    cdnUtils.copyHtml({
      ...row,
      sri: sri
    }, copyStr)
  } else {
    const cdnURL = `${cdnUtils.cdnDomain}${cdnUtils.cdnFileFolder}${packageName}/${state.currentVersion}/${row.key}`
    let htmlStr = ''
    if (cdnURL.endsWith('.js')) {
      htmlStr = `<script src="${cdnURL}" integrity="${sri}" crossorigin="anonymous" referrerpolicy="no-referrer"><${''}/script>`
    } else {
      htmlStr = `<link rel="stylesheet" href="${cdnURL}" integrity="${sri}" crossorigin="anonymous" referrerpolicy="no-referrer">`
    }
    copyStr(htmlStr)
  }
}
// 点击复制URL
const copyURL = (row) => {
  const sri = state.currentData.sri[row.key]
  if (cdnUtils.copyURL) {
    cdnUtils.copyURL({
      ...row,
      sri: sri
    }, copyStr)
  } else {
    const scriptURL = `${cdnUtils.cdnDomain}${cdnUtils.cdnFileFolder}${packageName}/${state.currentVersion}/${row.key}`
    copyStr(scriptURL)
  }
}

// 再次检测
const checkAgain = (row) => {
  const params = {
    name: packageName,
    version: state.currentVersion,
    path: row.key
  }

  if (cdnUtils.checkAllFile) {
    cdnUtils.checkAllFile([params]).then(checkAllRes => {
      checkAllRes.forEach(p1 => {
        state.fileStatus[p1.key].status = p1.status
        state.fileStatus[p1.key].loading = false
      })
    }).catch(checkErr => {
      state.fileStatus[row.key].status = 'fail'
      state.fileStatus[row.key].loading = false
    })
  } else if (cdnUtils.checkFile) {
    state.fileStatus[row.key].loading = true
    cdnUtils.checkFile(params).then(checkRes => {
      state.fileStatus[checkRes.key].status = checkRes.status
      state.fileStatus[checkRes.key].loading = false
    }).catch(() => {
      state.fileStatus[row.key].status = 'fail'
      state.fileStatus[row.key].loading = false
    })
  } else {
    console.warn('未提供检测方法，无法检测文件是否存在')
  }
}
</script>
<script>
export default {
  name: 'package'
}
</script>

<style scoped lang="scss">
.package-list {}

.package-list-header {
  padding: 15px 15px;
}

.package-header-name {
  font-weight: bold;
  font-size: 18px;
  color: var(--el-color-primary);
}

.upload-progress {
  position: absolute;
  z-index: 10;
  bottom: 0;
  left: 0;
  width: 100%;
}

.file-wrap-bot {
  padding: 25px 0;
}

.package-info {
  padding: 35px 15px;
  min-height: 213px;
}

.package-info-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.package-name {
  font-size: 36px;
  color: #000;
}

.header-link-content {
  display: flex;
  border: 1px solid #e5e5e5;

  .link-list {
    width: 40px;
    height: 40px;
    color: #666;

    &:hover {
      color: #000;
    }

    &+.link-list {
      border-left: 1px solid #e5e5e5;
    }
  }
}

.package-info-arg {
  margin-top: 15px;

  .user-name {}
}

.package-info-des {
  margin-top: 15px;
}

.package-info-tag {
  margin-top: 15px;
  //font-size: 12px;
  color: #606266;
}

.result-item-tag {
  margin-top: 8px;

  &+.result-item-tag {
    margin-left: 15px;
  }
}

@media (max-width: 760px) {
  .package-info-header {
    display: block;
  }

  .package-name {
    font-size: 24px;
  }

  .header-link-content {
    margin-top: 8px;
  }
}
</style>
