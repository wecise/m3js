/* 
  *  Http Request
  */
const http = require('../axios/http').default;


/* Console Log */
export let consolelogTrace = async function(data){
      
    return new Promise( await function (resolve, reject) {
      
      let url = "";
      
      if(data.type==='trigger'){
        url = `/consolelog/${data.type}?name=${encodeURIComponent( data.class )}${encodeURIComponent( '#'+data.name )}&limit=${data.param.limit}`;
      } else {
        url = `/consolelog/${data.type}?name=${encodeURIComponent( data.name )}&limit=${data.param.limit}`
      }
      
      if(data.param.level != null && data.param.level.length > 0){
          url = `${url}&level=${data.param.level.join("&level=")}`;
      }

      http.get({
        url: url
      }).then(res=>{
        resolve(res.data);
      })
        
    })
};

export let consolelogDelete = async function(data){
  
  return new Promise( await function (resolve, reject) {
      
    http.delete({
      url: `/consolelog/${data.type}?name=${encodeURIComponent( data.name )}`
    }).then(res=>{
      resolve(res.data);
    }).catch(err=>{
      reject(err.data);
    })
      
  })

};

export let consolelogTruncate = async function(data){
  return new Promise( await function (resolve, reject) {
      
    http.delete({
      url: `/consolelog/${data.type}/truncate`
    }).then(res=>{
      resolve(res.data);
    }).catch(err=>{
      reject(err.data);
    })
      
  })
};