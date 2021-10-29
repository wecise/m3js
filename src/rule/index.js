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

export let exportRule = function(){

};