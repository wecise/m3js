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

/**
 * 字节数单位转换
 */
 let bytesSize = function(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
};

module.exports = { merge, bytesSize }
