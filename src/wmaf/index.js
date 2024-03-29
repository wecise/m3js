/**
 * Wecise M³Applet Framework
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

import m3 from "../base"

import moment from 'moment';
import 'moment/dist/locale/zh-cn.js';
import 'moment/dist/locale/en-gb.js';

import Vue from 'vue';

window.M3_LANG = window.M3_LANG || 'zh-CN';

Vue.prototype.m3 = m3;
window.m3 = m3;
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
mods.element = {
    f: () => import('element-ui'),
}
mods.theme = {
    f: () => {
        return import("../theme"); // 动态加载样式主题功能，并不包括相关样式的加载
    },
}
mods.html = {
    f: () => {
        return import("../html"); // 动态加载样式主题功能，并不包括相关样式的加载
    },
}

let m3config = {
    global: window,
    rootDivID: "app",
    renderTimeout: 1000, //动态加载完成之后，等待页面输出完成的时间
    lang: window.M3_LANG, 
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
            m3.utils.merge(Vue.prototype.$ELEMENT, {
                i18n: (key, value) => window.i18n.t(key, value)
            });
            resolve()
        }).catch((e) => {
            reject(e);
        })
    })
}

let pageSetting = function() {
    // 此时所有 mods 指定组件都已经加载完成
    return new Promise((resolve, reject)=>{
        m3.theme.initTheme(m3config.theme).then(()=>{
            // window.state && window.state("主题样式加载完成...")
            // 样式直接生效，无需后续处理
        }).catch((e) => {
            reject(e);
        })
        lang(window.M3_LANG).then(()=>{
            window.state && window.state("语言包加载完成...")
            resolve();
        }).catch((e) => {
            reject(e);
        })
        m3.html.setTitle(m3.auth);
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
            }).$mount('#'+m3config.rootDivID)
        } catch(e) {
            reject(e);
        }
    })
}

let completedTimeLimit = 0
let renderCompleted = function(resolve, reject) {
    try {
        if(window.loaded){
            resolve();
        }else{
            if(Date.now()>completedTimeLimit){
                throw `页面渲染超时，确认需要更长的渲染时间，可以通过如下方式调整渲染超时设置
    m3.init({
        renderTimeout:${m3config.renderTimeout}, //毫秒
    }) `;
            }
            let preload_div = document.getElementById("preload")
            if(preload_div && preload_div.nextElementSibling){
                let vueRoot=preload_div.nextElementSibling.__vue__;
                if(vueRoot){
                    preload_div.style.display = "none";
                    window.loaded = true;
                    window.state && window.state("页面输出完成.");
                    resolve();
                }else{
                    setTimeout(()=>renderCompleted(resolve, reject),0);
                }
            }else{
                throw `M³小应用规范：请从m3js加载vue cli配置信息，主程序异步调用m3.init，例如：
    vue.config.js:
        const m3config = require("@wecise/m3js/mbase/vue.config")
        module.exports = m3config({
            configureWebpack: {
                entry: {
                    app: "./src/main.js"
                }
            }
        })
    src/main.js:
        const m3 = require("@wecise/m3js");
        m3.init().then(()=>{
            m3.render().then(()=>{

            });
        });
`;
            }
        }
    } catch(e) {
        // 停止背景动画，显示错误信息
        window.errorState && window.errorState("<pre>"+e+"</pre>");
        reject(e)
    }
}

let completed = function() {
    return new Promise((resolve, reject)=>{
        if(!window.loaded){
            if(completedTimeLimit == 0){
                console.debug("开始渲染超时计时")
                completedTimeLimit = Date.now()+m3config.renderTimeout;
                renderCompleted(resolve, reject);
            } else {
                //未超时之前，延长渲染超时时间
                completedTimeLimit = Date.now()+m3config.renderTimeout;
            }
        }
    })
}

let init = function(cfg) {
    m3config = m3.mergeConfig(m3config, cfg)
    return new Promise((resolve, reject)=>{
        window.loaded=false;
        m3.compose(m3config).then((a)=>{
            resolve(a);
            setTimeout(completed,m3config.renderTimeout/4); //确保处理完成动作被调用，固定时间的延迟处理，效率上一般不如渲染完成后主动调用
        }).catch(e=>{
            reject(e);
            completed(); //确保处理完成动作被调用
        })
    })
}

m3.init = init
m3.pageSetting = pageSetting
m3.render = render
m3.completed = completed

let go = function(m3config) {
    window.state && window.state("正在初始化小应用配置...")
    // m3js加载完成，根据配置信息动态有序异步加载依赖组件，完成M3小应用初始化
    m3.init(m3config).then(()=>{
        window.state && window.state("正在配置页面...")
        m3.pageSetting().then(()=>{
            window.state && window.state("正在渲染页面...")
            // m3.render完成的工作是渲染Vue页面，也可以写成
            // new Vue({
            //     render: h => h(window.App),
            //     mounted: function(){
            //         window.state && window.state("页面渲染完成...")
            //         m3.completed() // 加载数据
            //     },
            // }).$mount('#app')
            m3.render().then(()=>{
                window.state && window.state("正在加载数据...")
                // 此时Vue渲染已经完成，但是页面还不能正常显示，还需要加载页面相关数据，并驱动Vue相关组件更新显示状态
                m3.completed().then(()=>{
                    // 此时页面才能正常显示
                    // window.state && window.state("页面输出完成.");
                }).catch((e)=>{
                    console.error(e)
                })
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

m3.go = go

export default m3
