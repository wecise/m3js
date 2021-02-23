/**
 * Copyright (c) 2020, Wecise
 * All rights reserved.
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
      (factory((global.m3 = global.m3 || {})));
}(this, (function (exports) {
  'use strict';

  const version = "1.0.0";

  /**
   *  sessionid for M3 platform
   * 
   * @static
   * @memberOf _
   * @since 1.0.0
   * @category 
   * @param 
   * @returns 
   * @example
   *
  */
  let baseUrl = "";
  let sessionid = "";
  let globalByUser = null;


  /* 
  *  Http Request
  */
  function ajax(opts) {
    let _url = "";

    // 测试环境
    if (process.env.NODE_ENV === "development") {

      if (opts.url.indexOf("http://") === -1 && opts.url.indexOf("https://") === -1) {
        if(opts.url.indexOf("?") === -1){
          _url = `${baseUrl}${opts.url}?sessionid=${sessionid}`;
        } else {
          _url = `${baseUrl}${opts.url}&sessionid=${sessionid}`;
        }
        
      } else {
        _url = opts.url;
      }

    } else {

      _url = opts.url;

    }

    let xhr = new XMLHttpRequest(),
      type = opts.type || 'GET',
      url = _url,
      params = opts.data,
      processData = opts.processData || true,
      dataType = opts.dataType || 'json';

    type = type.toUpperCase();

    if (type === 'GET') {
      params = (function (obj) {
        let str = '';

        for (let prop in obj) {
          str += prop + '=' + obj[prop] + '&'
        }
        str = str.slice(0, str.length - 1);
        
        return str;
      })(opts.data);
      url += url.indexOf('?') === -1 ? '?' + params : '&' + params;
    }

    xhr.open(type, url);

    if (opts.contentType) {
      xhr.setRequestHeader('Content-type', opts.contentType);
    }
    
    if (!opts.processData){
      let fm = new FormData();
      _.forEach(params,(v,k)=>{
        fm.append(k,v);
      })
      xhr.send(params ? fm : null);
    } else{
      xhr.send(params ? params : null);
    }

    //return promise
    return new Promise(function (resolve, reject) {
      //onload are executed just after the sync request is comple，
      //please use 'onreadystatechange' if need support IE9-
      xhr.onload = function () {
        if (xhr.status === 200) {
          let result;
          try {
            result = JSON.parse(xhr.response);
          } catch (e) {
            result = xhr.response;
          }
          resolve(result);
        } else {
          reject(xhr.response);
        }
      };

    });
  };

  /* 
  *  connect to M3 platform and return sessionid  For development env
  */
  let connect = async function (http, url, port, company, username, password) {

      baseUrl = http + "://" + [url, port].join(":");

      let opts = {
        url: `${baseUrl}/user/signin?company=${company}&username=${username}&password=${password}`,
        type: 'post'
      };

      return new Promise( await function (resolve, reject) {
        
        ajax(opts).then((rtn) => {
          sessionid = rtn.message;
          init();
          resolve(rtn);
        }).catch((err)=>{
          window.location.href=baseUrl;
          if(typeof err === 'string'){
            reject(JSON.parse(err));
          } else {
            reject(err);
          }
          
        })
    })

  };

  /* 
   *  Call a serverJS interface for M3 platform
   */
  let callFS = async function (fileName, input) {
    let opts = { url: `/script/exec/js?filepath=${fileName}&input=${input}&isfile=true`, type: 'POST' };
    
    return new Promise( await function (resolve, reject) {
        
        ajax(opts).then((rtn) => {
          resolve(rtn);
        }).catch((err)=>{
          if(typeof err === 'string'){
            reject(JSON.parse(err));
          } else {
            reject(err);
          }
          
        })
    })

  };

  /* 
   *  Init Global let
  */
  let init = async function () {

    await globalHandler();
    //langHandler();   
    await auth(); 

  };

  /* 
   *   当前用户权限 
  */
  let auth = async function () {
    let rt = {};
    
    try {

      await callFS("/matrix/user/signedUser.js").then( (rtn) => {
        let tmp = { signedUser: rtn.message, isAdmin: rtn.message.isadmin };
        window.auth = tmp;
        _.extend(rt, tmp);
      });

    } catch (err) {
       rt = null;
    }

    exports.auth = rt;
  };

  /*
  * 通过选项创建 VueI18n 实例
  */
  let lang = async function() {
    
    return new Promise( await function (resolve, reject) {
        
        let cache = localStorage.getItem("M3-LANG-LIST");
        
        if (cache) {
          
          resolve(JSON.parse(cache));

        } else {

          callFS("/matrix/lang/getLangList.js", null).then((rtn) => {

            localStorage.setItem("M3-LANG-LIST", JSON.stringify(rtn.message));

            resolve(rtn.message);

          }).catch((err)=>{
            if(typeof err === 'string'){
              reject(JSON.parse(err));
            } else {
              reject(err);
            }
          });

        }  
        
    })

  };

  /* 
   *  Get global register info for M3 platform
   */
  let globalHandler = async function () {
    await callFS("/matrix/utils/global.js", null).then((rtn) => {
      exports.global = rtn.message;
    });
  };

  /* 
   *  Get global register info by username for M3 platform
   */
  let globalByUserHandler = function (parent, name) {
    let opts = { url: `/fs${parent}/${name}&type=file` };
    ajax(opts).then((rtn) => {
      globalByUser = rtn;
    }).catch((err) => {
      globalByUser = err;
    });
  };

  /* 
   *  Set Home for login user
   */
  let setAppAsHome = async function(vm,item){
    
    let opts = { 
                    url: '/user/settings/home', 
                    type: 'POST', 
                    data: JSON.stringify({
                      home: item.url.split("").slice(1,item.url.length).join(""),
                      _csrf: sessionid
                    }),
                    contentType: false
                };
    let rt = null;
    await ajax(opts).then((rtn) => {
      rt = rtn;
      
      vm.$message({
        type: "info",
        message: "首页已设置为：" + item.url
      });

    }).catch((err) => {
      vm.$message({
        type: "error",
        message: "首页设置失败：" + err
      });
      rt = err;
    });

    return rt;
};

