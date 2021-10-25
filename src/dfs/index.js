/* 
  *  Http Request
  */
const http = require('../axios/http').default;

export let dfsList = function (data) {
      
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

export let dfsWrite = function(data) {
  
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
      dfsSyncToLocal(data);
      resolve(res.data);
    }).catch(err=>{
      reject(err);
    })
      
  })

};


export let dfsRead = function(data){

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

export let dfsNew = function(data) {
  
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
      dfsSyncToLocal(data);
      resolve(data.name);
    }).catch(err=>{
      reject(err.data);
    })
      
  })

};

export let dfsDelete = function(data) {
  
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

export let dfsRename = function(data){
  
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

export let dfsUpdateAttr = function(data){

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

export let dfsRefresh = function(data){

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

export let dfsMove = function(data){

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


export let dfsSyncToLocal = function(data){


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


export let dfsUnZip = function(data,file){

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

export let dfsZip = function(data,file){

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
