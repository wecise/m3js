/* 
  *  Http Request
  */
const http = require('../axios/http').default;

export let dfsList = async function (data) {
      
    return new Promise( await function (resolve, reject) {
        
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

export let dfsWrite = async function(data) {
  
  return new Promise( await function (resolve, reject) {
    
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


export let dfsRead = async function(data){

  return new Promise( await function (resolve, reject) {
    
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

export let dfsNew = async function(data) {
  
  return new Promise( await function (resolve, reject) {
    
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

export let dfsDelete = async function(data) {
  
  return new Promise( await function (resolve, reject) {
    
    http.delete({
      url: `/fs${data.parent}/${data.name}${window.auth.isAdmin?'?issys=true':''}`
    }).then(res=>{
      resolve(res.data);
    }).catch(err=>{
      reject(err.data);
    })
      
  })

};

export let dfsRename = async function(data){
  
  return new Promise( await function (resolve, reject) {
    
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

export let dfsUpdateAttr = async function(data){

  return new Promise( await function (resolve, reject) {
    
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

export let dfsRefresh = async function(data){

  return new Promise( await function (resolve, reject) {
    
    http.post({
      url: `/fs/tolocal/${data.name}${window.auth.isAdmin?'?issys=true':''}`
    }).then(res=>{
      resolve(res.data);
    }).catch(err=>{
      reject(err.data);
    })
      
  })
}

export let dfsMove = async function(data){

  return new Promise( await function (resolve, reject) {
    
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


export let dfsSyncToLocal = async function(data){


  return new Promise( await function (resolve, reject) {
    
    http.post({
      url: `/fs/tolocal${data.parent}${window.auth.isAdmin?'?issys=true':''}`
    }).then(res=>{
      resolve(res.data);
    }).catch(err=>{
      reject(err.data);
    })
      
  })

};


export let dfsUnZip = async function(data,file){

  return new Promise( await function (resolve, reject) {
    
    let fm = new FormData();
    fm.append("uploadfile", file);

    http.post({
      url: `/fs/import${window.auth.isAdmin?'?depth=3&issys=true':''}`,
      param: fm
    }).then(res=>{
      resolve(res.data);
    }).catch(err=>{
      reject(err.data);
    })
      
  })
};
