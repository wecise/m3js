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

      if (opts.url.indexOf("http://") === -1) {
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

    xhr.send(params ? params : null);

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
  let connect = async function (url, port, company, username, password) {

      baseUrl = "http://" + [url, port].join(":");

      let opts = {
        url: `${baseUrl}/user/signin?company=${company}&username=${username}&password=${password}`,
        type: 'post'
      };
      await ajax(opts).then((rtn) => {
        sessionid = rtn.message;
        
        init();

      }).catch((err) => {
        console.log(err)
        window.location.href=baseUrl;
      });

  };

  /* 
   *  Call a serverJS interface for M3 platform
   */
  let callFS = async function (fileName, input) {
    let opts = { url: `/script/exec/js?filepath=${fileName}&input=${input}&isfile=true`, type: 'POST' };
    let rt = null;
    await ajax(opts).then((rtn) => {
      rt = rtn;
    }).catch((err) => {
      rt = err;
    });

    return rt;
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
  *
  */
  // 通过选项创建 VueI18n 实例
  let lang = async function() {
    
    try {

      let cache = localStorage.getItem("M3-LANG-LIST");
      
      if (cache) {
        
        // return new VueI18n({
        //   locale: window.M3_LANG,
        //   messages: JSON.parse(cache)
        // });

        return JSON.parse(cache);

      } else {

        await callFS("/matrix/lang/getLangList.js", null).then((rtn) => {

          localStorage.setItem("M3-LANG-LIST", JSON.stringify(rtn.message));

          return rtn.message;

        });

      }

    } catch (err) {
      return null;
    }

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
   *  DFS 
  */
  var dfsWrite = function () {

  };

  var dfsRead = function () {

  };

  /* 全屏控制 */
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

  Object.defineProperty(exports, '__esModule', { value: true });

})))