
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

let EDITOR_THEME = [
    {
    name: "亮色",
    enname: "light",
    items: [
        { name: "chrome" },
        { name: "clouds" },
        { name: "crimson_editor" },
        { name: "dawn" },
        { name: "dreamweaver" },
        { name: "eclipse" },
        { name: "github" },
        { name: "iplastic" },
        { name: "solarized_light" },
        { name: "textmate" },
        { name: "tomorrow" },
        { name: "xcode" },
        { name: "kuroir" },
        { name: "katzenmilch" },
        { name: "sqlserver" },
    ],
    },
    {
    name: "暗色",
    enname: "dark",
    items: [
        { name: "ambiance" },
        { name: "chaos" },
        { name: "clouds_midnight" },
        { name: "dracula" },
        { name: "cobalt" },
        { name: "gruvbox" },
        { name: "gob" },
        { name: "idle_fingers" },
        { name: "kr_theme" },
        { name: "merbivore" },
        { name: "merbivore_soft" },
        { name: "mono_industrial" },
        { name: "monokai" },
        { name: "pastel_on_dark" },
        { name: "solarized_dark" },
        { name: "terminal" },
        { name: "tomorrow_night" },
        { name: "tomorrow_night_blue" },
        { name: "tomorrow_night_bright" },
        { name: "tomorrow_night_eighties" },
        { name: "twilight" },
        { name: "vibrant_ink" },
    ],
    },
];

export default {setTheme, initTheme, themes, EDITOR_THEME}