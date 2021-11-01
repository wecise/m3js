
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
export let html = require("./html");

/* theme */
export let theme = require("./theme");

/* omdb */
export let omdb = require('./omdb');

/* job */
export let job = require('./job');

/* user */
export let user = require('./user');

/* dfs */
export let dfs = require('./dfs');

/* app */
export let app = require('./app');

/* rule */
export let rule = require('./rule');

/* policy */
export let policy = require('./policy');

/* console log */
export let consolelog = require('./consolelog');

/* trigger */
export let trigger = require('./trigger');

export let event = require("./event");

/* utils */
export let utils = {
    jsFormat: require("./utils/jsFormat.js"),
    htmlFormat: require("./utils/htmlFormat.js"),
    adjustColor: function(color, amount) {
        return '#' + color.replace(/^#/, '').replace(/../g, color => ('0'+Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
    }
};

export let cookie = require("./cookie");
