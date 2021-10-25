<p align="center">
<img class="avatar avatar-user" height="128" width="128" alt="@wecise" src="https://avatars.githubusercontent.com/u/58409973?s=88&u=ca03bd3f6931f823130d74c02ee2ec372fb8b35a&v=4">
</p>

# M3JS

## 简介

[M³小应用](http://wecise.com/)是基于[M³平台](http://wecise.com/)运行的各类应用程序的统称。典型的M³小应用是通过HTML5实现的。

M3JS是专门针对M³小应用进行快速开发、部署的集成工具包。M3JS中封装了M³平台的所有应用开发接口，通过这些接口开发人员可以方便的使用M³平台提供的各类资源。M3JS中还包含一个M³小应用开发模版，方便用户快速搭建自己的M³小应用开发项目。另外，M3JS中还提供了一些M³小应用开发过程中常用的函数、工具类和方法。

## 必须的基础知识

M3JS是面向前端开发人员提供的开发工具包（Toolkit），我们默认用户已经具备下列前端开发相关的基础知识。

### HTML5

HTML5 是 HyperText Markup Language 5 的缩写，是构建Web内容的一种描述语言。关于HTML5的详细内容可以[点击参考这里](https://baike.baidu.com/item/html5)。

与HTML5紧密相关的内容，还包括[CSS](https://baike.baidu.com/item/css)和[JavaScript](https://baike.baidu.com/item/JavaScript)。用户可以通过[一些网站](https://www.runoob.com/html/html5-intro.html)自行学习这些内容。

### Vue

M³小应用以 Vue 组件形式进行开发。[Vue](https://cn.vuejs.org/v2/guide/index.html)是一套用于构建用户界面的渐进式框架。我们使用[Vue CLI](https://cli.vuejs.org/zh/guide/) 作为前端快速开发的辅助组件。M3JS是在Vue CLI基础上提供的开发工具包。

### Node.js

[Node.js](http://nodejs.cn/learn)是一个 JavaScript 运行时环境。Vue CLI需要在Node.js上运行，以提供对前端开发过程的支持。

你需要在开发电脑上安装Node.js软件。通过[这里](http://nodejs.cn/download/)可以下载安装对应不同操作系统版本的Node.js。

在前端开发过程中，会经常使用Node.js中的[npm](https://docs.npmjs.com/about-npm)命令。



## 开发流程

下面以Mac操作系统为例，说明M³小应用开发流程。

### 创建工程

假设你要创建的M³小应用的英文简称为 MyM3App，中文名称为M³小应用。

1. 创建工程目录

工程目录可以创建在你电脑上任何位置，这里以创建在 /opt/code 目录下为例。
```
mkdir -p /opt/code/MyM3App
cd /opt/code/MyM3App
```

2. 安装M3JS

```
cd /opt/code/MyM3App
npm install -g @wecise/m3js
```

3. 初始化工程文件

```
cd /opt/code/MyM3App
m3js init
```

4. 修改环境信息

```
cd /opt/code/MyM3App
vi .env
```
编辑.env文件

```
NODE_ENV="development"
VUE_APP_M3_APP="m3app"
VUE_APP_M3_TITLE="M3小应用"
VUE_APP_M3_APP_VERSION="1.0.0"
VUE_APP_M3_HOST="47.92.151.165:8080"
VUE_APP_M3_COMPANY="wecise"
VUE_APP_M3_USERNAME="username"
VUE_APP_M3_PASSWORD="123456"
```

5. 本地试运行

```
cd /opt/code/MyM3App
node_modules/\@wecise/m3js/cmd run
```

终端显示类似如下内容：
```
  App running at:
  - Local:   http://localhost:8080
  - Network: http://192.168.1.4:8080

  Note that the development build is not optimized.
  To create a production build, run npm run build.
```

6. 查看运行结果

在浏览器中打开 http://localhost:8080 查看页面是否正常。

### M³小应用开发

M³小应用以 Vue 组件形式进行开发。所有 Vue 组件均存放在工程目录的 src 目录下，入口主文件为 App.vue。其它使用到的 Vue 组件放在 components 目录下。用户可根据实际需求进行分析设计，组织 Vue 组件的目录结构。

M3JS在初始化M³小应用时，已经创建好入口主文件 App.vue 和一些常用的 Vue组件。后面会逐一说明这些组件的功能。


### M³小应用测试

......

### M³小应用发布

执行M3JS发布命令，M3JS 自动完成编译、部署工作
```
cd /opt/code/MyM3App
node_modules/\@wecise/m3js/cmd publish
```

通过浏览器访问M³平台，激活刚刚发布的 M³小应用。激活工作只需要执行一次。
通过M³平台还可以对 M³小应用进行相关配置，具体操作方法请参考[M³平台用户手册]()。

## M³小应用开发框架

### Vue组件

#### 入口主文件

......

#### 布局组件

......

#### 消息组件

......

#### 标签组件

......

#### ......

......

### M³平台接口

......

### M³小应用服务端接口

......

### 其它常用功能

......

## Features

### app

```
setAppAsHome
setAppAsHomeForAllUser
setTitle
```

### Connect

### Init

### Dfs

```
dfsNew

dfsDelete

dfsRename

dfsUpdateAttr

dfsRefresh
```

### Consolelog

```
consolelogTrace

consolelogDelete

consolelogTruncate
```

### Job

### Rule

```
ruleGet
ruleAdd
```

### User

# Install

```
npm install @wecise/m3js
```

# Usage

## import

```
const m3 = require("@wecise/m3js");
Vue.prototype.m3 = m3;
```

## connect

```
if(process.env.NODE_ENV === "development"){

    this.m3.connect(http/https, address, port, company, username, password).then(()=>{
        // app
    }).catch((err)=>{
        console.log(err);
    });
  
} else {
  this.m3.init();
  // app
}
```

## call api

```
    # no input param
    this.m3.callFS("/matrix/eventConsole/getEventList.js").then( (res)=>{
        console.log(res)
    }).catch( (err)=>{
        console.error(err)
    } );

    # input param
    let param = encodeURIComponent(JSON.stringify({term:'m3'}));
    this.m3.callFS("/matrix/eventConsole/getEventList.js", param).then( (res)=>{
        console.log(res)
    }).catch( (err)=>{
        console.error(err)
    } );
```

## License

[MIT](https://opensource.org/licenses/MIT)

Copyright (c) 2016-present, WECISE.COM
