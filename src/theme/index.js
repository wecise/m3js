
import Cookies from 'js-cookie';

// 已经定义好的样式主题
const themes = {dark:'#252D47',light:'#409EFF'};

// 应用样式主题，无需后续处理，样式直接生效
let setTheme = function(name) {
    const theme = themes[name] || '#252D47'
    if(Cookies.get("m3-theme") != name) {
        Cookies.set("m3-theme", name)
    }
    window.state && window.state("正在加载主题样式["+name+":"+theme+"]...");
    return import(`@/assets/theme/element-${theme}/index.css`)
}

// 样式主题
let initTheme = function(name) {
    return setTheme(name || Cookies.get("m3-theme"))
}

export default {setTheme, initTheme, themes}