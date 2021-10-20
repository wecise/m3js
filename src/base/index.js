/**
 * Wecise Applet Framework
 * 
 * Requirement: ES6
 * 
 * Copyright (c) 2020, Wecise
 * All rights reserved.
 */

const VERSION = "1.0.0";

import http from "../axios/http"

/**
 * 动态模块加载 import("...") 或 require("...") 只能用字符串做参数，不支持变量，
 * 以 `${variable}/...` 形式使用变量也必须含有部分字符串，否则会加载该所有能找到的模块
 */

// Default global variables
var loading = 0;
var G = window;
var auth = {};
var global = {};
G.m3 = this;

let m3config = {
    global: window,
    rootDivID: "app",
    lang: "zh-CN", 
    theme: "", // 默认使用cookie中保存的信息或使用内置缺省值
    displayLoadingState: false,
    mods: {},
}

/**
 * 两个对象的深度合并，合并结果保存在第一个对象中
 * 如果数据类型不同，第二个对象中对应的数据将覆盖第一个对象
 * 同一对象直接返回
 */
let merge = function (o, n, exclude_keys={}) {
    if(n===undefined) return o; //n 未定义，返回 o
    if(o===undefined) return n; //o 未定义，n有值，返回 n
    if(n==null || typeof n !== 'object') return n; //n 为空或不是对象，返回n
    if(o==null || typeof o !== 'object') return n; //o 为空或不是对象，n 是对象，返回n
    if(n === o) return o; //n和o为同一对象，返回o
    if(Array.isArray(o) && Array.isArray(n)) {
        for(let i=0;i<n.length;i++){
            o.push(n[i])
        }
    } else {
        let keys = Object.keys(n); //n的全部key集合
        for(let i =0,len=keys.length; i<len; i++) {
            let key = keys[i];
            if(!exclude_keys[key]) {
                let temp = n[key];
                //console.log("o."+key+"="+o[key]+", n."+key+"="+temp)
                o[key] = merge(o[key], temp, {});
            }
        }
    }
    //console.log("o:"+o)
    return o;
}

/**
 * connect to M3 platform and return sessionid
 */
 let connect = function (param) {
    return new Promise(function(resolve, reject) {
        http.post({
            url: `/user/signin?company=${encodeURIComponent(param.company)}&username=${encodeURIComponent(param.username)}&password=${encodeURIComponent(param.password)}`
        }).then(res=>{
            G.sessionid = res.data.message;
            resolve(res);
        }).catch(err=>{
            reject(err.data);
        })
    })
}

/**
 * auto connect to M3 platform and return sessionid  For development env
 */
let autoConnect = function () {
    return new Promise(function(resolve, reject) {
        if(process.env.NODE_ENV === "development") {
            let param = {company: process.env.VUE_APP_M3_COMPANY, username: process.env.VUE_APP_M3_USERNAME, password: process.env.VUE_APP_M3_PASSWORD }
            connect(param).then(()=>{
                resolve();
            }).catch(err=>{
                reject(err.data);
            })
        } else {
            resolve();
        }
    })
};



/** 
 * Call a serverJS interface for M3 platform
 */
let callFS = function (fileName, param) {
    return new Promise(function(resolve, reject) {
        let fm = new FormData();
        fm.append("input", param);
        fm.append("isfile",true);
        http.post({
            url: `/script/exec/js?filepath=${fileName}`,
            param: fm
        }).then(res=>{
            resolve(res.data);
        }).catch(err=>{
            reject(err.data);
        })
    })
};

/**
 * Call a m3service interface by nats for M3 platform
 */
let callService = function (service, action, params) {
    service = (process.env.NODE_ENV==='production'?"v1.":"dev.")+service
    let input = encodeURIComponent(JSON.stringify({ service: service, action: action, params: params }));
    return callFS("/matrix/nats/action.js", input);
};

/**
 * 当前用户权限 
 */
let authUser = function () {
    return new Promise((resolve, reject) => {
        callFS("/matrix/user/signedUser.js").then(res=>{
            let tmp = { signedUser: res.message, isAdmin: res.message.isadmin };
            G._.assign(G.m3.auth, tmp);
            G.auth = G.m3.auth;
            resolve();
        }).catch(e=>{
            reject(e);
        })
    })
};

