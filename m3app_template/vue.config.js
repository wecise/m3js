// 从m3js模版加载vue cli配置信息
m3config = require("@wecise/m3js/vue.config")
// 调整覆盖vue cli配置信息
m3config.devServer.port = 8080
// 输出vue cli配置信息
module.exports = m3config
