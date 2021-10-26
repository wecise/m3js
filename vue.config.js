const IS_M3JS=process.env.VUE_APP_M3_COMPANY==="wecise"&&process.env.VUE_APP_M3_APP === "m3js"
const M3JS=IS_M3JS?"./mbase":"@wecise/m3js/mbase"
// 从m3js模版加载vue cli配置信息
const m3config = require(`${M3JS}/vue.config`)
// 输出vue cli配置信息
module.exports = m3config({
    // 开发阶段本地web服务
    devServer: {
        port: 8080, // 开发阶段本地服务端口，当前端口被占用时按自动+1处理
    },
    configureWebpack: {
        entry: {
            app: "./src/main.js"
        }
    }
})
