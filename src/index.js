
import m3 from "./wmaf"

/** 版本信息 */
export let VERSION = m3.VERSION;

/** framework */
export let go = m3.go
export let init = m3.init
export let render = m3.render
export let completed = m3.completed

/** 通用功能函数 */
export let http = m3.http;
export let merge = m3.merge;
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

export let event = m3.event = require("./event");

/* utils */
export let utils = m3.utils = {
    jsFormat: require("./utils/jsFormat.js"),
    htmlFormat: require("./utils/htmlFormat.js"),
    adjustColor: function(color, amount) {
        return '#' + color.replace(/^#/, '').replace(/../g, color => ('0'+Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
    },
    // 单位转换
    bytesToSize: function(bytes) {
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes == 0) return '0 Byte';
        var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    }
};

export let cookie = m3.cookie = require("./cookie");
