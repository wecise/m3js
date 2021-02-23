# m3js
JavaScript library for M3 platform

# Install
```
npm install @cnwangzd/m3js
```

# Usage
```
const m3 = require("@cnwangzd/m3js");
Vue.prototype.m3 = m3;
```

## connect to M³ Server and init env
```
if(process.env.NODE_ENV === "development"){

    this.m3.connect("http", address, port, company, username, password).then(()=>{
        // app
    }).catch((err)=>{
        console.log(err);
    });
  
} else {
  this.m3.init();
  // app
}
```
