#!/usr/bin/env node
let retcode=255
//定义m3cmd
function m3cmd(){
    //引入path模块，用于解析路径信息
    const path = require('path')
    //当前工作目录
    const CURDIR = process.cwd()
    //当前路径父目录名，与当前M³小应用简称一致
    const M3APPNAME = path.basename(CURDIR)
    //m3js不能在m3js自己的工程目录运行，以避免损坏自身代码
    const M3JSDIR = path.dirname(__dirname)
    //M³小应用简称保留m3js命名
    if(M3APPNAME.toLowerCase() == "m3js") {
        process.stdout.write(`\r\nM3Applet can't named '${M3APPNAME}'\r\n\r\n`)
        return 254
    }
    //第一个参数应该是node
    const nodepath = process.argv.shift()
    //第二个参数应该是启动程序js
    const mainjs = process.argv.shift()
    //定义命令执行函数
    function runcmd(cmdjs) {
        //执行命令
        const child_process = require('child_process')
        //console.log(nodepath, [cmdjs, ...process.argv])
        process.env.M3JSDIR = M3JSDIR
        process.env.M3APPNAME = M3APPNAME
        const sp = child_process.spawn(nodepath, [cmdjs, ...process.argv], {
            windowsHide: true,
            stdio: [process.stdin, process.stdout, process.stderr]
        })
        sp.on("close", (code)=>{
            retcode = code
        })
        return retcode
    }
    //默认显示使用方法
    if(process.argv.length > 0) {
        //第一个参数为命令参数
        const cmd=process.argv.shift()
        const cmdjs=`${M3JSDIR}/m3app_base/${cmd}.js`
        const fs=require('fs')
        if(fs.existsSync(cmdjs)) {
            try{
                return runcmd(cmdjs)
            }catch(e){
                console.error(e.message)
                return 254
            }
        }
        console.log(`命令 ${cmd} 不存在`)
    }
    console.log(`Usage:
    m3js init   根据M3JS提供的模版初始化工程目录
    m3js run    开发阶段启动当前M³小应用
    m3js update 更新当前M³小应用所使用的最新版M3JS
    m3js deploy 编译部署当前M³小应用
    `)
    console.log(`当前工作目录：${CURDIR}`)
    return 1
}
//执行m3cmd
retcode = m3cmd()
//退出返回码
process.on("beforeExit", ()=>{process.exit(retcode)})
