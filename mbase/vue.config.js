const WebpackZipPlugin = require('webpack-zip-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const path = require('path')
const utils = require('../src/utils')
const IS_PROD = process.env.NODE_ENV === 'production'
const IS_M3JS = process.env.VUE_APP_M3_APP === "m3js"
const IS_DEBUG = process.env.VUE_APP_M3_DEBUG && process.env.VUE_APP_M3_DEBUG.indexOf("vue.config")>=0
const productionGzipExtensions = ['html', 'js', 'css']

let vue_config = {
    // 开发阶段本地web服务
    devServer: {
        port: 8080, // 开发阶段本地服务端口，当前端口被占用时按自动+1处理
        contentBase: [
            //path.join(process.cwd(), "public"), //默认工作目录下的public目录
            path.join(__dirname, "public"), //追加本文件所在目录下的public目录
        ],
        proxy: {
            "/static": {
                target: `http://${process.env.VUE_APP_M3_HOST}`,
            },
            "/user": {
                target: `http://${process.env.VUE_APP_M3_HOST}`,
            },
            "/matrix": {
                target: `http://${process.env.VUE_APP_M3_HOST}`,
            },
            "/script": {
                target: `http://${process.env.VUE_APP_M3_HOST}`,
            },
            "/web": {
                target: `http://${process.env.VUE_APP_M3_HOST}`,
            },
            "/config": {
                target: `http://${process.env.VUE_APP_M3_HOST}`,
            },
            "/fs": {
                target: `http://${process.env.VUE_APP_M3_HOST}`,
            },
            "/help":{
                target: `http://${process.env.VUE_APP_M3_HOST}/help`
            },
        }
    },
    // 编译结果输出目录
    outputDir: 'app/matrix/' + process.env.VUE_APP_M3_APP,
    // 生产环境无需映射源代码资的源地图
    productionSourceMap: false,
    // 配置Webpack
    configureWebpack: oconfig => {
        // 将默认的配置信息打印输出到 console
        // if(IS_DEBUG)console.log("default config: "+JSON.stringify(oconfig, " ", 2));
        // 采用直接修改默认配置的方式定义configureWebpack
        config = oconfig; 
        if(!config.plugins) {
            config.plugins = [];
        }
        if (IS_PROD) { // 生产环境
            // 混淆代码，去除注释
            config.plugins.push(new UglifyJsPlugin({
                uglifyOptions: {
                    mangle: true,
                    output: {
                        comments: false,
                    },
                },
            }));
            // 压缩处理
            config.plugins.push(new CompressionPlugin({
                test: new RegExp(
                    '\\.(' + productionGzipExtensions.join('|') + ')$'
                ),
                threshold:10240,
                minRatio: 1,
                deleteOriginalAssets:false
            }));
            // 编译后打包发布
            config.plugins.push(new WebpackZipPlugin({
                initialFile: 'app',
                endPath: './',
                zipName: process.env.VUE_APP_M3_APP+'.zip',
                //frontShell: 'sed -i \'\' \'s/src="/src="\\/static\\/app\\/matrix\\/m3event/g\; s/href="/href="\\/static\\/app\\/matrix\\/m3event/g\' ./app/matrix/m3event/index.html',
                behindShell: path.join(__dirname,'deploy.sh') + ' ' + process.env.VUE_APP_M3_HOST + ' ' + process.env.VUE_APP_M3_COMPANY + ' ' + process.env.VUE_APP_M3_USERNAME + ' "' + process.env.VUE_APP_M3_PASSWORD + '" ' + process.env.VUE_APP_M3_APP + ' ' + process.env.VUE_APP_M3_TITLE + ' ' + process.env.VUE_APP_M3_VERSION
            }));
        } else { // 非生产环境
            // 格式化输出，影响热更效率
            // config.plugins.push(new UglifyJsPlugin({
            //     uglifyOptions: {
            //         mangle: false,
            //         output: {
            //             beautify: true,
            //             comments: true,
            //         },
            //     },
            // }));
        }
        //防止将某些 import 的包(package)打包到 bundle 中，而是在运行时(runtime)再去从外部获取这些扩展依赖
        if(!config.externals) {
            config.externals = {}
        }
        //"要导入的包": "window对象中的对应变量"
        config.externals["lodash"] = "_";
        config.externals["moment"] = "moment";
        config.externals["../moment"] = "moment"; // 单独加载 moment 内部语言包时使用
        config.externals["vue"] = "Vue";
        config.externals["element-ui"] = "ELEMENT";
        // HTML模版，需要配合 config.externals 引入相应js
        if(!process.env.VUE_APP_M3_ASSETS) {
            process.env.VUE_APP_M3_ASSETS = IS_PROD?"/static/app/assets":"assets"
        }
        let publicAssetsURLBase = "/static/assets"
        config.plugins.push(new HtmlWebpackPlugin({
            filename: "index.html",
            templateContent: `<!DOCTYPE html>
<html>
    <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <script src="${process.env.VUE_APP_M3_ASSETS}/js/lodash.js"></script>
    <script src="${process.env.VUE_APP_M3_ASSETS}/js/moment.js"></script>
    <script src="${process.env.VUE_APP_M3_ASSETS}/js/vue.js"></script>
    <script src="${process.env.VUE_APP_M3_ASSETS}/js/vue-router.js"></script>
    <script src="${process.env.VUE_APP_M3_ASSETS}/js/element-ui.js"></script>
    <link rel="stylesheet" type="text/css" href="${process.env.VUE_APP_M3_ASSETS}/css/loading.css" />
    <link rel="stylesheet" type="text/css" href="${process.env.VUE_APP_M3_ASSETS}/css/lds-ripple.css" />
    <title>${process.env.VUE_APP_M3_TITLE}</title>
    <script>
        window.assetsURLBase="${publicAssetsURLBase}";
        window.timeStart=window.timePhase=Date.now();
        window.errorCount=0;
        Date.prototype.format=function(f){var o={"M+":this.getMonth()+1,"d+":this.getDate(),"h+":this.getHours(),"m+":this.getMinutes(),"s+":this.getSeconds(),"S":this.getMilliseconds()};if(/(y+)/.test(f))f=f.replace(RegExp.$1,(this.getFullYear()+"").substr(4-RegExp.$1.length));for(var k in o)if(new RegExp("("+k+")").test(f))f=f.replace(RegExp.$1,RegExp.$1.length==1?o[k]:("00"+ o[k]).substr((""+ o[k]).length));return f}
        console.oerror=console.error;console.error=function(){window.errorCount++;var e=document.getElementById("error_count");if(e){e.innerHTML=" "+window.errorCount;e.style.display="";}console.oerror.call(this,...arguments);}
        console.odebug=console.debug;console.debug=function(){var t=Date.now();console.odebug.call(this,new Date().format("yyyy-MM-dd hh:mm:ss.S"),"("+(t-window.timePhase)+"/"+(t-window.timeStart)+")",...arguments)}
        window.state=(s)=>{if(s){console.debug("[M3S]",s);var e=document.getElementById("preload_message");if(e)e.innerHTML=s}window.timePhase=Date.now()}
        window.state("正在加载页面...")
    </script>
    <link rel="icon" href="favicon.ico"/>
    <title></title>
    </head>
    <body>
    <noscript>
        <strong>Please enable JavaScript to continue.</strong>
    </noscript>
    <div id="error_count" style="position:fixed;right:5px;bottom:5px;color:red;display:none;" class="el-icon-warning">0</div>
    <div id="preload" class="preload" style="position:fixed;display:block;width:100vw;height:100vh;overflow:hidden;font-size:10px;">
        <div id="bgloading" class="lds-ripple" style="position:absolute;"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
        <div style="position:absolute;width:100%;height:100%;display:flex;flex-flow:column nowrap;align-items:center;justify-content:center;">
            <label id="preload_message" style="flex:0 0 auto;">正在加载页面...</label>
        </div>
    </div>
    <div id="app"></div>
    <!-- built files will be auto injected -->
    </body>
</html>`
        }));
        // 设置目录别名
        if(!config.resolve) {
            config.resolve = {}
        }
        if(!config.resolve.alias) {
            config.resolve.alias = {}
        }
        config.resolve.alias["~"] = oconfig.context; // 工程所在目录
        config.resolve.alias["@"] = oconfig.context+(IS_M3JS?"/mtemplate/src":"/src"); // 工程src目录默认应该已经定义为oconfig.context+'src'
        // 使用 @wecise/m3js 内置入口
        config.entry = {
            app: IS_M3JS?"./src/main.js":"@wecise/m3js/src/main.js"
        }
        // 运行模式（运行环境标记）
        // 开发阶段在 .env 文件中指定，通过 npm run serve 执行，一般指定 NODE_ENV="development"
        // 生产发布时 process.env.NODE_ENV === 'production'，通过 npm run build 编译部署到 M3 主服务器，同时自动发布到小应用市场
        // config.mode = process.env.NODE_ENV
        // 将定制的配置信息打印输出到 console
        //if(IS_DEBUG)console.log("custom config: "+JSON.stringify(config, " ", 2));
    },
    // 配置Webpack处理规则
    chainWebpack(config) {
        // 将处理规则的配置信息打印输出到 console
        // console.log("chain config: ",config);
    },
    // 修正生产环境的public路径
    publicPath: process.env.NODE_ENV === 'production'?'/static/app/matrix/'+process.env.VUE_APP_M3_APP:''
}

let merge_vue_config = function(app_config) {
    m3config = utils.merge({}, vue_config)
    m3config = utils.merge(m3config, app_config)
    if(m3config.configureWebpack != vue_config.configureWebpack) {
        m3config.configureWebpack = (oconfig) => {
            // 先执行M3定义的Webpack配置
            if(IS_DEBUG)console.log("default config: "+JSON.stringify(oconfig, " ", 2));
            vue_config.configureWebpack(oconfig)
            if(IS_DEBUG)console.log("m3inner config: "+JSON.stringify(oconfig, " ", 2));
            if (typeof(app_config.configureWebpack) == 'function') {
                // 执行函数形式的Webpack配置
                app_wp_config = app_config.configureWebpack(oconfig)
                if(app_wp_config){
                    // 返回结果
                    if(IS_DEBUG)console.log("custom return config: "+JSON.stringify(app_wp_config, " ", 2));
                    return app_wp_config
                }
                // 没有结果不返回任何值
                if(IS_DEBUG)console.log("custom update config: "+JSON.stringify(oconfig, " ", 2));
            } else {
                // 直接返回应用定义的Webpack配置信息
                if(IS_DEBUG)console.log("custom defined config: "+JSON.stringify(app_config.configureWebpack, " ", 2));
                return app_config.configureWebpack
            }
        }
    }
    if(m3config.chainWebpack != vue_config.chainWebpack) {
        m3config.chainWebpack = (config) => {
            vue_config.chainWebpack(config)
            app_config.chainWebpack(config)
        }
    }
    return m3config
}

module.exports = (config)=>{
    return merge_vue_config(config)
}