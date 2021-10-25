<template>
    <div class="footer">
        <span>
            版本：{{app.version}}
        </span>
        <el-divider direction="vertical"></el-divider>
        <el-dropdown @command="onApiCommand" style="cursor:pointer;">
            <span class="el-dropdown-link">
                <i class="el-icon-tickets el-icon--right"></i> API
            </span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="item.url" v-for="item in api.list" :key="item.name">{{item.name}}</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
        <!-- <el-divider direction="vertical"></el-divider>
        <el-dropdown @command="onLangCommand" style="cursor:pointer;">
            <span class="el-dropdown-link">
                <i class="el-icon-s-home el-icon--right"></i> {{lang.name}}
            </span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="item.value" v-for="item in lang" :key="item.name">{{item.name}}</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown> -->
        <el-divider direction="vertical"></el-divider>
        <el-dropdown style="cursor:pointer;">
            <span class="el-dropdown-link">
                <i class="el-icon-coin el-icon--right"></i> {{company.name}}
            </span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>名称：{{company.name}}</el-dropdown-item>
                <el-dropdown-item>应用：{{company.ospace}}</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
        <el-divider direction="vertical"></el-divider>
        <el-link :href="company.web" target="_blank" :underline="false">
            <i class="el-icon-user el-icon--right"></i> {{company.fullname}}
        </el-link>
    </div>
</template>

<script>
    import _ from 'lodash';
    export default{
        name: "Footer",
        props: {
            auth: Object
        },
        data(){
            return {
                app: {
                    year: "2021",
                    version: "0.9.0"
                },
                api: {
                    list: []
                },
                lang:{
                    list: []
                }
            }
        },
        computed:{
            company(){
                return this.auth.Company;
            }
        },
        created(){
            this.m3.callFS('/matrix/footer/api_contextmenu.js', null).then( (rtn)=>{
                this.api.list = _.map(rtn.message,(v,k)=>{
                    return {name: v.name, url: k, icon: v.icon};
                });
            } );
        },
        methods:{
            onLangCommand(cmd) {
                window.location.href=`${window.location.origin}?lang=${cmd}`;
            },
            onApiCommand(cmd){
                window.open(`${window.location.origin}${cmd}`,"_blank");
            }
        }
    }
</script>

<style scoped>
    .footer{
        color: #888888;
        height: 30px;
        line-height:30px;
        position: fixed;
        bottom: 0px;
        line-height: 30px;
        right: 50px;
        width: 100%;
        text-align: right;
    }
    .footer .el-link{
        color: #888888;
    }
</style>
