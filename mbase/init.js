
const path=require('path')

if(process.env.M3JSDIR!=path.dirname(__dirname) || process.env.M3APPNAME!=path.basename(process.cwd())){
    console.error("arguments error.")
    process.exit(255)
}

const fs=require('fs')
if(fs.existsSync("src") && process.argv.indexOf("--force")<0) {
    console.error("The applet src is exists. init with '--force' to delete 'src' directory and reinitialize.")
    process.exit(255)
}

fs.cpSync(`${process.env.M3JSDIR}/mtemplate/`, "./", {recursive: true, force: true})

let spkg = fs.readFileSync("package.json")
spkg = JSON.parse(spkg.toString())
spkg.name = process.env.M3APPNAME
//spkg = spkg.replace(/\"name\":\s*\".*\"/, `"name": "${process.env.M3APPNAME}"`)
fs.writeFileSync("package.json", JSON.stringify(spkg,"  ",2))

let senv = fs.readFileSync(".env")
senv = senv.toString()
senv = senv.replace(/VUE_APP_M3_APP\s*\=\s*[\"\'].*[\"\']/, `VUE_APP_M3_APP="${process.env.M3APPNAME}"`)
senv = senv.replace(/VUE_APP_M3_TITLE\s*\=\s*[\"\'].*[\"\']/, `VUE_APP_M3_TITLE="${process.env.M3APPNAME}"`)
fs.writeFileSync(".env", senv)

const child_process = require('child_process')
const npm = child_process.spawnSync("npm", ["install", ".", "--force", "--save"], {
    windowsHide: true,
    stdio: [process.stdin, process.stdout, process.stderr]
})
process.exit(npm.status)
