// 开始动态加载依赖组件
window.state && window.state("正在加载依赖组件...")

// 动态加载模块依赖关系
// auth,global,Vue... 为 m3 内部加载的模块, 这里的定义只为标明依赖关系时引用, 初始化时会自动替换为m3内部定义
let mods = {auth:{}, global:{}, Vue:{}}
// 定义应用所需动态加载模块
mods.App = {
    f: () => import(`@/App.vue`),  // 动态加载 App.vue
    deps: [mods.global, mods.auth, mods.Vue] // App.vue 运行时依赖 global 和 auth
}

// m3小应用开发框架配置信息
let m3config = {
    global: window,   //全局变量，默认为window
    rootDivID: "app", //配合vue
    lang: "zh-CN", 
    theme: "", // 默认使用cookie中保存的信息或使用内置缺省值
    displayLoadingState: true,
    mods,
}

// 加载m3js
import("./index.js").then((m)=>{
    m.go(m3config)
}).catch((e)=>{
    console.error(e)
});
