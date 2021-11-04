/*

        #     #  #####  ####### ######       ##        #####  ######  ####### #     # ######
        #     # #     # #       #     #     #  #      #     # #     # #     # #     # #     #
        #     # #       #       #     #      ##       #       #     # #     # #     # #     #
        #     #  #####  #####   ######      ###       #  #### ######  #     # #     # ######
        #     #       # #       #   #      #   # #    #     # #   #   #     # #     # #
        #     # #     # #       #    #     #    #     #     # #    #  #     # #     # #
         #####   #####  ####### #     #     ###  #     #####  #     # #######  #####  #

 */
         const http = require('../axios/http').default;

         /* Get User All List */
         export let list = function(data){
               
             return new Promise( function (resolve, reject) {
               
               http.get({
                 url: `/admin/users?fullname=/`
               }).then(res=>{
                 resolve(res.data);
               })
                 
             })
         };
         
         /* Get User List By Fullname */
         export let listByFullname = function(data){
               
             return new Promise( function (resolve, reject) {
               
               http.get({
                 url: `/admin/users?fullname=${data}`
               }).then(res=>{
                 resolve(res.data);
               })
                 
             })
         };    
         
         /* Add User */
         export let add = function(data){
               
             return new Promise( function (resolve, reject) {
               
               http.post({
                 url: `/admin/users/new`,
                 param: JSON.stringify(data)
               }).then(res=>{
                 resolve(res.data);
               })
                 
             })
         };  
         
         /* Update User */
         export let update = function(data){
               
             return new Promise( function (resolve, reject) {
               
                 let fm = {
                     email: data.email, 
                     mobile: data.mobile,
                     telephone: data.telephone,
                     firstname: data.firstname,
                     lastname: data.lastname,
                     wechat: data.wechat,
                     address: data.address,
                     isactive: data.isactive,
                     isadmin: data.isadmin,
                     status: data.status
                 };
         
                 if(data.resetPasswd){
                     _.extend(fm, {passwd: data.passwd});
                 }
                 
                 http.post({
                     url: `/admin/users/${data.id}`,
                     param: JSON.stringify(fm)
                 }).then(res=>{
                     resolve(res.data);
                 })
                 
             })
         };  
         
         /* Remove User */
         export let remove = function(data){
               
             return new Promise( function (resolve, reject) {
               
               http.delete({
                 url: `/admin/users/${data.id}`,
                 param: JSON.stringify(data)
               }).then(res=>{
                 resolve(res.data);
               })
                 
             })
         };  
         
         /* Update UserGroup */
         export let updateUserGroup = function(user,newGroup){
               
             return new Promise( function (resolve, reject) {
               
               http.get({
                 url: `/admin/users/${user.id}?to=${newGroup.id}`,
                 param: JSON.stringify(data)
               }).then(res=>{
                 resolve(res.data);
               })
                 
             })
         };  
                
         /* Signin */
         export let signIn = function(keyspace, username, password){
               
             return new Promise( function (resolve, reject) {
               
               http.post({
                 url: `/user/signin`,
                 param: {
                     company: keyspace,
                     username: username,
                     password: password
                 }
               }).then(res=>{
                 resolve(res.data);
               })
                 
             })
         };
               