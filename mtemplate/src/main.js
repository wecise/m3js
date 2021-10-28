// 静态加载依赖组件
import Vue from 'vue'

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
import("@wecise/m3js").then((m)=>{
    m.default.go(m3config)
    /*******************************************************************************************
     **** m.default.go 所做的操作如下。如需定制化处理，可以使用下面的代码代替 m.default.go(m3config) ****
     *******************************************************************************************
    let m3 = m.default;
    window.state && window.state("正在初始化小应用配置...")
    // m3js加载完成，根据配置信息动态有序异步加载依赖组件，完成M3小应用初始化
    m3.init(m3config).then(()=>{
        window.state && window.state("正在渲染页面...")
        // m3.render完成的工作是渲染Vue页面，也可以写成
        // new Vue({
        //     render: h => h(window.App),
        //     mounted: function(){
        //         window.state && window.state("页面渲染完成...")
        //         m3.completed() // 加载数据
        //     },
        // }).$mount('#app')
        m3.render().then(()=>{
            window.state && window.state("正在加载数据...")
            // 此时Vue渲染已经完成，但是页面还不能正常显示，还需要加载页面相关数据，并驱动Vue相关组件更新显示状态
            m3.completed().then(()=>{
                // 此时页面才能正常显示
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
    /**** m.default.go ****/
}).catch((e)=>{
    console.error(e)
});
