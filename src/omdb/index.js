/* 
  *  Http Request
  */
const http = require('../axios/http').default;

/* OMDB */
export let getClassFieldsById = function(id){
  
  return new Promise( function (resolve, reject) {
      
    http.get({
      url: `/mxobject/schema/class/fields`,
      param: {id:id} 
    }).then(res=>{
      resolve(res.data);
    }).catch(err=>{
      reject(err.data);
    })
      
  })
}