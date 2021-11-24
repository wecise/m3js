/*
 * 通用工具功能
 * 前端开发中常用的有一定的工具性质的功能函数，
 */

/**
 * 深度合并，包括数组追加合并，对象字段合并，无限深度
 * 两个对象的深度合并，合并结果保存在第一个对象中
 * 如果数据类型不同，第二个对象中对应的数据将覆盖第一个对象
 * 同一对象直接返回
 * lodash、jquery、ES6 Object的extend，assign，merge等函数都没有实现这样的合并功能
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

/* 动态加载CSS, 相同cssid覆盖加载 */
function loadCSS(cssid, cssurl){
    var cssTag = document.getElementById(cssid);
    var head = document.getElementsByTagName('head').item(0);
    if(cssTag) head.removeChild(cssTag);
    var css = document.createElement('link');
    css.href = cssurl;
    css.rel = 'stylesheet';
    css.type = 'text/css';
    css.id = cssid;
    head.appendChild(css);
}

/* 动态加载script, 相同jsid覆盖加载 */
function loadJS(jsid, jsurl){
    var scriptTag = document.getElementById(jsid);
    var head = document.getElementsByTagName('head').item(0);
    if(scriptTag) head.removeChild(scriptTag);
    var script = document.createElement('script');
    script.src = jsurl;
    script.id = jsid;
    head.appendChild(script);
}

/*
 * 字节数单位转换
 */
 let bytesSize = function(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
};


/*
    获取颜色色差
 */
 let adjustColor = function(color, amount) {
    return '#' + color.replace(/^#/, '').replace(/../g, color => ('0'+Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
};

/*
    字符串复制到剪贴板
*/
let  copyToClipboard = function(str){     
    const el = document.createElement('textarea');     
    el.value = str;     
    el.setAttribute('readonly', '');     
    el.style.position = 'absolute';     
    el.style.left = '-9999px';     
    document.body.appendChild(el);     
    const selected = document.getSelection().rangeCount > 0 ? document.getSelection().getRangeAt(0) : false;     
    el.select();     
    document.execCommand('copy');     
    document.body.removeChild(el);     
    if (selected) {         
        document.getSelection().removeAllRanges();         
        document.getSelection().addRange(selected);     
    } 
};

/*  
    转换毫秒数的可读格式
*/
let formatDuration = function(ms){     
    if (ms < 0) ms = -ms; 
    const time = {         
        day: Math.floor(ms / 86400000),         
        hour: Math.floor(ms / 3600000) % 24,         
        minute: Math.floor(ms / 60000) % 60,         
        second: Math.floor(ms / 1000) % 60,         
        millisecond: Math.floor(ms) % 1000      
    };     
    return Object.entries(time).filter(val => val[1] !== 0).map(([key, val]) => `${val} ${key}${val !== 1 ? "s" : ""}`).join(","); 
};

/*  
    分辨设备是移动设备还是桌面设备
*/
let detectDeviceType = function(){
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? "Mobile" : "Desktop";
};

module.exports = { merge, loadCSS, loadJS, bytesSize, adjustColor, copyToClipboard, formatDuration, detectDeviceType }
