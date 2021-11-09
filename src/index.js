/**
 * M³小应用开发过程中与M³平台的交互功能
 */

import m3 from "./wmaf"

/** 版本信息 */
export let VERSION = m3.VERSION;

/** framework */
/** 一步启动M3小应用框架 */
export let go = m3.go

/** 初始化，动态加载依赖包 */
export let init = m3.init
/** 设置页面基本样式、语言、标题 */
export let pageSetting = m3.pageSetting
/** 开启VUE渲染 */
export let render = m3.render
/** 
 *  VUE渲染完成，等待数据加载，页面输出
 *  VUE渲染完成后，数据未加载完成前，页面仍然处于“白屏”状态，仍需等待一定时间，页面才能出现
 */
export let completed = m3.completed

/** 通用功能函数 */
export let http = m3.http;
export let utils = m3.utils;
/** 平台交互基本功能 */
export let callFS = m3.callFS;
export let callService = m3.callService;

/* html */
export let html = m3.html = require("./html");

/* theme */
export let theme = m3.theme = require("./theme");

/* omdb */
export let omdb = m3.omdb = require('./omdb');

/* job */
export let job = m3.job = require('./job');

/* user */
export let user = m3.user = require('./user');

/* dfs */
export let dfs = m3.dfs = require('./dfs');

/* app */
export let app = m3.app = require('./app');

/* rule */
export let rule = m3.rule = require('./rule');

/* policy */
export let policy = m3.policy = require('./policy');

/* console log */
export let consolelog = m3.consolelog = require('./consolelog');

/* trigger */
export let trigger = m3.trigger = require('./trigger');

/* event */
export let event = m3.event = require("./event");

/* cookie */
export let cookie = m3.cookie = require("./cookie");
