/* 
  *  Http Request
  */
const http = require('../axios/http').default;


/* Trigger */
export let list = function(className){
      
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

export let newTrigger = function(data){
    
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

export let deleteTrigger = function(className,name){
    
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