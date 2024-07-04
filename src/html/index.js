
import http from "../axios/http"
import m3 from "../base"

/**
 * Set Home for login user
 */
 let setAppAsHome = function(vm,item){
    return new Promise(function(resolve, reject) {
        let fm = new FormData();
        fm.append("home", item.url.split("").slice(1,item.url.length).join(""));
        fm.append("_csrf", m3.getCookie("_csrf"))
        http.post({
            url: `/user/settings/home`,
            param: fm
        }).then(res=>{
            vm.$message({
                type: "info",
                message: "首页已设置为：" + item.url
            });
            resolve(res.data);
        }).catch(err=>{
            vm.$message({
                type: "error",
                message: "首页设置失败：" + err
            });
            reject(err.data);
        })
    })
};

/**
 * Set Home for all user
 */
let setAppAsHomeForAllUser = function(vm,item){
    return new Promise(function(resolve, reject) {
        let fm = new FormData();
        fm.append("home", item.url.split("").slice(1,item.url.length).join(""));
        fm.append("_csrf", m3.cookies.get("_csrf"))
        http.post({
            url: `/admin/users/home`,
            param: fm
        }).then(res=>{
            vm.$message({
                type: "info",
                message: "首页已设置为：" + item.url
            });
            resolve(res.data);
        }).catch(err=>{
            vm.$message({
                type: "error",
                message: "首页设置失败：" + err
            });
            reject(err.data);
        })
    })
};

/**
 * Set Title for M3 platform
 */
let setTitle = function(auth){
    new Promise((resolve,reject)=>{
        try {
            let pathName = window.location.pathname;
            if(m3._.isEmpty(pathName)) {
                document.title = auth.Company.title;
                return false;
            }
            m3.callFS("/matrix/system/getAppNameByUrl.js", encodeURIComponent(pathName)).then( res=>{
                let name = res.message;
                if(!m3._.isEmpty(name)) {
                    document.title = name['cnname'] || name['enname'];

                    const headerEl = document.querySelector('.header>div>span');
                    headerEl.innerHTML = ' ' + name['cnname'] || name['enname'];
                } else {
                    document.title = auth.Company.title;
                }
                setTimeout(()=>{
                    let link = document.querySelector("link[rel~='icon']");
                    if (!link) {
                        link = document.createElement('link');
                        link.rel = 'icon';
                        document.getElementsByTagName('head')[0].appendChild(link);
                    }
                    link.href = auth.Company.icon || auth.Company.logo;
                    resolve();
                },0)
            });
        } catch(err) {
            console.error(err,auth)
            document.title = auth.Company.title;
            reject(err);
        }
    })
};

/**
 * 全屏控制
 */
let fullScreen = function(mode) {
    if ( mode ) {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) {
            document.documentElement.msRequestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }
};

let fullScreenByEl = function(el) {
    if (document.fullscreenElement) {
        document.exitFullscreen();
        return false;
    } else {
        el.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        return true;
    }
}


let adjustColor = function(color, amount) {
    return '#' + color.replace(/^#/, '').replace(/../g, color => ('0'+Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
}


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

export {setTitle, setAppAsHome, setAppAsHomeForAllUser, fullScreen, fullScreenByEl, adjustColor, loadCSS}
