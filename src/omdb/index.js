/* 
  *  Http Request
  */
const http = require('../axios/http').default;

/* OMDB */
export let getClassFieldsById = async function(id){
  
  return new Promise( await function (resolve, reject) {
      
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