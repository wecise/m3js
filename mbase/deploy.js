
const path=require('path')

if(process.env.M3JSDIR!=path.dirname(__dirname) || process.env.M3APPNAME!=path.basename(process.cwd())){
    console.error("arguments error.")
    process.exit(255)
}

const child_process = require('child_process')
const cmds = "npm run build".split(" ")
const npm = child_process.spawnSync(cmds[0], [...cmds.slice(1), ...process.argv.slice(2)], {
    windowsHide: true,
    stdio: [process.stdin, process.stdout, process.stderr]
})
process.exit(npm.status)
