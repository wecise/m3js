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
**/
let merge = function (o, n) {
    if(n===undefined) return o; //n 未定义，返回 o
    if(o===undefined) return n; //o 未定义，n有值，返回 n
    if(n==null || typeof n !== 'object') return n; //n 为空或不是对象，返回n
    if(o==null || typeof o !== 'object') return n; //o 为空或不是对象，n 是对象，返回n
    if(n === o) return o; // n和o为同一对象，返回o
    if(Array.isArray(o) && Array.isArray(n)) { // 数组合并
        for(let i=0;i<n.length;i++){
            o.push(n[i])
        }
    } else {
        let keys = Object.keys(n); // n的全部key集合
        for(let i =0,len=keys.length; i<len; i++) {
            let key = keys[i];
            o[key] = merge(o[key], n[key]);
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
            var msg = err && (err.data && err.data.message || err.data) || err
            window.state && window.state(`<b style="color:red">${msg}，请确认环境(.env)配置是否正确，修改环境配置需要重启服务</b>`)
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

let mergeConfig = function(mconfig, cfg) {
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
                console.error(e)
            });
        } catch(e) {
            reject(e)
            console.error(e)
        }
    })
}

let exports = {}
/** 版本信息 */
exports.VERSION = VERSION;
/** 通用功能函数 */
exports.http = http;
/** 通用功能函数 */
exports.merge = merge;
/** 配置合并 */
exports.mergeConfig = mergeConfig;
/** 有序异步动态加载 */
exports.compose = compose;
/** 平台交互基本功能 */
exports.callFS = callFS;
exports.callService = callService;
/** 连接平台 */
exports.connect = connect;
exports.langList = langList;
exports.auth = auth;
exports.global = global;

export default exports
