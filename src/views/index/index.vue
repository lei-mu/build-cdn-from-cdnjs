<template>
  <div>
    <div class="main do-main-container">
      <div class="main-search">
        <el-form :model="packageSearchParams" :rules="packageRules" ref="ruleFormRef" @submit.prevent="formOnSubmit">
          <el-form-item prop="search">
            <el-autocomplete v-model="packageSearchParams.search" :maxlength="50" clearable size="large"
                             :fetch-suggestions="querySearchAsync" @select="onSubmit"
                             placeholder="search all of cdnjs" class="search-input">
              <template #append>
                <el-button @click="onSubmit">search</el-button>
              </template>
            </el-autocomplete>
          </el-form-item>
        </el-form>
      </div>
      <div v-show="searchStatus === 2" class="result-empty-wrap am-flex-rc-center">无数据...</div>
      <div class="main-result" v-loading="searchStatus === 1">
        <div class="result-item" v-for="item in state.packageList" :key="item.name">
          <div class="result-item__name am-flex-rc-between">
            <router-link :to="{name: 'Package', params: {name: item.name}}" class="name-text">{{
                item.name
              }}
            </router-link>
            <div>
              <el-link v-if="item.homepage" :href="item.homepage" target="_blank" :underline="false" class="result-item-right-link" title="homepage">
                <el-icon :size="20">
                  <home-filled/>
                </el-icon>
              </el-link>
              <el-link v-if="item.repository" :href="item.repository.url" target="_blank" :underline="false" class="result-item-right-link" title="repository">
                <el-icon :size="20">
                  <Link/>
                </el-icon>
              </el-link>
            </div>
          </div>
          <div class="result-item__author am-flex-row-center" v-if="item.github">
            <span class="user-name am-flex-row-center">
               <el-icon :size="16">
                <User/>
                 </el-icon>
              <span style="margin-left: 10px" >{{ item.github.user }}</span>
            </span>
            <el-tag
              type="info"
              effect="plain"
              style="margin-left: 15px"
            >
              {{ item.version }}
            </el-tag>
            <el-tag
              v-if="item.license"
              type="info"
              effect="plain"
              style="margin-left: 15px"
            >
              {{ item.license }}
            </el-tag>
          </div>
          <div class="result-item__des am-text-break">
            {{ item.description }}
          </div>
          <div class="result-item__tag" v-if="item.keywords && item.keywords.length">
            <el-tag
              class="result-item-tag"
              type="info"
              effect="plain"
              v-for="tag in item.keywords" :key="tag"
            >
              {{ tag }}
            </el-tag>
          </div>
        </div>
      </div>
      <!--      <div class="main-pagination">-->
      <!--        <el-pagination-->
      <!--          small-->
      <!--          background-->
      <!--          layout="prev, pager, next"-->
      <!--          :page-size="searchPage.limit"-->
      <!--          :total="packageTotal"-->
      <!--          :current-page="searchPage.page"-->
      <!--          @current-change="pageCurrentChange"-->
      <!--          class="mt-4"-->
      <!--        />-->
      <!--      </div>-->
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { search } from '@/api/cdnjs'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const ruleFormRef = ref()
const packageSearchParams = reactive({
  search: route.query.keyword || '',
  fields: ['filename', 'description', 'version', 'keywords', 'alternativeNames', 'fileType', 'github', 'objectID', 'license', 'homepage', 'repository', 'author', 'originalName', 'sri'].toString()
})
const state = reactive({
  packageList: []
})
const searchStatus = ref(999) // 1 查询中；2 无数据； 3没有更多了
// const packageTotal = ref(0)

// const searchPage = reactive({
//   page: 1,
//   limit: 15
// })

const packageRules = reactive({
  search: [
    {
      required: true,
      message: '搜索库名称',
      trigger: 'blur'
    },
    {
      max: 50,
      message: '长度1到50',
      trigger: 'blur'
    }
  ]
})

const formOnSubmit = (event) => {
  event.preventDefault()
  onSubmit()
}
const onSubmit = async () => {
  if (!ruleFormRef.value) return
  let curQuery = { ...route.query }
  console.log(curQuery)
  curQuery.keyword = packageSearchParams.search
  router.replace({ query: curQuery })
  await ruleFormRef.value.validate((valid, fields) => {
    if (valid) {
      searchStatus.value = 1
      search({
        ...packageSearchParams,
        search_fields: 'name',
        limit: 100
        // ...searchPage
      }).then(res => {
        let {
          results,
          available
        } = res.data
        // packageTotal.value = available
        console.log('查询结果')
        console.log(results)
        state.packageList = results
        if (results.length === 0) {
          searchStatus.value = 2
        } else {
          searchStatus.value = 999
        }
      }).catch(err => {
        searchStatus.value = 999
        console.log(err)
      })
    }
  })
}

// const pageCurrentChange = (page) => {
//   searchPage.page = page
// }

const querySearchAsync = (query, cb) => {
  console.log('query')
  console.log(query)
  if (!query) {
    cb([])
    return
  }
  search({
    search: query,
    search_fields: 'name',
    limit: 10
  }).then(res => {
    let {
      results
    } = res.data
    cb(results.map(p1 => ({
      value: p1.name
    })))
    console.log(results)
  }).catch(err => {
    cb(err)
  })
}
onMounted(() => {
  if (packageSearchParams.search) {
    onSubmit()
  }
})

</script>
<script>
export default {
  name: 'index'
}
</script>

<style scoped lang="scss">
$page-plr: 15px;


.main-search {
  position: sticky;
  top: $do-header-bar-hei;
  padding: 15px $page-plr;
  background-color: #fff;
  z-index: 50;
}

:deep(.search-input) {
  display: block;
  width: 100%;
}

.result-item {
  padding: 25px $page-plr 15px;
  color: #303133;
  border-bottom: 1px solid #e5e5e5;
}

.result-item__name {
  .name-text {
    display: inline-block;
    font-size: 24px;
    font-weight: 500;
    color: var(--el-text-color-regular);
    &:hover {
      color: var(--el-color-primary);
    }
  }
}
.result-item-right-link{
  & +  .result-item-right-link {
    margin-left: 8px;
  }
}
.result-item__author {
  margin-top: 15px;
  flex-wrap: wrap;
}

.result-item__des {
  margin-top: 15px;
  color: #666;
  line-height: 25px;
  font-size: 15px;
}

.result-item__tag {
  margin-top: 15px;
}

.result-item-tag {
  margin-top: 8px;

  & + .result-item-tag {
    margin-left: 15px;
  }
}
.result-empty-wrap{
  height: 100px;
  color: #ccc;
  border-top: 1px solid #ccc;
}
</style>
