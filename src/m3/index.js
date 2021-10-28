
import m3 from "../base"

/* html */
m3.html = require("../html");

/* theme */
m3.theme = require("../theme");

/* omdb */
m3.omdb = require('../omdb');

/* job */
m3.job = require('../job');

/* user */
m3.user = require('../user');

/* dfs */
m3.dfs = require('../dfs');

/* app */
m3.app = require('../app');

/* rule */
m3.rule = require('../rule');

/* policy */
m3.policy = require('../policy');

/* console log */
m3.consolelog = require('../consolelog');

/* trigger */
m3.trigger = require('../trigger');

m3.event = require("../event");

/* utils */
m3.jsFormat = require("../utils/jsFormat.js");
m3.htmlFormat = require("../utils/htmlFormat.js");

m3.adjustColor = function(color, amount) {
    return '#' + color.replace(/^#/, '').replace(/../g, color => ('0'+Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
};

m3.cookie = require("../cookie");

m3.framework = require("../framework")

export default m3
