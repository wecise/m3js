/* 
  *  Http Request
  */
const http = require('../axios/http').default;

/* 
   * RULE 
  */
export let ruleGet = async function(data){
    
    
    return new Promise( await function (resolve, reject) {
        
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

export let ruleAdd = async function(data){

    return new Promise( await function (resolve, reject) {
      
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

export let ruleUpdate = async function(data){

    return new Promise( await function (resolve, reject) {
      
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

export let ruleDelete = async function(data){
    
    return new Promise( await function (resolve, reject) {
      
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

export let ruleExport = function(){

};