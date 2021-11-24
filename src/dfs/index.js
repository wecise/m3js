/* 
  *  Http Request
  */
const http = require('../axios/http').default;

// dfsList
export let list = function (data) {
      
    return new Promise( function (resolve, reject) {
        
      http.get({
        url: `/fs${data.fullname}${window.auth.isAdmin?'?issys=true':''}`,
        param: {
          type: 'dir'
        }
      }).then(res=>{
        resolve(res.data);
      }).catch(err=>{
        reject(err.data);
      })
        
    })
  
};

// dfsWrite
export let write = function(data) {
  
  return new Promise( function (resolve, reject) {
    
    let fm = new FormData();

    fm.append("data", data.data.content);
    fm.append("type", data.data.ftype);
    fm.append("attr", JSON.stringify(data.data.attr)=='{}'?'':JSON.stringify(data.data.attr));
    fm.append("index", true);

    http.put({
      url: `/fs${data.parent}/${data.name}${window.auth.isAdmin?'?issys=true':''}`,
      param: fm
    }).then(res=>{
      syncToLocal(data);
      resolve(res.data);
    }).catch(err=>{
      reject(err);
    })
      
  })

};

// dfsRead
export let read = function(data){

  return new Promise( function (resolve, reject) {
    
    if(data.ftype === 'js'){
      http.get({
        url: `/fs${data.parent}/${data.name}${window.auth.isAdmin?'?issys=true':''}`,
        param: {
          type: 'file'
        }
      }).then(res=>{
        resolve(res.data.message);
      }).catch(err=>{
        reject(err.data);
      })
    } else {
      http.get({
        url: `/fs${data.parent}/${data.name}${window.auth.isAdmin?'?issys=true':''}`,
        //url: `/static${data.parent}/${data.name}`,
        param: {
          type: 'file'
        }
      }).then(res=>{
        resolve(res.data.message);
        //resolve( JSON.stringify(res.data));
      }).catch(err=>{
        reject(err.data);
      })
    }

    })

};

// dfsNew
// 创建一个新文件
export let newFile = function(data) {
  
  return new Promise( function (resolve, reject) {
    
    let fm = new FormData();

    fm.append("data", data.data.content);
    fm.append("type", data.data.ftype);
    fm.append("attr", JSON.stringify(data.data.attr)=='{}'?'':JSON.stringify(data.data.attr));
    fm.append("index", true);

    http.put({
      url: `/fs${data.parent}/${data.name}${window.auth.isAdmin?'?issys=true':''}`,
      param: fm,
      config: {
        contentType: false
      }
    }).then(res=>{
      // sync to local must in ['/app','script','/web']
      if( data.parent.startsWith('/app') || data.parent.startsWith('/script') || data.parent.startsWith('/web') ){
        syncToLocal(data)
      };
      resolve(data.name);
    }).catch(err=>{
      reject(err);
    })
      
  })

};

// dfsDelete
// 删除指定文件
export let deleteFile = function(data) {
  
  return new Promise( function (resolve, reject) {
    
    http.delete({
      url: `/fs${data.parent}/${data.name}${window.auth.isAdmin?'?issys=true':''}`
    }).then(res=>{
      resolve(res.data);
    }).catch(err=>{
      reject(err.data);
    })
      
  })

};

// dfsRename
export let rename = function(data){
  
  return new Promise( function (resolve, reject) {
    
    let fm = new FormData();
    fm.append("srcpath", data.srcpath);
    fm.append("dstpath", data.dstpath);

    http.post({
      url: `/fs/rename${window.auth.isAdmin?'?issys=true':''}`,
      param: fm
    }).then(res=>{
      resolve(res.data);
    }).catch(err=>{
      reject(err.data);
    })
      
  })
}

// dfs exist check
export let check = function(data){

  return new Promise( function (resolve, reject){
    
    http.get({
      url: `/fs${data.parent}/${data.name}?type=check${window.auth.isAdmin?'&issys=true':''}`
    }).then(res=>{
      resolve(res.data.message);
    }).catch(err=>{
      reject(err.data);
    })

  })

}

// dfsUpdateAttr
export let updateAttr = function(data){

  return new Promise( function (resolve, reject) {
    
    let fm = new FormData();
    fm.append("attr", JSON.stringify(data.attr));

    http.put({
      url: `/fs${data.parent}/${data.name}?type=attr${window.auth.isAdmin?'&issys=true':''}`,
      param: fm
    }).then(res=>{
      resolve(res.data);
    }).catch(err=>{
      reject(err.data);
    })
      
  })

}

// dfsRefresh
export let refresh = function(data){

  return new Promise( function (resolve, reject) {
    
    http.post({
      url: `/fs/tolocal/${data.name}${window.auth.isAdmin?'?issys=true':''}`
    }).then(res=>{
      resolve(res.data);
    }).catch(err=>{
      reject(err.data);
    })
      
  })
}

// dfs Move
export let move = function(data){

  return new Promise( function (resolve, reject) {
    
    let fm = new FormData();
    fm.append("srcpath", data.srcpath.replace(/\/\//g,'/'));
    fm.append("dstpath", data.dstpath.replace(/\/\//g,'/'));

    http.post({
      url: `/fs/move${window.auth.isAdmin?'?issys=true':''}`,
      param: fm
    }).then(res=>{
      resolve(res.data);
    }).catch(err=>{
      reject(err.data);
    })
      
  })

};

// dfs Copy
export let copy = function(data){

  return new Promise( function (resolve, reject) {
    
    let fm = new FormData();
    fm.append("srcpath", data.srcpath.replace(/\/\//g,'/'));
    fm.append("dstpath", data.dstpath.replace(/\/\//g,'/'));

    http.post({
      url: `/fs/copy${window.auth.isAdmin?'?issys=true':''}`,
      param: fm
    }).then(res=>{
      resolve(res.data);
    }).catch(err=>{
      reject(err.data);
    })
      
  })

};

// dfsSyncToLocal
export let syncToLocal = function(data){


  return new Promise( function (resolve, reject) {
    
    http.post({
      url: `/fs/tolocal${data.parent}${window.auth.isAdmin?'?issys=true':''}`
    }).then(res=>{
      resolve(res.data);
    }).catch(err=>{
      reject(err.data);
    })
      
  })

};

// dfsUnZip
export let unzip = function(data,file){

  return new Promise( function (resolve, reject) {
    
    let fm = new FormData();
    fm.append("uploadfile", file);

    http.post({
      url: `/fs/import?depth=3&issys=true`,
      param: fm
    }).then(res=>{
      resolve(res.data);
    }).catch(err=>{
      reject(err);
    })
      
  })
};

// dfsZip
export let zip = function(data,file){

  return new Promise( function (resolve, reject) {
  
    http.post({
      url: `/fs/export?srcpath=${data.srcpath}&issys=true`,
      param:{
        responseType:"arraybuffer"
      }
    }).then(res=>{
      resolve(res.data);
    }).catch(err=>{
      reject(err);
    })
      
  })
};
