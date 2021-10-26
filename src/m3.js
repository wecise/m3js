/**
 * Wecise Applet Framework
 * 
 * 规范：
 * Requirement: ES6
 * 
 * 输出接口形式：
 *   常量(const)，全大写，常量可以是对象
 *   类(class)，大写开头，CamelCase
 *   变量(var)，小写开头，camelCase
 *   普通函数(function)，小写开头，camelCase
 * 不输出变量接口
 * 
 * Copyright (c) 2020, Wecise
 * All rights reserved.
 */

import m3 from "./base"

import _ from 'lodash';

import moment from 'moment';
import 'moment/dist/locale/zh-cn.js';
import 'moment/dist/locale/en-gb.js';

import animate from 'animate.css'
import Cookies from 'js-cookie';

import Vue from 'vue';

import "./element"

window.M3_LANG = 'zh-CN';

Vue.prototype.m3 = m3;
window.m3 = m3;
Vue.use(animate);
window.moment = moment;
Vue.prototype.moment = moment;
Vue.prototype.moment.locale(window.M3_LANG);
Vue.prototype.eventHub = new Vue();
Vue.config.productionTip = false;

import VueSplit from 'vue-split-panel'
Vue.use(VueSplit);

let mods = {auth:{}, global:{}, lang:{}, Vue:{}}
mods.Vue = {
    f: () => Vue,
}
mods.VueI18n = {
    f: () => import('vue-i18n'),
}
mods.Theme = {
    f: () => {
        return import("./theme"); // 动态加载样式主题功能，并不包括相关样式的加载
    },
}

let m3config = {
    global: window,
    rootDivID: "app",
    lang: "zh-CN", 
    theme: "", // 默认使用cookie中保存的信息或使用内置缺省值
    mods,
}

let lang = function(name) {
    return new Promise((resolve, reject)=>{
        m3.langList().then((res)=>{
            let VueI18n = window.VueI18n
            let Vue = window.Vue
            Vue.use(VueI18n);
            window.i18n = new VueI18n({
                locale: name,
                messages: res, 
            });
            //Vue.prototype.i18n = window.i18n;
            _.merge(Vue.prototype.$ELEMENT, {
                size: Cookies.get('size') || 'small',
                i18n: (key, value) => window.i18n.t(key, value)
            });
            resolve()
        }).catch((e) => {
            reject(e);
            console.error(e);
        })
    })
}

let pageSetting = function() {
    // 此时所有 mods 指定组件都已经加载完成
    return new Promise((resolve, reject)=>{
        m3.Theme.initTheme(m3config.theme).then(()=>{
            // window.state && window.state("主题样式加载完成...")
            // 样式直接生效，无需后续处理
        }).catch((e) => {
            reject(e);
            console.error(e);
        })
        lang(window.M3_LANG).then(()=>{
            window.state && window.state("语言包加载完成...")
            resolve();
        }).catch((e) => {
            reject(e);
            console.error(e);
        })
    })
}

let render = function() {
    return new Promise((resolve, reject)=>{
        try {
            new Vue({
                render: h => h(window.App),
                mounted: function(){
                    window.state && window.state("页面渲染完成...")
                    resolve();
                },
                i18n: window.i18n,
            }).$mount('#app')
        } catch(e) {
            reject(e);
            console.error(e);
        }
    })
}

let renderCompleted = function(resolve, reject) {
    try {
        if(document.getElementsByClassName("m3").length>0){
            document.getElementById("preload").style.display = "none";
            window.loaded = true;
            resolve();
        }else{
            setTimeout(()=>renderCompleted(resolve, reject),0);
        }
    } catch(e) {
        reject(e)
    }
}

let completed = function() {
    return new Promise((resolve, reject)=>{
        renderCompleted(resolve, reject);
    })
}

let init = function(cfg) {
    m3config = m3.combin_config(m3config, cfg)
    return new Promise((resolve, reject)=>{
        m3.compose(m3config).then((a)=>{
            pageSetting().then(()=>{
                resolve(a);
            })
        }).catch(e=>{
            reject(e);
            console.error(e);
        })
    })
}

let go = function(m3config) {
    window.state && window.state("正在初始化小应用配置...")
    // m3js加载完成，根据配置信息动态有序异步加载依赖组件，完成M3小应用初始化
    init(m3config).then(()=>{
        window.state && window.state("正在渲染页面...")
        // m3.render完成的工作是渲染Vue页面，也可以写成
        // new Vue({
        //     render: h => h(window.App),
        //     mounted: function(){
        //         window.state && window.state("页面渲染完成...")
        //         m3.completed() // 加载数据
        //     },
        // }).$mount('#app')
        render().then(()=>{
            window.state && window.state("正在加载数据...")
            // 此时Vue渲染已经完成，但是页面还不能正常显示，还需要加载页面相关数据，并驱动Vue相关组件更新显示状态
            completed().then(()=>{
                // 此时页面才能正常显示
                window.state && window.state("页面输出完成.");
            }).catch((e)=>{
                console.error(e)
            })
        }).catch((e)=>{
            console.error(e)
        })
    }).catch((e)=>{
        console.error(e)
    })
}

let exports = m3
exports.init = init
exports.render = render
exports.completed = completed
exports.go = go

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
exports.dfsUnZip = dfs.dfsUnZip;
exports.dfsZip = dfs.dfsZip;

/* app */
const app = require('./app/index.js');
exports.appDeploy = app.appDeploy;

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
exports.jsFormat = require("./utils/jsFormat.js");
exports.htmlFormat = require("./utils/htmlFormat.js");

const adjustColor = function(color, amount) {
    return '#' + color.replace(/^#/, '').replace(/../g, color => ('0'+Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
};
exports.adjustColor = adjustColor;

const cookie = require("./utils/cookie.js");
exports.getCookie = cookie.getCookie;

export default exports