/* 
*  Set Home for all user
*/
let setAppAsHomeForAllUser = async function(vm,item){
    
    let opts = { 
        url: '/admin/users/home', 
        type: 'POST', 
        data: {
          home: item.url.split("").slice(1,item.url.length).join(""),
          _csrf: sessionid
        },
        contentType: false
    };
    
    let rt = null;

    await ajax(opts).then((rtn) => {
      rt = rtn;

      vm.$message({
        type: "info",
        message: "首页已设置为：" + item.url
      });
      
      }).catch((err) => {
      rt = err;
    });

    return rt;
  };

  /* 
   *  Set Title for M3 platform
   */ 
  let setTitle = async function(auth){
      try{
          
          let pathName = window.location.pathname;
          
          if(_.isEmpty(pathName)){
              document.title = auth.Company.title;
              return false;
          }
          
          await callFS("/matrix/system/getAppNameByUrl.js", encodeURIComponent(pathName)).then( (rtn)=>{
              let name = rtn.message;

              if(!_.isEmpty(name)){
                  if(window.M3_LANG == 'zh-CN'){
                      document.title = name['cnname'];
                  } else {
                      document.title = name['enname'];
                  }
              } else {
                  document.title = auth.Company.title;
              }
          } );
          
      } catch(err){
          document.title = auth.Company.title;
      }
  };
  
  /* 
   * RULE 
  */
  let ruleGet = async function(data){
    
    let opts = { 
        url: '/config/get', 
        type: 'GET', 
        data:{key:data}
    };
    
    return new Promise( await function (resolve, reject) {
        
        ajax(opts).then((rtn) => {
          resolve(rtn);
        }).catch((err)=>{
          if(typeof err === 'string'){
            reject(JSON.parse(err));
          } else {
            reject(err);
          }
          
        })
    })
  };

  let ruleAdd = function(){

  };

  let ruleDelete = function(){

  };

  let ruleExport = function(){

  };

  /* 
   * JOB 
    */
  let jobNew = function(){

  };


  /* 
   *  DFS 
  */
  let dfsWrite = function () {

  };

  let dfsRead = function () {

  };

  let dfsNew = async function(data) {
    
    let opts = { 
        url: `/fs${data.parent}/${data.name}${window.auth.isAdmin?'?issys=true':''}`, 
        type: 'PUT', 
        contentType: false,
        processData: false,
        data:data.data
    };
    
    return new Promise( await function (resolve, reject) {
        
        ajax(opts).then((rtn) => {
          resolve(rtn);
        }).catch((err)=>{
          if(typeof err === 'string'){
            reject(JSON.parse(err));
          } else {
            reject(err);
          }
          
        })
    })

  };

  let dfsDelete = async function(data) {
    
    let opts = { 
        url: `/fs${data.parent}/${data.name}${window.auth.isAdmin?'?issys=true':''}`, 
        type: 'DELETE', 
        contentType: false
    };
    
    return new Promise( await function (resolve, reject) {
        
        ajax(opts).then((rtn) => {
          resolve(rtn);
        }).catch((err)=>{
          if(typeof err === 'string'){
            reject(JSON.parse(err));
          } else {
            reject(err);
          }
          
        })
    })

  };

  let dfsRename = async function(data){
    
    let opts = { 
        url: `/fs/rename${window.auth.isAdmin?'?issys=true':''}`, 
        type: 'POST', 
        processData: false,
        data
    };

    return new Promise( await function (resolve, reject) {
        ajax(opts).then((rtn) => {
          resolve(rtn);
        }).catch((err)=>{
          if(typeof err === 'string'){
            reject(JSON.parse(err));
          } else {
            reject(err);
          }
          
        })
    })

  }
  
  let dfsUpdateAttr = async function(data){
    let opts = { 
        url: `/fs${data.parent}/${data.name}?type=attr${window.auth.isAdmin?'&issys=true':''}`, 
        type: 'PUT', 
        processData: false,
        contentType: false,
        data: {attr: data.attr}
    };
    
    return new Promise( await function (resolve, reject) {
        
        ajax(opts).then((rtn) => {
          resolve(rtn);
        }).catch((err)=>{
          if(typeof err === 'string'){
            reject(JSON.parse(err));
          } else {
            reject(err);
          }
          
        })
    })
  }

  /* Console Log */
  let consolelogTrace = async function(data){
      
      let opts = { 
          url: `/consolelog/${data.type}?name=${encodeURIComponent( data.name )}&limit=${data.param.limit}`, 
          type: 'GET'
      };

      if(data.param.level != null && data.param.level.length > 0){
          opts.url = `${opts.url}&level=${data.param.level.join("&level=")}`;
      }
      
      return new Promise( await function (resolve, reject) {
          
          ajax(opts).then((rtn) => {
            resolve(rtn);
          }).catch((err)=>{
            if(typeof err === 'string'){
              reject(JSON.parse(err));
            } else {
              reject(err);
            }
            
          })
      })
  };

  let consolelogDelete = async function(data){
    let opts = { 
        url: `/consolelog/${data.type}?name=${encodeURIComponent( data.name )}`, 
        type: 'DELETE'
    };
    
    return new Promise( await function (resolve, reject) {
        
        ajax(opts).then((rtn) => {
          resolve(rtn);
        }).catch((err)=>{
          if(typeof err === 'string'){
            reject(JSON.parse(err));
          } else {
            reject(err);
          }
          
        })
    })
  };

  let consolelogTruncate = async function(data){
    let opts = { 
        url: `/consolelog/${data.type}/truncate`, 
        type: 'DELETE'
    };
    
    return new Promise( await function (resolve, reject) {
        
        ajax(opts).then((rtn) => {
          resolve(rtn);
        }).catch((err)=>{
          if(typeof err === 'string'){
            reject(JSON.parse(err));
          } else {
            reject(err);
          }
          
        })
    })
  };


  /* 告警视图结构 */
  let EventViewDataObj = {
    info:{
      name: "新建视图",
      desc: ""  
    },
    datasource: {
      name: "数据源",
      class: "",
      fields: [],
      filter: ""
    },
    view: {
      columns: []
    }
  };

  /* Utils */
  // 单位转换
  let bytesToSize = function(bytes) {
      var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
      if (bytes == 0) return '0 Byte';
      var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
      return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
  };

  // 全屏控制
  let fullScreen = function(mode) {
    if ( mode ) {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) {
            document.documentElement.msRequestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }
  };


  exports.sessionid = sessionid;
  exports.version = version;
  exports.init = init;
  exports.connect = connect;
  exports.callFS = callFS;
  exports.lang = lang;
  exports.setTitle = setTitle;
  exports.setAppAsHome = setAppAsHome;
  exports.setAppAsHomeForAllUser = setAppAsHomeForAllUser;
  exports.fullScreen = fullScreen;
  /* dfs */
  exports.dfsNew = dfsNew;
  exports.dfsDelete = dfsDelete;
  exports.dfsRename = dfsRename;
  exports.dfsUpdateAttr = dfsUpdateAttr;
  /* rule */
  exports.ruleGet = ruleGet;
  exports.ruleAdd = ruleAdd;
  exports.ruleDelete = ruleDelete;
  exports.ruleExport = ruleExport;
  
  /* console log */
  exports.consolelogTrace = consolelogTrace;
  exports.consolelogDelete = consolelogDelete;
  exports.consolelogTruncate = consolelogTruncate;

  exports.EventViewDataObj = EventViewDataObj;

  /* utils */
  exports.bytesToSize = bytesToSize;

  Object.defineProperty(exports, '__esModule', { value: true });

})))