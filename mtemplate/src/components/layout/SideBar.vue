<template>
    <el-menu :default-active="defaultActive"
            mode="vertical"
            @select="onSelect"
            @open="onOpen" 
            @close="onClose" 
            :collapse="isCollapse"
            :collapse-transition="false"
            class="el-menu-vertical-sidebar"
            text-color="#fff"
            active-text-color="#ffd04b"
            v-if="auth && model">

        <!-- <el-menu-item index="toggle" style="display:">
            <i :class="isCollapse?'el-icon-s-unfold':'el-icon-s-fold'" style="width:16px;color:#fff;"></i>
        </el-menu-item>

        <el-menu-item index="apps" v-if="auth.Company.name == 'wecise'">
            <img :src="preFixIcon+'app.png'+postFixIcon" style="width:16px;"></img> 
            <span style="padding-left:5px;" slot="title">应用</span>
        </el-menu-item> -->
        
        <el-menu-item index="/">
            <img :src="preFixIcon+'home.png'+postFixIcon" style="width:16px;"/>
            <span style="padding-left:5px;" slot="title">首页</span>
        </el-menu-item>
        
        <!-- 有模板情况-->
        <el-submenu :index="item.name" v-for="item in model.template" :key="item.name" v-show="sideBarStatus === 0">
            <template slot="title">
                <img :src="item.icon | pickIcon" style="width:16px;"/>
                <span style="padding-left:5px;font-size:12px;">{{ item.title }}【{{item.groups.length}}】</span>
            </template>
            
            <el-menu-item-group>
                <span slot="title" style="font-size:12px;">{{ item.title }}【{{item.groups.length}}】</span>
                <el-menu-item :class="subItem.status" :index="subItem.url" v-for="subItem in item.groups"  :key="subItem.name">
                    <img :src="subItem.icon | pickIcon" style="width:16px;"/>
                    <span slot="title">
                        <span style="padding-left:5px;" v-if="global.register.lanuage == 'zh_CN'">{{subItem.cnname}}</span>
                        <span style="padding-left:5px;" v-else>{{subItem.enname}}</span>
                        <el-tooltip content="在新窗口中打开" placement="right-start">
                            <el-button type="text" icon="el-icon-position" @click.stop.prevent="onClick(subItem.url)" style="float:right;transform:scale(0.6);color:#ffffff;"></el-button>
                        </el-tooltip>
                    </span>
                </el-menu-item>
            </el-menu-item-group>
        </el-submenu>

        <!-- 没有模板情况，且菜单项数量超过阈值-->
        <el-submenu index="appList" v-show="sideBarStatus === 1">
            <template slot="title">
                <i class="fas fa-cubes" style="color:#ffffff;font-size:18px;"></i>
                <span>应用</span>
            </template>

            <el-menu-item-group>
                <span slot="title">应用</span>
                <el-menu-item :class="item.status" :index="item.url" v-for="item in model.list" :key="item.name">
                    <img :src="item.icon | pickIcon" style="width:16px;"/>
                    <span slot="title">
                        <span style="padding-left:5px;" v-if="global.register.lanuage == 'zh_CN'">{{item.cnname}}</span>
                        <span style="padding-left:5px;" v-else>{{item.enname}}</span>
                        <el-tooltip content="在新窗口中打开" placement="right-start">
                            <el-button type="text" icon="el-icon-position" @click.stop.prevent="onClick(item.url)" style="float:right;transform:scale(0.6);color:#ffffff;"></el-button>
                        </el-tooltip>
                    </span>
                </el-menu-item>
            </el-menu-item-group>
        </el-submenu>

        <!-- 没有模板情况，且菜单项数量没超过阈值-->
        <el-menu-item :class="item.status" :index="item.url" v-for="item in model.list" :key="item.name" v-show="sideBarStatus === 2">
            <img :src="item.icon | pickIcon" style="width:16px;"/>
            <span slot="title">
                <span style="padding-left:5px;" v-if="global.register.lanuage == 'zh_CN'">{{item.cnname}}</span>
                <span style="padding-left:5px;" v-else>{{item.enname}}</span>
                <el-tooltip content="在新窗口中打开" placement="right-start">
                    <el-button type="text" icon="el-icon-position" @click.stop.prevent="onClick(item.url)" style="float:right;transform:scale(0.6);color:#ffffff;"></el-button>
                </el-tooltip>
            </span>
        </el-menu-item>

        <!-- 没有分组的应用-->
        <el-submenu :class="item.status" :index="item.url" v-for="item in model.appListUnGrouped" :key="item.name">
            <template slot="title">
                <img :src="item.icon | pickIcon" style="width:16px;"/>
                <span style="padding-left:5px;" v-if="global.register.lanuage == 'zh_CN'">{{item.cnname}}</span>
                <span style="padding-left:5px;" v-else>{{item.enname}}</span>
            </template>
            <el-menu-item :index="item.url">
                <span style="padding-left:5px;" v-if="global.register.lanuage == 'zh_CN'">{{item.cnname}}</span>
                <span style="padding-left:5px;" v-else>{{item.enname}}</span>
                <el-tooltip content="在新窗口中打开" placement="right-start">
                    <el-button type="text" icon="el-icon-position" @click.stop.prevent="onClick(item.url)" style="float:right;transform:scale(0.6);color:#ffffff;"></el-button>
                </el-tooltip>
            </el-menu-item>
        </el-submenu>

    </el-menu>
