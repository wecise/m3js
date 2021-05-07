/* 
  *  Http Request
  */
const http = require('../axios/http').default;

/* Org & User */
export let userList = async function(data){
      
    return new Promise( await function (resolve, reject) {
      
      http.get({
        url: `/admin/users?fullname=/`
      }).then(res=>{
        resolve(res.data);
      })
        
    })
};