/**
 * Get global register info for M3 platform
 */
let globalInfo = function () {
    return new Promise((resolve, reject) => {
        callFS("/matrix/utils/global.js").then(res=>{
            G._.assign(G.m3.global, res.message);
            G.global = G.m3.global;
            resolve()
        }).catch(e=>{
            reject(e);
        })
    })
};

let langInfo = function() {
    return new Promise((resolve, reject) => {
        try{
            let cache = localStorage.getItem("M3-LANG-LIST");
            if (cache) {
                G.m3.langList = JSON.parse(cache)
                resolve();
            } else {
                callFS("/matrix/lang/getLangList.js").then(res=>{
                    localStorage.setItem("M3-LANG-LIST", JSON.stringify(res.message));
                    G.m3.langList = res.message
                    resolve(res.message);
                }).catch(e=>{
                    reject(e);
                })
            }
        }catch(e){
            reject(e);
        }
    })
}
/**
 * 通过选项创建 VueI18n 实例
 */
let lang = function() {
    return new Promise((resolve, reject) => {
        resolve(G.m3.langList);
    })
};

/**
 * Set Home for login user
 */
let setAppAsHome = function(vm,item){
    return new Promise(function(resolve, reject) {
        let fm = new FormData();
        fm.append("home", item.url.split("").slice(1,item.url.length).join(""));
        fm.append("_csrf", G.getCookie("_csrf"))
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

/**
 * Set Home for all user
 */
let setAppAsHomeForAllUser = function(vm,item){
    return new Promise(function(resolve, reject) {
        let fm = new FormData();
        fm.append("home", item.url.split("").slice(1,item.url.length).join(""));
        fm.append("_csrf", G.getCookie("_csrf"))
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

/**
 * Set Title for M3 platform
 */
let setTitle = function(auth){
    new Promise((resolve,reject)=>{
        try {
            let pathName = window.location.pathname;
            if(G._.isEmpty(pathName)) {
                document.title = auth.Company.title;
                return false;
            }
            callFS("/matrix/system/getAppNameByUrl.js", encodeURIComponent(pathName)).then( res=>{
                let name = res.message;
                if(!G._.isEmpty(name)) {
                    document.title = name['cnname'] || name['enname'];
                } else {
                    document.title = auth.Company.title;
                }
                setTimeout(()=>{
                    let link = document.querySelector("link[rel~='icon']");
                    if (!link) {
                        link = document.createElement('link');
                        link.rel = 'icon';
                        document.getElementsByTagName('head')[0].appendChild(link);
                    }
                    link.href = auth.Company.icon || auth.Company.logo;
                    resolve();
                },0)
            });
        } catch(err) {
            console.error(err,auth)
            document.title = auth.Company.title;
            reject(err);
        }
    })
};

/**
 * 单位转换
 */
let bytesToSize = function(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
};

/**
 * 全屏控制
 */
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

/**
 * Vue Render
 */
 let renderVueMount = function() {
    return new Promise(function(resolve,reject){
        try {
            new G.Vue({
                render: h => h(G.App),
                mounted: function() {
                    resolve();
                    console.log("Vue mounted.")
                },
            }).$mount('#'+m3config.rootDivID)
        } catch(e) {
            reject(e)
        }
    })
}

var renderReady = false;
/**
 * Vue Render
 */
let renderPending = function() {
    return new Promise(function(resolve,reject){
        try {
            renderReady = true
            resolve()
        } catch(e) {
            reject(e)
        }
    })
}

let render = function() {
    return new Promise(function(resolve,reject){
        try {
            if(renderReady){
                resolve()
            }else{
                reject("页面渲染所需组建未加载")
            }
        } catch(e) {
            reject(e)
        }
    })
}

/**
 * Vue Render Completed
 */
let completed = function() {
    //document.getElementById("preload").style.display = "none";
}

/**
 * 组件加载并初始化相关数据，必须保证执行顺序，下一级组件或操作依赖上一级输出，同一层次的组件可以同时加载：
 * -> m3（this）
 *    -> js-cookie cookie信息存取
 *    -> http 访问REST API
 *       -> (依赖js-cookie) auth 当前登录用户信息
 *       -> global 全局设置信息
 *       -> lang 语言包所需数据
 *          -> i18n 语言包
 *    -> moment 时间库
 *    -> animate 动画效果
 *    -> icons 图标
 *    -> vue vue支持
 *       -> elementui 常用UI组件
 *          -> theme 可切换主题皮肤CSS
 *       -> vue-split 分割栏
 * -> (依赖auth, global) App.vue 应用组件 
 *    -> m3.render() 开始render页面 
 *       -> 其他应用组件由应用自行控制 
 *          ->m3.completed() render完成
 */

var mods = {Vue:{}, App:{}}
mods._ = {
    f: () => import("lodash"),
}
mods.lodash = {
    deps: [mods._],
}
mods.Cookies = {
    f: () => import("js-cookie"),
}
mods.getCookie = {
    f: () => import("../utils/cookie"),
}
mods.autoConnect = {
    f: autoConnect,
    deps: [mods.Cookies],
}
mods.auth = {
    f: authUser,
    deps: [mods.autoConnect, mods.lodash],
}
mods.global = {
    f: globalInfo,
    deps: [mods.autoConnect, mods.lodash],
}
mods.lang = {
    f: langInfo,
    deps: [mods.autoConnect, mods.lodash],
}
mods.render = {
    f: renderPending,
    deps: [mods.Vue, mods.App, mods.getCookie],
}
mods.completed = {
    f: completed,
    deps: [mods.render],
}
// mods.completed = {
//     f: () => {},
//     deps: [mods.Vue, mods.App, mods.getCookie],
// }

/**
 * 合并Mods
 */
let combin_mods = function(mods, nms) {
    for(var mk in mods) {
        var mm = mods[mk]
        if (mm) {
            mm.ID = mk
        }
    }
    for(var nk in nms) {
        var nm = nms[nk]
        if (nm) {
            nm.ID = nk
        }
    }
    for(var k in nms) {
        var m = nms[k]
        if (m) {
            if(!mods[k]) {
                mods[k] = m
            } else {
                for(var tk in m) {
                    mods[k][tk] = m[tk]
                }
                m = mods[k]
            }
            if(m.deps) {
                for(var di=0; di<m.deps.length; di++) {
                    if(!m.deps[di]){
                        console.error("mods."+k+".deps["+di+"]"+" is undefined")
                    }
                    m.deps[di] = mods[m.deps[di].ID] || nms[m.deps[di].ID]
                }
            }
        }
    }
    return mods
}

/**
 * 按 mods 的设定加载组件或执行初始化操作
 */
let loadCompos = function() {
    let mcfCallids = {}
    let mcfOk = function(id, mc, mfret, st, resolve, reject) {
        try {
            if(mfret){
                if(mc.keys) {
                    mc.ret = {}
                    for(var kk in mc.keys){
                        var mk = mc.keys[kk]
                        if(mk){ //指定部分模块映射变量
                            mc.ret[kk] = mfret[mk]
                        } else { //全模块映射变量
                            mc.ret[kk] = mfret;
                        }
                    }
                } else if(mfret.default) { //默认default模块映射变量
                    mc.ret = mfret.default;
                } else if(mfret[id]) { //默认ID同名模块映射变量
                    mc.ret = mfret[id];
                } else { //模块直接赋值变量
                    mc.ret = mfret;
                }
                G[id] = mc.ret
                G.m3[id] = mc.ret
            }
            mc.loaded = true;
            loading--;
            console.debug("[M3L]","loading="+loading,", id="+id,", ret=",mc.ret,", ut="+(Date.now()-st))
            delete mcfCallids[id];
            m3config.displayLoadingState && window.state && window.state("正在加载依赖组件 "+Object.keys(mcfCallids)+" ...")
            if(mc.next) {
                for(var nk in mc.next){
                    mcfCall(nk, mc.next[nk], resolve, reject);
                }
            }
            if(loading == 0) {
                resolve();
            }
        } catch(e) {
            reject(e)
            console.error(e)
        }
    }
    /**
     * 检查所有依赖条件，全部准备好后，执行操作
     */
    let mcfCall = function(id, mc, resolve, reject) {
        try{
            //console.debug("mcfCall", id, mc)
            var ready=true;
            if(mc.deps){
                for(var i=0;i<mc.deps.length;i++){
                    if(!(mc.deps[i] && mc.deps[i].loaded)){
                        ready=false;
                        return
                    }
                }
            }
            let st = Date.now();
            mcfCallids[id] = st;
            m3config.displayLoadingState && window.state && window.state("正在加载依赖组件 "+Object.keys(mcfCallids)+" ...")
            if(mc.f) {
                let mcfr = mc.f()
                if(mcfr && mcfr.then && mcfr.catch) {
                    mcfr.then((mfret)=>{
                        mcfOk(id, mc, mfret, st, resolve, reject)
                    }).catch((e)=>{
                        reject(e)
                        console.error(id, mc, e)
                    })
                } else {
                    mcfOk(id, mc, mcfr, st, resolve, reject)
                }
            } else {
                mcfOk(id, mc, null, st, resolve, reject)
            }
        } catch(e) {
            reject(e)
            console.error(e)
        }
    }
    return new Promise(function(resolve, reject){
        try{
            loading = Object.keys(mods).length
            for(var k in mods) {
                var mc = mods[k]
                if(mc){
                    if(mc.deps){
                        for(var i=0;i<mc.deps.length;i++){
                            if(mc.deps[i] && !mc.deps[i].loaded){
                                if(!mc.deps[i].next){
                                    mc.deps[i].next = {}
                                }
                                mc.deps[i].next[k] = mc
                            }
                        }
                    }
                    mcfCall(k, mc, resolve, reject)
                } else {
                    loading--
                }
            }
            if(loading == 0) {
                resolve();
            }
        }catch(e){
            reject(e)
            console.error(e)
        }
    })
}

let combin_config = function(mconfig, cfg) {
    G = cfg.global||mconfig.global||G;
    merge(mconfig, cfg, {global:1, mods:1})
    mconfig.mods = combin_mods(mconfig.mods, cfg.mods);
    return mconfig;
}

/*
 * 组件加载并初始化相关数据，必须保证执行顺序，下一级组件或操作依赖上一级输出，同一层次的组件可以同时加载：
 * -> m3（this）
 *    -> js-cookie cookie信息存取
 *    -> http 访问REST API
 *       -> (依赖js-cookie) auth 当前登录用户信息
 *       -> global 全局设置信息
 *       -> lang 语言包所需数据
 *          -> i18n 语言包
 *    -> moment 时间库
 *    -> animate 动画效果
 *    -> icons 图标
 *    -> vue vue支持
 *       -> elementui 常用UI组件
 *          -> theme 可切换主题皮肤CSS
 *       -> vue-split 分割栏
 *       -> (依赖auth, global) App.vue 应用组件 
 *          -> m3.render() 开始render页面 
 *              -> 其他应用组件由应用自行控制 
 */
let init = function(cfg) {
    m3config = combin_config(m3config, cfg);
    G.m3 = this;
    return new Promise((resolve, reject) => {
        try {
            combin_mods(mods, m3config.mods)
            loadCompos(mods).then(()=>{
                resolve();
            }).catch((e)=>{
                reject(e)
                console.error(e)
            });
        } catch(e) {
            reject(e)
            console.error(e)
        }
    })
}

let exports = {}

exports.VERSION = VERSION;
exports.merge = merge;
exports.combin_config = combin_config;
exports.init = init;
exports.connect = connect;
exports.callFS = callFS;
exports.callService = callService;
exports.lang = lang;
exports.auth = auth;
exports.global = global;
exports.render = render;
exports.setTitle = setTitle;
exports.setAppAsHome = setAppAsHome;
exports.setAppAsHomeForAllUser = setAppAsHomeForAllUser;
exports.fullScreen = fullScreen;
exports.fullScreenByEl = fullScreenByEl;
exports.bytesToSize = bytesToSize;

export default exports
