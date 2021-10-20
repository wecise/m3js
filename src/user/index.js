/* 
  *  Http Request
  */
const http = require('../axios/http').default;

/* Org & User */
export let userList = function(data){
      
    return new Promise( function (resolve, reject) {
      
      http.get({
        url: `/admin/users?fullname=/`
      }).then(res=>{
        resolve(res.data);
      })
        
    })
};