</template>

<script>
import _ from 'lodash';

export default{
    name: "SideBar",
    props: {
        auth: Object,
        global: Object
    },
    data(){
        return {
            model: null,
            preFixIcon: '/static/assets/images/apps/png/',
            postFixIcon: '',
            isCollapse: true,
            defaultActive: '/matrix/home',
            appConfig: [],
            sideBarStatus: 2
        }
    },
    created(){
        this.init();
    },
    mounted(){
        this.defaultActive = window.location.pathname;
    },
    filters:{
        pickIcon(icon){
            return `/static/assets/images/apps/png/${icon}`;
        }
    },
    methods: {
        init(){
            this.m3.callFS("/matrix/m3appstore/user.js", this.auth.username).then( (val)=>{
                let rtn = val.message;
                
                this.model = {
                    list: _.map(rtn.appListSelected,(v)=>{
                            /* let _page = _.last(mx.getPage().split("/"));

                            if(_.endsWith(v.url,_page)){
                                return _.merge(v, {status: "active"});
                            } */

                            return _.merge(v, {status: ""});
                        }),
                    template: rtn.template,
                    appListUnGrouped: rtn.appListUnGrouped
                };

                this.setStatus();
            } );
            
        },
        setStatus(){
            // 有模板情况
            if(!_.isEmpty(this.model.template)){
                this.sideBarStatus = 0;
            } 
            // 没有模板情况
            else{
                // 菜单项超过阈值
                if(this.model.list.length > this.global.register.sidebar.menuCollapse){
                    this.sideBarStatus = 1;
                }
                // 菜单项没有超过阈值
                else {
                    this.sideBarStatus = 2;
                }
            }
        },
        initWnd(){

            /* setTimeout(() => {
                this.wnd = maxWindow.winApps(`应用市场`, `<div id="nav-menu-level1" style="width:100%;height:100%;"></div>`, null, 'apps-container');
                inst.app = new Vue(inst.appBox()).$mount("#nav-menu-level1");
            }, 50); */

        },
        refresh(){
            this.init();
        },
        onToggle(){
            this.isCollapse = !this.isCollapse;
        },
        onSelect(index,indexPath){
            if(index == 'toggle'){
                this.onToggle();
            } else if(index == 'apps'){
                this.initWnd();
            } else {
                window.open(index,'_parent');
            }
        },
        onClick(url){
            window.open(url,'_blank')
        },
        onOpen(key, keyPath) {
            console.log(key, keyPath);
        },
        onClose(key, keyPath) {
            console.log(key, keyPath);
        }
    }
}
</script>

<style scoped>
    .dark .m3 > .sidebar{
        width: 60px;
    }

    .el-menu-vertical-sidebar:not(.el-menu--collapse){
        width: 200px;
        height: 100vh;
    }

    .el-menu--collapse {
        width: 64px;
        height: calc(100vh - 50px);
    }

    .el-menu {
        border-right: solid 1px #e6e6e6;
        list-style: none;
        flex: 0 0 auto;
        margin: 0;
        padding-left: 0;
        background-color: #252d47;
    }

    .el-menu-item i {
        color: #ffffff;
    }
    .el-menu--collapse>.el-menu-item.is-active i {
        color: #ffffff;
    }
</style>

<style>
    .el-menu:not(.el-menu--popup-bottom-start), 
    .el-menu--horizontal>.el-menu-item:not(.is-disabled):focus, 
    .el-menu--horizontal>.el-menu-item:not(.is-disabled):hover, 
    .el-menu--horizontal>.el-submenu .el-submenu__title:hover {
        background-color: #252d47!important;
    }
    .el-submenu__title:hover{
        background-color: #409dfe!important;
    }
    .el-submenu:hover {
        background-color: #409dfe!important;
    }
</style>
