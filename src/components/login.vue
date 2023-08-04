<template>
  <div id="loginBox">
    <div id="loginImg">
      <span id="loginTopic">软件杂志社</span>
      <span id="loginH">__</span>
      <img src="src/assets/hb.png" style="width: 230px;height: 210px;margin: 50px 0 0 10px;">
    </div>
    <div id="login">
      <span id="loginD"><slot name="loginD">登录</slot></span>
      <el-form
          ref="ruleFormRef"
          :model="ruleForm"
          status-icon
          :rules="rules"
          label-width="120px"
          class="demo-ruleForm"
      >
        <el-form-item  prop="mailbox">
          <el-input v-model="ruleForm.mailbox"  autocomplete="off" placeholder="请输入邮箱" autofocus/>
        </el-form-item>
        <el-form-item  prop="password">
          <el-input v-model="ruleForm.password"
                    type="password"
                    autocomplete="off"
                    placeholder="请输入密码"
                    show-password/>
        </el-form-item>
        <slot name="code">
          <el-form-item  prop="code">
            <el-input v-model="ruleForm.code" placeholder="请输入验证码" style="width: 60%;"/>
            <img :src="ruleForm.captchaUrl" @click="updateCaptcha" class="updateCaptcha">
          </el-form-item>
        </slot>
          <div id="rem" v-if="this.$route.path=='/'">
            <input type="checkbox" checked style="vertical-align: middle;">
            <span>记住我</span>
          </div>
        <el-form-item>
          <el-button type="primary" @click="submitForm(ruleFormRef)" style="width: 100%;"><slot name="login">登录</slot></el-button>
        </el-form-item>
      </el-form>
      <div>
<!--        <span id="forget"  v-if="this.$route.path=='/'"><a href="#" style="text-decoration: none;color: darkgray;">忘记密码？</a></span>-->
        <span id="zc"><slot name="zc"><a href="/enroll" style="text-decoration: none;color: darkcyan;">注册新账号</a></slot></span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import axios from 'axios'
import {onMounted ,reactive , ref} from 'vue'
import type {FormInstance} from 'element-plus'
import { ElMessage } from 'element-plus'
import { useRouter,useRoute } from "vue-router"  // 引入userRouter
const ruleFormRef = ref<FormInstance>()
const router = useRouter()
const route = useRoute()
interface Props {
  checkPass?: string,
}
const prop = defineProps<Props>()
const checkAge = (rule: any, value: any, callback: any) => {
  if (!value) {
    return callback(new Error('请输入验证码'))
  }else{
    callback()
  }
}
const validatePass = (rule: any, value: any, callback: any) => {
  if (value === '') {
      callback(new Error('请输入邮箱'))
  } else {
    callback()
  }
}
const validatePass2 = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入密码'))
  } else {
    callback()
  }
}
const checkPass = (rule: any, value: any, callback: any) => {
  if (prop.checkPass === '')  callback(new Error('请再次输入密码'))
  else if(prop.checkPass !== ruleForm.password)  callback(new Error("输入密码与密码不匹配！"))
  else  callback()
}
const ruleForm = reactive({
  mailbox: '',
  password: '',
  code: '',
  captchaUrl:'',
  captchaId:'',
})
onMounted(() => {
  axios.get('/get').then(res=>{
    ruleForm.captchaUrl=res.data.content
    ruleForm.captchaId=res.data.captchaId
  })
})
const rules = reactive({
  mailbox: [{ validator: validatePass, trigger: 'blur' },
    {
      pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/,
      message: '请输入正确的邮箱地址',
      trigger: 'blur',
    },
  ],
  password: [{ validator: validatePass2, trigger: 'blur' }],
  code: [{ validator: checkAge, trigger: 'blur' }],
  checkPass: [{ validator: checkPass, trigger: 'blur' }],
})
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      if(route.path=='/')
      getUserList(ruleForm)
      if(route.path=='/enroll')
        enroll(ruleForm)
    } else {
      ElMessage({
        showClose: true,
        message: '请完成所有信息',
        type: 'error',
      })
      return false
    }
  })
}
const getUserList=(ruleForm)=>{
  axios.post('/login',JSON.stringify(ruleForm)).then(res=>{
    if(res.status===204) {
      ElMessage({
        showClose: true,
        message: '密码错误或用户不存在',
        type: 'error',
      })
      window.location.reload()
    }
    if(res.status===200) {
      localStorage.setItem('token',res.data.data.token)
      axios.post('/verify',{id:ruleForm.captchaId}).then(res=>{
        if(res.data.data==false){
          ElMessage({
            showClose: true,
            message: '验证码错误',
            type: 'error',
          })
          window.location.reload()
        }
        if(res.data.data==true){
          updateCaptcha()
          ElMessage({
            showClose: true,
            message: '登陆成功',
            type: 'success',
          })
          router.push('/home/'+ruleForm.mailbox)
        }
      })
  }
})
}
const enroll=(ruleForm)=>{
  axios.post('/enroll',JSON.stringify(ruleForm)).then(res=>{
    if(res.status===200) {
      ElMessage({
        showClose: true,
        message: '注册成功',
        type: 'success',
      })
      router.push('/')
    }
    if(res.status===204) {
      ElMessage({
        showClose: true,
        message: '用户已存在',
        type: 'error',
      })
      window.location.reload()
    }
  })
}
const updateCaptcha=()=>{
  axios.get('/get').then(res=>{
    ruleForm.captchaUrl=res.data.content
    ruleForm.captchaId=res.data.captchaId
  })
}
</script>

<style lang="less">
#loginBox{
  height: 330px;
  width: 800px;
  margin: 200px auto 0;
  box-shadow: 6px 10px 20px  darkgray;
  border-radius: 10px;
  .el-form {
    margin-top: 20px;
    margin-left: -60px;
  }
  #loginImg{
    height: 330px;
    width: 360px;
    border-radius: 10px 0 0 10px;
    padding: 30px 0 0 0;
    float: left;
    background-image: url("../assets/bg.jpg");
    #loginTopic{
      margin-left: -25px;
      font-size: 25px;
      color:white;
    }
    #loginH{
      margin-left: 30px;
      margin-top: 25px;
      font-size: 25px;
      float: left;
      color:white;
    }
  }
  #login{
    height: 330px;
    width: 440px;
    float: right;
    border-radius:0 10px 10px 0;
    padding: 20px 80px 50px 0;
    #loginD{
      margin-left: 185px;
      font-size: 25px;
    }
    #rem{
      margin-left: 120px;
      margin-bottom: 10px;
      font-size: 13px;
      color: darkcyan;
    }
    #forget{
      float: left;
      font-size: 13px;
      margin-left: 60px;
    }
    #zc{
      float: right;
      font-size: 13px;
    }
    .updateCaptcha{
      width: 120px;
      height: 32px;
    }
  }
}
</style>