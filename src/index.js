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

  let fullScreenByEl = function(el) {
        
      if (document.fullscreenElement) {
          document.exitFullscreen();
          return false;
      } else {
          el.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
          return true;
      }

  }

  

  /* global */
  exports.version = version;
  exports.init = init;
  exports.connect = connect;
  exports.callFS = callFS;
  exports.lang = lang;
  exports.setTitle = setTitle;
  exports.setAppAsHome = setAppAsHome;
  exports.setAppAsHomeForAllUser = setAppAsHomeForAllUser;
  exports.fullScreen = fullScreen;
  exports.fullScreenByEl = fullScreenByEl;
  const theme = require("./global/theme.js");
  exports.EDITOR_THEME = theme.EDITOR_THEME;

  /* omdb */
  const omdb = require('./omdb/index.js');
  exports.getClassFieldsById = omdb.getClassFieldsById;


  /* job */
  const job = require('./job/index.js');
  exports.jobNew = job.userList;

  /* user */
  const user = require('./user/index.js');
  exports.userList = user.userList;

  /* dfs */
  const dfs = require('./dfs/index.js');
  exports.dfsList = dfs.dfsList;
  exports.dfsWrite = dfs.dfsWrite;
  exports.dfsRead = dfs.dfsRead;
  exports.dfsNew = dfs.dfsNew;
  exports.dfsDelete = dfs.dfsDelete;
  exports.dfsRename = dfs.dfsRename;
  exports.dfsUpdateAttr = dfs.dfsUpdateAttr;
  exports.dfsRefresh = dfs.dfsRefresh;
  exports.dfsMove = dfs.dfsMove;
  exports.dfsSyncToLocal = dfs.dfsSyncToLocal;

  /* rule */
  const rule = require('./rule/index.js');
  exports.ruleGet = rule.ruleGet;
  exports.ruleAdd = rule.ruleAdd;
  exports.ruleUpdate = rule.ruleUpdate;
  exports.ruleDelete = rule.ruleDelete;
  exports.ruleExport = rule.ruleExport;
  
  /* policy */
  const policy = require('./policy/index.js');
  exports.policyDeploy = policy.policyDeploy;
  exports.policyUndeploy = policy.policyUndeploy;

  /* console log */
  const consolelog = require('./consolelog/index.js');
  exports.consolelogTrace = consolelog.consolelogTrace;
  exports.consolelogDelete = consolelog.consolelogDelete;
  exports.consolelogTruncate = consolelog.consolelogTruncate;

  /* trigger */
  const trigger = require('./trigger/index.js');
  exports.triggerList = trigger.triggerList;
  exports.triggerNew = trigger.triggerNew;
  exports.triggerDelete = trigger.triggerDelete;

  const event = require("./global/event.js");
  exports.EventViewDataObj = event.EventViewDataObj;
  exports.EventViewTools = event.EventViewTools;



  /* utils */
  exports.bytesToSize = bytesToSize;
  exports.jsFormat = require("./utils/jsFormat.js");
  exports.htmlFormat = require("./utils/htmlFormat.js");
  
  const cookie = require("./utils/cookie.js");
  exports.getCookie = cookie.getCookie;

  Object.defineProperty(exports, '__esModule', { value: true });

})))