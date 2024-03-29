/**
 * Wecise Applet Framework
 * 
 * Requirement: ES6
 * 
 * Copyright (c) 2020, Wecise
 * All rights reserved.
 */

const VERSION = "1.0.0";

import Cookies from "js-cookie";
import http from "../axios/http"
import mu from "../utils/mu"

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
            var msg = err && (err.data && err.data.message || err.data) || err
            // 停止背景动画，显示错误信息
            window.errorState && window.errorState(`${msg}，<br/><br/>
                服务器连接失败，请检查确认如下信息：
                <ul><li>开发环境(.env)配置是否正确
                </li><li>用户、密码是否正确
                </li><li>服务器连接地址正确
                </li><li>服务器工作正常
                </li><li>修改环境配置后服务是否已经重启
                </li><ul>`)
            reject(err && err.data);
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
                reject(err.message);
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
            reject(err && err.data || err);
        })
    })
};

/**
 * Call a m3service interface by nats for M3 platform
 */
let callService = function (service, action, params) {
    params = arguments[arguments.length-1]
    let method = arguments.length>3 && arguments[2] || params.method || ""
    return new Promise(function(resolve, reject) {
        service = (process.env.VUE_APP_M3_SERVICE_VERSION||(process.env.NODE_ENV==='production'?"v1":"dev"))+"."+service
        let context = Cookies.get("m3context")
        let input = encodeURIComponent(JSON.stringify({service: service, action: action, method: method, context: context, params: params }));
        callFS("/matrix/nats/action.js", input).then((data)=>{
            // data={status: "ok", message: {Continuing: "", Error: null, Result: {}, context: "m3.context.id"}}
            if(data && data.message) {
                if(data.message.context) {
                    Cookies.set("m3context", data.message.context)
                }
                resolve(data.message)
            }else{
                console.debug(service+" response error", data)
                reject("response message format error")
            }
        }).catch(err=>{
            reject(err);
        })
    })
};

/**
 * 当前用户权限 
 */
let authUser = function () {
    return new Promise((resolve, reject) => {
        callFS("/matrix/user/signedUser.js").then(res=>{
            let tmp = { signedUser: res.message, isAdmin: res.message.isadmin };
            tmp.Company = tmp.signedUser.Company;
            G._.assign(G.m3.auth, tmp);
            G.auth = G.m3.auth;
            resolve();
        }).catch(e=>{
            reject(e);
            window.state && window.state(`<b style="color:red">用户密码验证错误</b>`)
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
                G.m3.langListInfo = JSON.parse(cache)
                resolve();
            } else {
                callFS("/matrix/lang/getLangList.js").then(res=>{
                    localStorage.setItem("M3-LANG-LIST", JSON.stringify(res.message));
                    G.m3.langListInfo = res.message
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
let langList = function() {
    return new Promise((resolve, reject) => {
        resolve(G.m3.langListInfo);
    })
};

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
 *    -> vue vue支持
 *       -> elementui 常用UI组件
 *          -> theme 可切换主题皮肤CSS
 *       -> vue-split 分割栏
 * -> (依赖auth, global) App.vue 应用组件 
 *    -> m3.ready() 动态组件加载完成，可以开始页面渲染前的其它准备工作
 *       -> 其他应用组件由应用自行控制 
 *          ->m3.loaded() 全部加载完成
 */

var mods = {Vue:{}, App:{}, element:{}}
mods._ = {
    f: () => import("lodash"),
}
mods.lodash = {
    deps: [mods._],
}
mods.cookie = {
    f: () => import("../cookie"),
}
mods.autoConnect = {
    f: autoConnect,
    deps: [mods.cookie],
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
mods.ready = {
    desc: "依赖组件加载完成",
    f: () => {},
    deps: [mods.Vue, mods.App, mods.element, mods.cookie],
}
mods.loaded = {
    desc: "动态组件加载完成",
    f: () => {},
    deps: [mods.ready],
}

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
            //console.error(e)
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
            //console.error(e)
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
        }
    })
}

let mergeConfig = function(mconfig, cfg) {
    G = cfg&&cfg.global||mconfig.global||G;
    mu.merge(mconfig, cfg)
    mconfig.mods = combin_mods(mconfig.mods, cfg&&cfg.mods||{});
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
 *    -> vue vue支持
 *       -> elementui 常用UI组件
 *          -> theme 可切换主题皮肤CSS
 *       -> vue-split 分割栏
 *       -> (依赖auth, global) App.vue 应用组件 
 *          -> m3.render() 开始render页面 
 *              -> 其他应用组件由应用自行控制 
 */
let compose = function(cfg) {
    m3config = mergeConfig(m3config, cfg);
    G.m3 = this;
    return new Promise((resolve, reject) => {
        try {
            combin_mods(mods, m3config.mods)
            loadCompos(mods).then(()=>{
                resolve();
            }).catch((e)=>{
                reject(e)
            });
        } catch(e) {
            reject(e)
        }
    })
}

let exports = {}
/** 版本信息 */
exports.VERSION = VERSION;
/** 通用功能模块 */
exports.http = http;
/** 配置合并 */
exports.mergeConfig = mergeConfig;
/** 有序异步动态加载 */
exports.compose = compose;
/** M³平台交互基本功能 */
exports.callFS = callFS;
exports.callService = callService;
/** 连接M³平台 */
exports.connect = connect;
/** M³平台支持的语言列表 */
exports.langList = langList;
/** M³平台认证信息 */
exports.auth = auth;
/** M³平台全局配置信息 */
exports.global = global;

export default exports
