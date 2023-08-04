<template>
  <div class="pass">
    <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        status-icon
        :rules="rules"
        label-width="120px"
        class="demo-ruleForm"
    >
      <el-form-item label="旧密码" prop="password">
        <el-input v-model="ruleForm.password" type="password" autocomplete="off" />
      </el-form-item>
      <el-form-item label="新密码" prop="pass">
        <el-input v-model="ruleForm.pass" type="password" autocomplete="off"/>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input v-model="ruleForm.checkPass" type="password" autocomplete="off" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(ruleFormRef)">提交</el-button>
        <el-button @click="resetForm(ruleFormRef)" style="margin-left: 221px;">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import {onUpdated, reactive, ref} from 'vue'
import type { FormInstance } from 'element-plus'
import axios from 'axios';
import {ElMessage} from "element-plus";
import {useRoute, useRouter} from "vue-router"  // 引入userRouter
const ruleFormRef = ref<FormInstance>()
const route = useRoute()
const router = useRouter()
const checkAge = (rule: any, value: any, callback: any) => {
  if (value === '') callback(new Error('请输入旧密码！'))
  else callback()
}
const validatePass = (rule: any, value: any, callback: any) => {
  if (value === '') callback(new Error('请输入新密码！'))
  else {
    if (ruleForm.checkPass !== '') {
      if (!ruleFormRef.value) return
      ruleFormRef.value.validateField('checkPass', () => null)
    }
    callback()
  }
}
const validatePass2 = (rule: any, value: any, callback: any) => {
  if (value === '') callback(new Error('请确认新密码！'))
   else if (value !== ruleForm.pass) callback(new Error("输入密码与新密码不匹配！"))
   else callback()
}
const ruleForm = reactive({
  pass: '',
  checkPass: '',
  password: '',
  mailbox:route.params.id,
})
const rules = reactive({
  pass: [{ validator: validatePass, trigger: 'blur' }],
  checkPass: [{ validator: validatePass2, trigger: 'blur' }],
  password: [{ validator: checkAge, trigger: 'blur' }],
})
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      getUserList(ruleForm)
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
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
const getUserList=(ruleForm)=>{
  axios.post('/password',JSON.stringify(ruleForm)).then(res=>{
    if(res.status===204) {
      ElMessage({
        showClose: true,
        message: '旧密码错误',
        type: 'error',
      })
      window.location.reload()
    }
    if(res.status===200) {
        ElMessage({
          showClose: true,
          message: '修改密码成功',
          type: 'success',
        })
      router.push('/')
    }
  })
}
</script>

<style lang="less">
.pass{
  padding: 50px 800px 50px 10px;
}
</style>