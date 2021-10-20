<p align="center">
<img class="avatar avatar-user" height="128" width="128" alt="@wecise" src="https://avatars.githubusercontent.com/u/58409973?s=88&u=ca03bd3f6931f823130d74c02ee2ec372fb8b35a&v=4">
</p>

# m3js

JavaScript library for M³ platform.The aim of the project is to create an easy to use, tool library for  M³ platform.

一个JavaScript工具包，封装了M³平台各类机制，建设本项目的初衷是尽可能方便开发人员调用平台各类资源。

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
