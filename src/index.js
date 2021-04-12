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
  
  /* 
  *  Http Request
  */
 const http = require('./axios/http').default;
  

  /* 
  *  connect to M3 platform and return sessionid  For development env
  */
  let connect = async function (param) {

    return new Promise( await function (resolve, reject) {

      http.post({
        url: `/user/signin?company=${ encodeURIComponent(param.company) }&username=${ encodeURIComponent(param.username) }&password=${ encodeURIComponent(param.password) }`
      }).then(res=>{
        window.sessionid = res.data.message;
        init();
        resolve(res);
      }).catch(err=>{
        reject(err.data);
      })
      
    })

  };

  /* 
   *  Call a serverJS interface for M3 platform
   */
  let callFS = async function (fileName, input) {
    
    return new Promise( await function (resolve, reject) {
        
      http.post({
        url: `/script/exec/js?filepath=${fileName}&input=${input}&isfile=true`
      }).then(res=>{
        resolve(res.data);
      }).catch(err=>{
        reject(err.data);
      })
        
    })

  };

  /* 
   *   当前用户权限 
  */
  let auth = async function () {
    
    return new Promise( await function (resolve, reject) {
      let rt = {};
      callFS("/matrix/user/signedUser.js").then(res=>{
        let tmp = { signedUser: res.message, isAdmin: res.message.isadmin };
        window.auth = tmp;
        _.extend(rt,tmp);
        resolve(rt);
      })
      exports.auth = rt;
        
    })
  };

  /* 
   *  Get global register info for M3 platform
   */
  let global = async function () {

    return new Promise( await function (resolve, reject) {
      
      callFS("/matrix/utils/global.js").then(res=>{
        exports.global = res.message;
      })
        
    })

  };

  /* 
   *  Init Global let
  */
  let init = function () {

    Promise.all([auth(),global()]);

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

          callFS("/matrix/lang/getLangList.js").then(res=>{
              localStorage.setItem("M3-LANG-LIST", JSON.stringify(res.message));
              resolve(res.message);
          })

        }  
        
    })

  };


  /* 
   *  Set Home for login user
   */
  let setAppAsHome = async function(vm,item){
    
    return new Promise( await function (resolve, reject) {
      
      let fm = new FormData();

      fm.append("home", item.url.split("").slice(1,item.url.length).join(""));
      fm.append("_csrf", getCookie("_csrf"))

      http.post({
        url: `/user/settings/home`,
        param: fm
      }).then(res=>{
        vm.$message({
          type: "info",
          message: "首页已设置为：" + item.url
        });
        resolve(res.data);
      }).catch(err=>{
        vm.$message({
          type: "error",
          message: "首页设置失败：" + err
        });
        reject(err.data);
      })
        
    })

};

  /* 
  *  Set Home for all user
  */
  let setAppAsHomeForAllUser = async function(vm,item){
    
    return new Promise( await function (resolve, reject) {
      
      let fm = new FormData();

      fm.append("home", item.url.split("").slice(1,item.url.length).join(""));
      fm.append("_csrf", getCookie("_csrf"))

      http.post({
        url: `/admin/users/home`,
        param: fm
      }).then(res=>{
        vm.$message({
          type: "info",
          message: "首页已设置为：" + item.url
        });
        resolve(res.data);
      }).catch(err=>{
        vm.$message({
          type: "error",
          message: "首页设置失败：" + err
        });
        reject(err.data);
      })
        
    })

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
          
          await callFS("/matrix/system/getAppNameByUrl.js", encodeURIComponent(pathName)).then( res=>{
              let name = res.message;

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

  /* OMDB */
  let getClassFieldsById = async function(id){
    
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
  
  /* 
   * RULE 
  */
  let ruleGet = async function(data){
    
    
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

  let ruleAdd = async function(data){

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

  let ruleDelete = async function(data){
    
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
  let dfsList = async function (data) {
      
      return new Promise( await function (resolve, reject) {
          
        http.get({
          url: `/fs${data.parent}${window.auth.isAdmin?'?issys=true':''}`,
          param: {
            type: 'dir'
          }
        }).then(res=>{
          resolve(res.data);
        }).catch(err=>{
          reject(err.data);
        })
          
      })
    
  };

  let dfsWrite = async function(data) {
    
    return new Promise( await function (resolve, reject) {
      
      let fm = new FormData();

      fm.append("data", data.data.content);
      fm.append("type", data.data.ftype);
      fm.append("attr", JSON.stringify(data.data.attr)=='{}'?'':JSON.stringify(data.data.attr));
      fm.append("index", true);

      http.put({
        url: `/fs${data.parent}/${data.name}${window.auth.isAdmin?'?issys=true':''}`,
        param: fm
      }).then(res=>{
        dfsSyncToLocal(data);
        resolve(res.data);
      }).catch(err=>{
        reject(err);
      })
        
    })

  };

  let dfsRead = async function(data){

    return new Promise( await function (resolve, reject) {
        
      http.get({
        url: `/fs${data.parent}/${data.name}${window.auth.isAdmin?'?issys=true':''}`,
        param: {
          type: 'file'
        }
      }).then(res=>{
        resolve(res.data);
      }).catch(err=>{
        reject(err.data);
      })
        
    })

  };

  let dfsNew = async function(data) {
    
    return new Promise( await function (resolve, reject) {
      
      let fm = new FormData();

      fm.append("data", data.data.content);
      fm.append("type", data.data.ftype);
      fm.append("attr", JSON.stringify(data.data.attr)=='{}'?'':JSON.stringify(data.data.attr));
      fm.append("index", true);

      http.put({
        url: `/fs${data.parent}/${data.name}${window.auth.isAdmin?'?issys=true':''}`,
        param: fm,
        config: {
          contentType: false
        }
      }).then(res=>{
        dfsSyncToLocal(data);
        resolve(data.name);
      }).catch(err=>{
        reject(err.data);
      })
        
    })

  };

  let dfsDelete = async function(data) {
    
    return new Promise( await function (resolve, reject) {
      
      http.delete({
        url: `/fs${data.parent}/${data.name}${window.auth.isAdmin?'?issys=true':''}`
      }).then(res=>{
        resolve(res.data);
      }).catch(err=>{
        reject(err.data);
      })
        
    })

  };

  let dfsRename = async function(data){
    
    return new Promise( await function (resolve, reject) {
      
      let fm = new FormData();
      fm.append("srcpath", data.srcpath);
      fm.append("dstpath", data.dstpath);

      http.post({
        url: `/fs/rename${window.auth.isAdmin?'?issys=true':''}`,
        param: fm
      }).then(res=>{
        resolve(res.data);
      }).catch(err=>{
        reject(err.data);
      })
        
    })
  

  }
  
  let dfsUpdateAttr = async function(data){

    return new Promise( await function (resolve, reject) {
      
      let fm = new FormData();
      fm.append("attr", data.attr);

      http.put({
        url: `/fs${data.parent}/${data.name}?type=attr${window.auth.isAdmin?'&issys=true':''}`,
        param: fm
      }).then(res=>{
        resolve(res.data);
      }).catch(err=>{
        reject(err.data);
      })
        
    })

  }

  let dfsRefresh = async function(data){

    return new Promise( await function (resolve, reject) {
      
      http.post({
        url: `/fs/tolocal/${data.name}${window.auth.isAdmin?'?issys=true':''}`
      }).then(res=>{
        resolve(res.data);
      }).catch(err=>{
        reject(err.data);
      })
        
    })
  }

  let dfsMove = async function(data){

    return new Promise( await function (resolve, reject) {
      
      let fm = new FormData();
      fm.append("srcpath", data.srcpath.replace(/\/\//g,'/'));
      fm.append("dstpath", data.dstpath.replace(/\/\//g,'/'));

      http.post({
        url: `/fs/move${window.auth.isAdmin?'?issys=true':''}`,
        param: fm
      }).then(res=>{
        resolve(res.data);
      }).catch(err=>{
        reject(err.data);
      })
        
    })

  };


  let dfsSyncToLocal = async function(data){


    return new Promise( await function (resolve, reject) {
      
      http.post({
        url: `/fs/tolocal${data.parent}${window.auth.isAdmin?'?issys=true':''}`
      }).then(res=>{
        resolve(res.data);
      }).catch(err=>{
        reject(err.data);
      })
        
    })

  };

  /* Org & User */
  let userList = async function(data){
      
    return new Promise( await function (resolve, reject) {
      
      http.get({
        url: `/admin/users?fullname=/`
      }).then(res=>{
        resolve(res.data);
      })
        
    })
};

  /* Console Log */
  let consolelogTrace = async function(data){
      
      return new Promise( await function (resolve, reject) {
        
        let url = `/consolelog/${data.type}?name=${encodeURIComponent( data.name )}&limit=${data.param.limit}`
        
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

  let consolelogDelete = async function(data){
    
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

  let consolelogTruncate = async function(data){
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

  /* Trigger */
  let triggerList = async function(className){
      
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

  let triggerNew = async function(data){
      
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

let triggerDelete = async function(className,name){
      
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

  /* 告警视图结构 */
  let EventViewDataObj = {
    info:{
      name: "新建视图",
      desc: ""  
    },
    datasource: {
      name: "数据源",
      class: "",
      fields: {},
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

  // Get cookie
  let getCookie = function(key){
    if (document.cookie.length>0) {
      let c_start=document.cookie.indexOf(key + "=")
        if (c_start!=-1){ 
          c_start=c_start + key.length+1 
          let c_end=document.cookie.indexOf(";",c_start)
          if (c_end==-1) c_end=document.cookie.length
          return unescape(document.cookie.substring(c_start,c_end))
        } 
      }
    return ""
  };

  let EDITOR_THEME = [
                        {
                        name: "亮色",
                        items: [
                            { name: "chrome" },
                            { name: "clouds" },
                            { name: "crimson_editor" },
                            { name: "dawn" },
                            { name: "dreamweaver" },
                            { name: "eclipse" },
                            { name: "github" },
                            { name: "iplastic" },
                            { name: "solarized_light" },
                            { name: "textmate" },
                            { name: "tomorrow" },
                            { name: "xcode" },
                            { name: "kuroir" },
                            { name: "katzenmilch" },
                            { name: "sqlserver" },
                        ],
                        },
                        {
                        name: "暗色",
                        items: [
                            { name: "ambiance" },
                            { name: "chaos" },
                            { name: "clouds_midnight" },
                            { name: "dracula" },
                            { name: "cobalt" },
                            { name: "gruvbox" },
                            { name: "gob" },
                            { name: "idle_fingers" },
                            { name: "kr_theme" },
                            { name: "merbivore" },
                            { name: "merbivore_soft" },
                            { name: "mono_industrial" },
                            { name: "monokai" },
                            { name: "pastel_on_dark" },
                            { name: "solarized_dark" },
                            { name: "terminal" },
                            { name: "tomorrow_night" },
                            { name: "tomorrow_night_blue" },
                            { name: "tomorrow_night_bright" },
                            { name: "tomorrow_night_eighties" },
                            { name: "twilight" },
                            { name: "vibrant_ink" },
                        ],
                        },
                    ];


  exports.version = version;
  exports.init = init;
  exports.connect = connect;
  exports.callFS = callFS;
  exports.lang = lang;
  exports.setTitle = setTitle;
  exports.setAppAsHome = setAppAsHome;
  exports.setAppAsHomeForAllUser = setAppAsHomeForAllUser;
  exports.fullScreen = fullScreen;

  /* omdb */
  exports.getClassFieldsById = getClassFieldsById;

  /* user */
  exports.userList = userList;

  /* dfs */
  exports.dfsList = dfsList;
  exports.dfsWrite = dfsWrite;
  exports.dfsRead = dfsRead;
  exports.dfsNew = dfsNew;
  exports.dfsDelete = dfsDelete;
  exports.dfsRename = dfsRename;
  exports.dfsUpdateAttr = dfsUpdateAttr;
  exports.dfsRefresh = dfsRefresh;
  exports.dfsMove = dfsMove;
  exports.dfsSyncToLocal = dfsSyncToLocal;

  /* rule */
  exports.ruleGet = ruleGet;
  exports.ruleAdd = ruleAdd;
  exports.ruleDelete = ruleDelete;
  exports.ruleExport = ruleExport;
  
  /* console log */
  exports.consolelogTrace = consolelogTrace;
  exports.consolelogDelete = consolelogDelete;
  exports.consolelogTruncate = consolelogTruncate;

  /* trigger log */
  exports.triggerList = triggerList;
  exports.triggerNew = triggerNew;
  exports.triggerDelete = triggerDelete;

  exports.EventViewDataObj = EventViewDataObj;

  exports.EDITOR_THEME = EDITOR_THEME;

  /* utils */
  exports.bytesToSize = bytesToSize;
  exports.jsFormat = require("./utils/jsFormat.js");
  exports.htmlFormat = require("./utils/htmlFormat.js");
  exports.getCookie = getCookie;

  Object.defineProperty(exports, '__esModule', { value: true });

})))