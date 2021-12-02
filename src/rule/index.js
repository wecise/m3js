/* 
  *  Http Request
  */
const http = require('../axios/http').default;

/* 
   * RULE 
  */
export let get = function(data){
    
    
    return new Promise( function (resolve, reject) {
        
      http.get({
        url: `/config/get`,
        param: {key:data} 
      }).then(res=>{
        resolve(res.data);
      }).catch(err=>{
        reject(err.data);
      })
        
    })

  };

export let add = function(data){

    return new Promise( function (resolve, reject) {
      
      let fm = new FormData();

      fm.append("key", data.key);
      fm.append("ttl", data.ttl ? data.ttl : '');
      fm.append("value", data.value);

      http.post({
        url: `/config/set`,
        param: fm
      }).then(res=>{
        resolve(res.data);
      }).catch(err=>{
        reject(err.data);
      })
        
    })
    
  };

export let update = function(data){

    return new Promise( function (resolve, reject) {
      
      let fm = new FormData();

      fm.append("key", data.key);
      fm.append("ttl", data.ttl ? data.ttl : '');
      fm.append("value", data.value);

      http.post({
        url: `/config/set`,
        param: fm
      }).then(res=>{
        resolve(res.data);
      }).catch(err=>{
        reject(err.data);
      })
        
    })
    
  };

export let remove = function(data){
    
    return new Promise( function (resolve, reject) {
      
      let fm = new FormData();

      fm.append("key", data.key);

      http.post({
        url: `/config/del`,
        param: fm
      }).then(res=>{
        resolve(res.data);
      }).catch(err=>{
        reject(err.data);
      })
    })
    
  };

  export let exportRule =  function(key,FileSaver){
    return new Promise( function (resolve, reject) {
      
      http.get({
        url: `/config/export?key=${key}`
      }).then(res=>{
        let blob = new Blob([JSON.stringify(res.data,null,2)], {type: "text/plain;charset=utf-8"});
        let fileName = `ETCD${key}_${new Date().toLocaleString()}.json`;
        FileSaver.saveAs(blob, fileName);
        resolve(fileName);
      }).catch(err=>{
        reject(err);
      })
    })
    
  };
  
  export let importRule = function(file){
  
    return new Promise( function (resolve, reject) {
      
      let fm = new FormData();
      fm.append("uploadfile", file);
  
      http.post({
        url: `/config/import`,
        param: fm,
        headers: {'Content-Type':'multipart/form-data'}
      }).then(res=>{
        resolve(res.data);
      }).catch(err=>{
        reject(err.data);
      })
    })
  };