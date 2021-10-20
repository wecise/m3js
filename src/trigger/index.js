/* 
  *  Http Request
  */
const http = require('../axios/http').default;


/* Trigger */
export let triggerList = function(className){
      
    return new Promise( function (resolve, reject) {
      
      http.get({
        url: `/mxobject/trigger?class=${encodeURIComponent(className)}`
      }).then(res=>{
        resolve(res.data);
      }).catch(err=>{
        reject(err.data);
      })
        
    })
};

export let triggerNew = function(data){
    
    return new Promise( function (resolve, reject) {
      
      http.put({
        url: `/mxobject/trigger`,
        param: data
      }).then(res=>{
        resolve(res.data);
      }).catch(err=>{
        reject(err.data);
      })
        
    })
};

export let triggerDelete = function(className,name){
    
  return new Promise( function (resolve, reject) {
    
    http.delete({
      url: `/mxobject/trigger?class=${encodeURIComponent(className)}&name=${name}`,
      param: event
    }).then(res=>{
      resolve(res.data);
    }).catch(err=>{
      reject(err.data);
    })
      
  })
};