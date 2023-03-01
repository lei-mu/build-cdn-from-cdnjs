# build-cdn-from-cdnjs

基于[cdnjs open api](https://cdnjs.com/api) 快速构建自己的前端资源cdn库

- 无需后端服务
- 无服务器压力，可使用对象云储存
- 少量配置修改即可快速搭建私有的 cdn库
- 自适应网站

视频演示：

[demo.mp4](./demo.mp4)

![demo.gif](https://s2.xptou.com/2023/03/01/63fec413a734b.gif)



## 原理

**cdn库：** 如阿里的oss,华为的obs,腾讯的cos,七牛等等的对象储存，开启cdn 加速，即可成为一个cdn 前端资源库



所有的api 都基于 [cdnjs](https://cdnjs.com)

- 搜索索引
- 搜索结果列表
- 搜索结果详情
- 搜索结果资源列表

只需要在需要使用对应资源时，通过同步，同步到自己的cdn库，使用自己的cdn 资源。这样，我们仅仅使用了小量空间，就拥有所有前端开源库资源。



**同步**：将资源上传到自己的cdn库

代码里提供了oss 前端直传和七牛云后端上传示例



**判断自己的cdn库是否有对应资源：** 通过`head` 请求，获取自己cdn库的url 判断。



这样一套下来，压力全在云上，自己只需要提供前端项目展示即可，可考虑github pages,gitee pages 或者放在对象储存库里也科技

## 配置

暴露所需方法

```` js
// src/utils/cdn.js
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

````

### checkAllFile/checkFile

二选一，只需要提供其中一个即可，优先使用`checkAllFile`

**checkAllFile** 

批量检测资源是否在自己的cdn库

checkAllFile 接收一个数组，格式示例如下

```` js
[{
    name: '库名称', 
    version： '库版本', 
    path: '资源相对路径'
}]
````

checkAllFile 必须返回返回一个promise，查询完成必须返回所有条数的数组。

格式如下,

```` js
[{
    key: '资源相对路径', 
    status: 'yes/no/fail; yes 自己的cdn 服务器存在该文件； no 自己的cdn 服务器不存在该文件；fail 查询自己的服务器是否存在失败'
}]
````

**checkFile**

单个检测资源是否在自己的cdn库

checkFile接收一个对象，格式示例如下

```` js
{
    name: '库名称', 
    version： '库版本', 
    path: '资源相对路径'
}
````

checkFile 必须返回一个promise,查询完成返回一个对象，格式如下

```` js
{
    key: '资源相对路径', 
    status: 'yes/no/fail; yes 自己的cdn 服务器存在该文件； no 自己的cdn 服务器不存在该文件；fail 查询自己的服务器是否存在失败'
}
````

### copyHtml

自定义复制html 标签方法。有默认，没有自定义要求可以不提供

接收2个参数

- itemData 当前资源数据
- copyStr 复制方法

```` js
export const coptHtml = (itemData , copyStr) => {
	copyStr(data.sri)
}
````

### copyURL

自定义复制资源url 方法。有默认，没有自定义要求可以不提供

接收2个参数

- itemData 当前资源数据
- copyStr 复制方法

```` js
export const coptHtml = (itemData , copyStr) => {
	copyStr(data.sri)
}
````

### fileSynchronization

同步资源方法，必须返回一个promise

接收2个参数

- itemData 当前条资源数据
- itemData.fullURL:  cdnjs 里对应资源的绝对路径
- itemData.packageName： 资源name
- itemData.version: 资源版本号
- itemData.key: 资源路径
- handle： 方法对象
- handle.onProgress 上传进度回调，接收一个数字 0 - 100；

同步完成，接收一个对象

```` js
{
	key: '资源相对路径'
}
````

### cdnDomain

私有cdn 的域名

```` js
export const cdnDomain = 'https://cdnjs.static.cdn.cn'
````

### cdnFileFolder

私有cdn 库的文件夹

如在根路径就写`/`,固定文件夹如下：

```` js
export const cdnFileFolder = '/ajax/libs/'
````

### concurrency

单个检测资源时的最大并行数量

```` js
concurrency = 10
````



## 常见问题

### 如何同步资源到自己的cdn 库

由于前端资源不可信原则，建议通过后端上传资源。并且后端必须自己拼接资源的url,只接收version,key,packageName 即可，保证资源的安全。

### 如何检测资源是否存在于自己的cdn库

通过`head` 请求，获取自己cdn库的url 判断



## license

[MIT](./LICENSE.txt)

须保留底部的`cdnjs` 和`build cdn from cdnjs`项目版权声明



感谢cdnjs 提供的[open api](https://cdnjs.com/api)
