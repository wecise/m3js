const WebpackZipPlugin = require('webpack-zip-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const path = require('path')
const IS_PROD = process.env.NODE_ENV === 'production'
const productionGzipExtensions = ['html', 'js', 'css']

function resolve(dir) {
    return path.join(__dirname, dir)
}

module.exports = {
    devServer: {
        port: 8080 // 开发阶段本地服务端口
    },

    outputDir: 'app/matrix/' + process.env.VUE_APP_M3_APP,
    productionSourceMap: false,

    configureWebpack: oconfig => {
        console.log("default config: "+JSON.stringify(oconfig, " ", 2));
        config = {};
        if (IS_PROD) { // 生产环境
            config.plugins = [
                // 去掉注释，格式化
                // new UglifyJsPlugin({
                //     uglifyOptions: {
                //         mangle: false,
                //         output: {
                //             beautify: true,
                //         },
                //     }
                // }),
                new CompressionPlugin({
                    test: new RegExp(
                        '\\.(' + productionGzipExtensions.join('|') + ')$'
                    ),
                    threshold:10240,
                    minRatio: 1,
                    deleteOriginalAssets:false
                }),
                new WebpackZipPlugin({
                    initialFile: 'app',
                    endPath: './',
                    zipName: process.env.VUE_APP_M3_APP+'.zip',
                    //frontShell: 'sed -i \'\' \'s/src="/src="\\/static\\/app\\/matrix\\/m3event/g\; s/href="/href="\\/static\\/app\\/matrix\\/m3event/g\' ./app/matrix/m3event/index.html',
                    //frontShell: 'sed -i \'\' \'s/src="/src="\\/static\\/app\\/matrix\\/m3event/g\; s/href="/href="\\/static\\/app\\/matrix\\/m3event/g\' ./app/matrix/m3event/index.html',
                    //behindShell: './deploy.sh ' + process.env.VUE_APP_M3_HOST + ' ' + process.env.VUE_APP_M3_COMPANY + ' ' + process.env.VUE_APP_M3_USERNAME + ' "' + process.env.VUE_APP_M3_PASSWORD + '" ' + process.env.VUE_APP_M3_APP + ' ' + process.env.VUE_APP_M3_TITLE + ' ' + process.env.VUE_APP_M3_VERSION
                })
            ]
        } else { // 非生产环境
            config.plugins = [
            ]
        }
        //
        config.plugins.push(new HtmlWebpackPlugin({
            filename: "index.html",
            templateContent: `
<!DOCTYPE html>
<html>
    <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <script src="unkpg.js/lodash.js"></script>
    <script src="unkpg.js/moment.js"></script>
    <script src="unkpg.js/vue.js"></script>
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
        <div style="width:100vw;height:100vh;display:flex;flex-flow:column nowrap;align-items:center;justify-content:center;">
        <label id="preload_message" style="flex:0 0 auto;">正在加载页面...</label>
        </div>
    </div>
    <div id="app"></div>
    <!-- built files will be auto injected -->
    </body>
</html>
            `
        }));
        //防止将某些 import 的包(package)打包到 bundle 中，而是在运行时(runtime)再去从外部获取这些扩展依赖
        config.externals = {
            //"要导入的包": "window对象中的对应变量"
            "lodash": "_",
            "moment": "moment",
            "../moment": "moment",
            "vue": "Vue",
        }
        //
        config.plugins.push(new UglifyJsPlugin({
            uglifyOptions: {
                mangle: true,
                output: {
                    comments: false,
                },
            },
        }));
        //设置目录别名
        config.resolve = {
            alias: {
                "~": oconfig.context, // 工程目录
                "@": oconfig.context+"/src/template"
            },
        }
        config.entry = {
            app: "./src/main.js"
        }
        config.mode = process.env.NODE_ENV
        //
        console.log("custom config."+JSON.stringify(config, " ", 2));
        return config;
    },

    chainWebpack(config) {
        if (IS_PROD) {
        } else {
            //config.resolve.symlinks(true)
        }
        // set svg-sprite-loader
        config.module
            .rule('svg')
            .exclude.add(resolve('src/icons'))
            .end()
        config.module
            .rule('icons')
            .test(/\.svg$/)
            .include.add(resolve('src/icons'))
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]'
            })
            .end()
        // console.log("config: ",config);
    },

    publicPath: process.env.NODE_ENV === 'production'?'/static/app/matrix/'+process.env.VUE_APP_M3_APP:''
}