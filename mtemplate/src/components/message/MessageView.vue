<template>
  <div>
    <el-badge :is-dot="true" style="line-height: 25px;margin-top: 5px;" @click.native="dialog.message.show = true;">
      <el-button style="padding: 5px;" size="small" type="primary">
        <svg-icon icon-class="message" style="width: 1.2em;height: 1.2em;"/>
      </el-button>
    </el-badge>

    <el-dialog :visible.sync="dialog.message.show"
      append-to-body 
      custom-class="message-dialog"
      @show="initData">
      
      <div slot="title">
        <h3>消息</h3>
        <!-- <el-button size="mini" type="primary" icon="el-icon-delete" @click="onClearAll">清理消息</el-button> -->
      </div>
      <el-container style="height: calc(100vh - 440px);">
        <el-main style="overflow:hidden;">
            <el-tabs value="audit" type="border-card">
              <el-tab-pane label="消息" name="message"></el-tab-pane>
              <el-tab-pane label="系统日志" name="audit">
                <ul class="infinite-list" v-infinite-scroll="initData" style="overflow:auto;height:calc(100vh - 530px);">
                  <li v-for="row in dt.rows" class="infinite-list-item" :key="row.id">
                    {{ row.user }} <el-divider direction="vertical"></el-divider> 
                    {{ row.module }} <el-divider direction="vertical"></el-divider>
                    <el-popover
                      placement="top-start"
                      width="200"
                      trigger="hover"
                      :content="row.operation">
                      <el-button slot="reference">{{ row.operation | formatStr }}</el-button>
                    </el-popover>
                    <el-divider direction="vertical"></el-divider>
                    {{ row.source }} <el-divider direction="vertical"></el-divider>
                    {{ row.vtime | formatDate}}</li>
                </ul>
              </el-tab-pane>
            </el-tabs>
        </el-main>
      </el-container>
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash';

export default {
  name: 'MessageView',
  data() {
    return {
      dt: {
          rows: []
      },
      dialog:{
        message:{
          show: false
        }
      }
    }
  },
  filters:{
    formatStr(val){
      return _.truncate(val);
    },
    formatDate(val){
      return new Date(val).toLocaleString();
    }
  },
  methods: {
    initData() {
      this.m3.callFS("/matrix/m3event/message/getMessage.js").then(rtn=>{
        this.dt.rows = rtn.message;
      })
    }
  }
}
</script>

<style scoped>
  .infinite-list {
      height: 100%;
      padding: 0;
      margin: 0;
      list-style: none;
  }

  .infinite-list .infinite-list-item {
      display: flex;
      align-items: center;
      justify-content: left;
      height: 40px;
      background: #f2f2f2;
      margin: 10px;
      color: #101323;
      padding:0 20px;
  }
</style>

<style>
  .message-dialog.el-dialog {
      width: 60vw!important;
      height: 70vh;
  }
</style>