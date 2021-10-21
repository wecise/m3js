
// 开始动态加载依赖组件
window.state && window.state("正在加载依赖组件...")

// 动态加载模块依赖关系
// auth,global,Vue... 为 m3 内部加载的模块, 这里的定义只为标明依赖关系时引用, 初始化时会自动替换为m3内部定义
let mods = {auth:{}, global:{}, Vue:{}}
mods.App = {
    f: () => import(`@/App.vue`),  // 动态加载 App.vue
    deps: [mods.global, mods.auth, mods.Vue] // App.vue 运行时依赖 global 和 auth
}

// m3小应用开发框架配置信息
let m3config = {
    global: window,
    rootDivID: "app",
    lang: "zh-CN", 
    theme: "", // 默认使用cookie中保存的信息或使用内置缺省值
    displayLoadingState: true,
    mods,
}

// 加载m3js
//let m3js = process.env.NODE_ENV === 'production'?"@wecise/m3js":"./m3js"
//import(`${m3js}/src/index.js`).then((m)=>{
import("./m3.js").then((m)=>{
    window.state && window.state("正在初始化小应用配置...")
    let m3 = m.default;
    m3.Init(m3config).then(()=>{
        window.state && window.state("正在渲染页面...")
        m3.Render().then(()=>{
            window.state && window.state("正在加载数据...")
            m3.Completed().then(()=>{
                window.state && window.state("页面输出完成.");
            }).catch((e)=>{
                console.error(e)
            })
        }).catch((e)=>{
            console.error(e)
        })
    }).catch((e)=>{
        console.error(e)
    })
}).catch((e)=>{
    console.error(e)
});
