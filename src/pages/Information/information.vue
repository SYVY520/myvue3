<template>
  <div class="infor">
      <el-row class="demo-avatar demo-basic">
        <el-upload action="http://localhost:8081/upload" :show-file-list="false" :data="{mailbox:ruleForm.mailbox}" :on-success="onSuccess">
        <el-col :span="12">
          <div class="demo-basic--circle">
            <div class="block">
              <el-avatar shape="square" :size="150" :src="squareUrl" />
            </div>
          </div>
        </el-col>
        </el-upload>
      </el-row>
      <el-form
          ref="ruleFormRef"
          :model="ruleForm"
          :rules="rules"
          label-width="60px"
          class="demo-ruleForm"
          :size="formSize"
          status-icon
          :hide-required-asterisk=true
      >
        <el-form-item label="姓名" prop="name"><el-input v-model="ruleForm.name" /></el-form-item>
        <el-form-item label="邮箱"><el-input v-model="ruleForm.mailbox" type="email" disabled/></el-form-item>
        <el-form-item label="电话" prop="phone"><el-input v-model="ruleForm.phone" type="tel"/></el-form-item>
        <el-form-item label="国家" prop="country"><el-input v-model="ruleForm.country" /></el-form-item>
        <el-form-item label="机构" prop="institution"><el-input v-model="ruleForm.institution" /></el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm(ruleFormRef)" style="width: 100%;">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
</template>

<script lang="ts" setup>
import {onMounted, onUpdated, reactive, ref, toRefs} from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import axios from 'axios';
import {ElMessage} from "element-plus";
import { useRoute } from "vue-router"  // 引入userRouter
const formSize = ref('default')
const route = useRoute()
const ruleFormRef = ref<FormInstance>()
import type { UploadProps } from 'element-plus'
const ruleForm = reactive({
  name: '',
  mailbox:route.params.id,
  phone:'',
  country:'',
  institution:'',
})
onMounted(() => {
  axios.post('/information',JSON.stringify(ruleForm)).then(res=>{
    if(res.status===200) {
      ruleForm.name=res.data.rows.name
      ruleForm.phone=res.data.rows.phone
      ruleForm.country=res.data.rows.country
      ruleForm.institution=res.data.rows.institution
      state.squareUrl=res.data.rows.pic
      if(state.squareUrl=='')
        state.squareUrl='https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
    }
  })
})
const state = reactive({
  squareUrl: '',
})
const {squareUrl} = toRefs(state)
const rules = reactive<FormRules>({
  name: [
    { required: true, message: '请完成信息', trigger: 'blur' },
  ],
    phone: [
      { required: true, message: '请完成信息', trigger: 'blur' },
      {
        pattern: /^1[3,4,5,7,8,9][0-9]{9}$/,
        message: '请输入正确的手机号码',
        trigger: 'blur',
      },
    ],
  country: [
    { required: true, message: '请完成信息', trigger: 'blur' },
  ],
  institution: [
    { required: true, message: '请完成信息', trigger: 'blur' },
  ],
})
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      axios.post('/uploadUser',JSON.stringify(ruleForm)).then(res=>{
       if(res.status===200){
         ElMessage({
           type: 'success',
           message: '修改成功',
         })
         window.location.reload()
       }
      })
    } else {
      ElMessage({
        type: 'error',
        message: '修改失败',
      })
    }
  })
}
const onSuccess: UploadProps['onSuccess'] = () => {
  window.location.reload()
}
</script>


<style lang="less">
.infor{
  padding: 50px 750px 50px 25px;
  .demo-basic {
    text-align: center;
    float: left;
  }
  .demo-basic .demo-basic--circle{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .el-form-item--default {
    width: 290px;
    float: right;
  }
  .el-input.is-disabled .el-input__inner {
    color: black;
    -webkit-text-fill-color: black;
    cursor: default;
    background-color: white;
  }
  .el-input.is-disabled {
    cursor: default;
  }
  .el-input.is-disabled .el-input__wrapper {
    background-color: white;
  }
  .el-input__inner {
    color: black;
  }
}
</style>