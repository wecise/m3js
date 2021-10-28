<template>
  <div class="m3" v-if="auth && auth.signedUser">
    <Header :auth="auth.signedUser" class="header" v-if="control.header.show"></Header>
    <div class="main">
      <SideBar class="sidebar" :auth="auth.signedUser" :global="global"  v-if="control.sidebar.show"></SideBar>
      <div class="mainview" style="width:100vw;height:100vh;display:flex;flex-flow:column nowrap;align-items:center;justify-content:center;">
        <label style="font-size:100px;">M³小应用开发框架</label>
      </div>
    </div>
    <Footer :auth="auth.signedUser" class="footer" v-if="control.footer.show"></Footer>
  </div>
</template>

<script>

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import SideBar from './components/layout/SideBar';

export default {
  name: 'app',
  components: {
    Header,
    Footer,
    SideBar
  },
  data(){
    return {
      global: null,
      auth: null,
      control:{
        header:{
          show: true
        },
        sidebar:{
          show: false
        },
        footer:{
          show: true
        }
      }
    }
  },
  created(){
    this.global = window.m3.global;
    this.auth = window.m3.auth;
  }
}
</script>

<style>
  body{
    font-size: 12px;
    font-family: "PingFang SC",Arial,"Microsoft YaHei",sans-serif;
    margin: 0px;
    padding: 0px;
    overflow: hidden;
  }
  
  .el-input__inner{
    padding: 0 5px!important;
  }

  .el-menu .svg-icon{
    width: 1.2em!important;
    height: 1.2em!important;
    padding: 0px 5px 0 0;
  }

  .main{
    padding-top: 50px;
    display: flex;
  }

  .container{
    overflow: hidden;
  }
</style>
