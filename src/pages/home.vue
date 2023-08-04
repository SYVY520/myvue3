<template style="overflow: visible;height: 100%;">
    <div class="common-layout">
      <el-container>
        <el-aside width="210px" id="aside">
          <div class="homeT">
            <img src="/favicon.ico" style="width:40px;height: 40px; vertical-align: bottom;">
            <span class="homeTopic">软件杂志社</span>
          </div>
          <el-scrollbar>
            <el-menu :default-openeds="['1','3','4','2']" :router="true" :default-active="ruleForm.path">
              <el-sub-menu index="1">
                <template #title><el-icon><Document /></el-icon>我要投稿</template>
                <el-menu-item-group>
                  <el-menu-item :index="'/home/'+route.params.id">软件杂志</el-menu-item>
                  <el-menu-item :index="'/submission/'+route.params.id">我要投稿</el-menu-item>
                  <el-menu-item :index="'/manuscript/'+route.params.id+'?index=1-3&status=已更新'">我的稿件</el-menu-item>
                </el-menu-item-group>
              </el-sub-menu>
              <el-sub-menu index="3" v-if="ruleForm.identity=='review'">
                <template #title><el-icon><Edit /></el-icon>我要审稿</template>
                              <el-menu-item-group>
                               <el-menu-item :index="'/unreviewed1/'+route.params.id+'?index=3-1'">未审稿件</el-menu-item>
                                <el-menu-item :index="'/unreviewed2/'+route.params.id+'?index=3-2&status=已修改'">在审稿件</el-menu-item>
                                <el-menu-item :index="'/reviewed1/'+route.params.id+'?index=3-3'">完成稿件</el-menu-item>
                              </el-menu-item-group>
                            </el-sub-menu>
              <el-sub-menu index="4" v-if="ruleForm.identity=='editor'">
                <template #title><el-icon><Edit /></el-icon>我的管理</template>
                <el-menu-item-group>
                  <el-menu-item :index="'/Unreviewed/'+route.params.id+'?index=4-1&status=未分配'">在审稿件</el-menu-item>
                  <el-menu-item :index="'/Reviewed/'+route.params.id+'?index=4-2'">完成稿件</el-menu-item>
                  <el-menu-item :index="'/Editorial/'+route.params.id+'?index=4-3'">人员管理</el-menu-item>
                </el-menu-item-group>
              </el-sub-menu>
              <el-sub-menu index="2">
                <template #title><el-icon><User /></el-icon>个人信息</template>
                <el-menu-item-group>
                  <el-menu-item :index="'/information/'+route.params.id">基本信息</el-menu-item>
                  <el-menu-item :index="'/password/'+route.params.id">修改密码</el-menu-item>
                </el-menu-item-group>
              </el-sub-menu>
            </el-menu>
          </el-scrollbar>
        </el-aside>
        <el-container>
          <el-header id="header">
            <div class="headerRight">
              <el-dropdown>
                <div>
                  <div class="headerImg"><img :src="ruleForm.pic" style="width: 35px;height: 35px;"></div>
                  <div class="headerName"><span>{{ruleForm.name}}</span></div>
                </div>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="open">登出平台</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </el-header>
          <el-main id="main">
            <router-view/>
          </el-main>
        </el-container>
      </el-container>
    </div>
</template>

<script lang="ts" setup>
import {onMounted, reactive} from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import axios from "axios";
import {Document, Edit, User} from "@element-plus/icons-vue";  // 引入userRouter
import {useRoute, useRouter} from "vue-router"
const route = useRoute()
const router = useRouter()
const ruleForm = reactive({
  name: '',
  identity:'',
  pic:'',
  path:'',
})
onMounted(() => {
  axios.post('/information',{mailbox:route.params.id}).then(res=>{
    if(res.status===200) {
      ruleForm.name = res.data.rows.name
      ruleForm.identity = res.data.rows.identity
      ruleForm.pic = res.data.rows.pic
      if(ruleForm.pic=='')
        ruleForm.pic='https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
    }
  })
})
const open = () => {
  ElMessageBox.confirm(
      '是否登出平台？',
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
  )
      .then(() => {
        ElMessage({
          type: 'success',
          message: '登出成功',
        })
        router.push('/')
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '取消登出',
        })
      })
}
</script>

<style lang="less">
#aside {
  height:713px;
  overflow: hidden;
  border-right: 1px solid lightgrey;
  .homeT {
    margin: 30px 0 30px 10px;
    .homeTopic {
      font-size: 25px;
      color: cadetblue;
      margin-left: 10px;
      font-family:华文彩云;
    }
  }
  .el-menu {
    border: none;
  }
  .el-menu-item.is-active {
    color: cadetblue;
    border-right: 3px solid cadetblue;
  }
}
#header{
  border-bottom: 1px solid lightgrey;
  .headerRight{
    margin-right: 60px;
    float: right;
    padding-top: 10px;
    height: 60px;
    .headerImg{
      border: 3px solid cadetblue;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      overflow: hidden;
    }
    .headerName{
      margin-left: 50px;
      margin-top: -25px;
      color: cadetblue;
    }
  }
  .el-tooltip__trigger{
    outline: none;
  }
}
</style>