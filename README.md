# m3js
JavaScript library for M³ platform.The aim of the project is to create an easy to use, tool library for  M³ platform.

# Features
### app

    setAppAsHome
    setAppAsHomeForAllUser
    setTitle


### Connect
### Init
### Dfs
    
    dfsNew

    dfsDelete

    dfsRename
  
    dfsUpdateAttr

    dfsRefresh

### Consolelog
    
    consolelogTrace
    
    consolelogDelete
    
    consolelogTruncate
    
### Job
### Rule
    ruleGet
    ruleAdd
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