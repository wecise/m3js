/* 
  *  Http Request
  */
const http = require('../axios/http').default;


/* Trigger */
export let triggerList = async function(className){
      
    return new Promise( await function (resolve, reject) {
      
      http.get({
        url: `/mxobject/trigger?class=${encodeURIComponent(className)}`
      }).then(res=>{
        resolve(res.data);
      }).catch(err=>{
        reject(err.data);
      })
        
    })
};

export let triggerNew = async function(data){
    
    return new Promise( await function (resolve, reject) {
      
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

export let triggerDelete = async function(className,name){
    
  return new Promise( await function (resolve, reject) {
    
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