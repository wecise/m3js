
import m3 from "./m3.js"

/* html */
m3.html = require("./html/index.js");

/* theme */
m3.theme = require("./theme/index.js");

/* omdb */
m3.omdb = require('./omdb/index.js');

/* job */
m3.job = require('./job/index.js');

/* user */
m3.user = require('./user/index.js');

/* dfs */
m3.dfs = require('./dfs/index.js');

/* app */
m3.app = require('./app/index.js');

/* rule */
m3.rule = require('./rule/index.js');

/* policy */
m3.policy = require('./policy/index.js');

/* console log */
m3.consolelog = require('./consolelog/index.js');

/* trigger */
m3.trigger = require('./trigger/index.js');

m3.event = require("./event/index.js");

/* utils */
m3.jsFormat = require("./utils/jsFormat.js");
m3.htmlFormat = require("./utils/htmlFormat.js");

m3.adjustColor = function(color, amount) {
    return '#' + color.replace(/^#/, '').replace(/../g, color => ('0'+Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
};

m3.cookie = require("./utils/cookie.js");

export default m3
