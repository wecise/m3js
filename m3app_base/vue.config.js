const WebpackZipPlugin = require('webpack-zip-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const path = require('path')
const IS_PROD = process.env.NODE_ENV === 'production'
const IS_M3JS = process.env.VUE_APP_M3_APP === "m3js"
const IS_DEBUG = process.env.VUE_APP_M3_DEBUG && process.env.VUE_APP_M3_DEBUG.indexOf("vue.config")>=0
const productionGzipExtensions = ['html', 'js', 'css']

function resolve(dir) {
    return path.join(process.cwd(), dir)
}

module.exports = {
    // 开发阶段本地web服务
    devServer: {
        port: 8080, // 开发阶段本地服务端口，当前端口被占用时按自动+1处理
        contentBase: [
            //path.join(process.cwd(), "public"), //默认工作目录下的public目录
            path.join(__dirname, "public"), //追加本文件所在目录下的public目录
        ]
    },
    // 编译结果输出目录
    outputDir: 'app/matrix/' + process.env.VUE_APP_M3_APP,
    // 生产环境无需映射源代码资的源地图
    productionSourceMap: false,
    // 配置Webpack
    configureWebpack: oconfig => {
        // 将默认的配置信息打印输出到 console
        if(IS_DEBUG)console.log("default config: "+JSON.stringify(oconfig, " ", 2));
        config = {};
        config.plugins = [];
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
        config.externals = {
            //"要导入的包": "window对象中的对应变量"
            "lodash": "_",
            "moment": "moment",
            "../moment": "moment", // 单独加载 moment 内部语言包时使用
            "vue": "Vue",
            "element-ui": "ELEMENT",
        }
        // HTML模版，需要配合 config.externals 引入相应js
        let assetsLibPath = "/static/app/assets"
        config.plugins.push(new HtmlWebpackPlugin({
            filename: "index.html",
            templateContent: `<!DOCTYPE html>
<html>
    <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <script src="${assetsLibPath}/js/lodash.js"></script>
    <script src="${assetsLibPath}/js/moment.js"></script>
    <script src="${assetsLibPath}/js/vue.js"></script>
    <script src="${assetsLibPath}/js/element-ui.js"></script>
    <link rel="stylesheet" type="text/css" href="${assetsLibPath}/css/loading.css" />
    <script>
        window.timeStart=window.timePhase=Date.now();
        Date.prototype.format=function(f){var o={"M+":this.getMonth()+1,"d+":this.getDate(),"h+":this.getHours(),"m+":this.getMinutes(),"s+":this.getSeconds(),"S":this.getMilliseconds()};if(/(y+)/.test(f))f=f.replace(RegExp.$1,(this.getFullYear()+"").substr(4-RegExp.$1.length));for(var k in o)if(new RegExp("("+k+")").test(f))f=f.replace(RegExp.$1,RegExp.$1.length==1?o[k]:("00"+ o[k]).substr((""+ o[k]).length));return f}
        console.odebug=console.debug;console.debug=function(){var t=Date.now();console.odebug.call(this,new Date().format("yyyy-MM-dd hh:mm:ss.S"),"("+(t-window.timePhase)+"/"+(t-window.timeStart)+")",...arguments)}
        window.state=(s)=>{if(s){console.debug("[M3S]",s);e=document.getElementById("preload_message");if(e)e.innerHTML=s}window.timePhase=Date.now()}
        window.state("正在加载页面...")
    </script>
    <link rel="icon" href="favicon.ico"/>
    <title></title>
    </head>
    <body>
    <noscript>
        <strong>Please enable JavaScript to continue.</strong>
    </noscript>
    <div id="preload" style="width:100vw;height:100vh;display:block;position:relative;">
        <div class="lds-grid"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
        <div style="width:100vw;height:100vh;display:flex;flex-flow:column nowrap;align-items:center;justify-content:center;">
        <label id="preload_message" style="flex:0 0 auto;">正在加载页面...</label>
        </div>
    </div>
    <div id="app"></div>
    <!-- built files will be auto injected -->
    </body>
</html>`
        }));
        // 设置目录别名
        config.resolve = {
            alias: {
                "~": oconfig.context, // 工程所在目录
                "@": oconfig.context+(IS_M3JS?"/m3app_template/src":"/src"), // 工程src目录
            },
        }
        // 使用 @wecise/m3js 内置入口
        config.entry = {
            app: IS_M3JS?"./src/main.js":"@wecise/m3js/src/main.js"
        }
        // 运行模式（运行环境标记）
        // 开发阶段在 .env 文件中指定，通过 npm run serve 执行，一般指定 NODE_ENV="development"
        // 生产发布时 process.env.NODE_ENV === 'production'，通过 npm run build 编译部署到 M3 主服务器，同时自动发布到小应用市场
        config.mode = process.env.NODE_ENV
        // 将定制的配置信息打印输出到 console
        if(IS_DEBUG)console.log("custom config: "+JSON.stringify(config, " ", 2));
        return config;
    },
    // 配置Webpack处理规则
    chainWebpack(config) {
        // 转换 icons 目录下的 svg，通过 svg-sprite-loader 加载
        // set svg-sprite-loader
        config.module
            .rule('svg')
            .exclude.add(resolve('src/assets/icons'))
            .end()
        config.module
            .rule('icons')
            .test(/\.svg$/)
            .include.add(resolve('src/assets/icons'))
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]'
            })
            .end()
        // 将处理规则的配置信息打印输出到 console
        // console.log("chain config: ",config);
    },
    // 修正生产环境的public路径
    publicPath: process.env.NODE_ENV === 'production'?'/static/app/matrix/'+process.env.VUE_APP_M3_APP:''
}