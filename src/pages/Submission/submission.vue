<template>
  <div class="sub">
    <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-width="120px"
        class="demo-ruleForm"
        status-icon
    >
      <el-form-item label="论文标题" prop="name">
        <el-input v-model="ruleForm.name"/>
      </el-form-item>
      <el-form-item label="论文类型" prop="region">
        <el-select v-model="ruleForm.region">
          <el-option label="专家论坛" value="专家论坛" />
          <el-option label="基金项目论文" value="基金项目论文" />
          <el-option label="软件工程" value="软件工程" />
          <el-option label="设计研究与应用" value="设计研究与应用" />
          <el-option label="计算机应用" value="计算机应用" />
          <el-option label="计算机教育" value="计算机教育" />
          <el-option label="软件工程与技术" value="软件工程与技术" />
          <el-option label="网络与信息安全" value="网络与信息安全" />
          <el-option label="通信技术" value="通信技术" />
          <el-option label="数据库技术" value="数据库技术" />
        </el-select>
      </el-form-item>
      <el-form-item label="第一作者" prop="first">
        <el-input v-model="ruleForm.first"/>
      </el-form-item>
      <el-form-item label="第二作者" prop="second">
        <el-input v-model="ruleForm.second"/>
      </el-form-item>
      <el-form-item label="第三作者" prop="third">
        <el-input v-model="ruleForm.third" />
      </el-form-item>
      <el-form-item label="第四作者" prop="fourth">
        <el-input v-model="ruleForm.fourth" />
      </el-form-item>
      <el-form-item label="论文主编" prop="editmailbox">
        <el-select v-model="ruleForm.editmailbox">
          <el-option v-for="item in option" :key="item.mailbox" :label="item.name" :value="item.mailbox" />
        </el-select>
      </el-form-item>
      <el-form-item label="论文摘要" prop="desc">
        <el-input v-model="ruleForm.desc" type="textarea" />
      </el-form-item>
      <el-form-item>
        <el-upload
            class="upload-demo"
            action="http://localhost:8081/thesis"
            :data="ruleForm"
            :before-upload="beforeUpload"
            :on-success="onSuccess"
            :show-file-list="false"
                    accept=".pdf"
        >
          <el-button type="primary" @click="submitForm(ruleFormRef)" style="width: 100%;">提交</el-button>
          <template #tip><div class="el-upload__tip">上传文件为PDF格式</div></template>
        </el-upload>
        <el-button @click="resetForm(ruleFormRef)" style="width: 40%;margin-left: 100px;margin-top: -40px;">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import {onMounted, reactive, ref} from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import axios from "axios";
import {ElMessage, UploadProps} from "element-plus";
import { useRoute } from "vue-router"  // 引入userRouter
const route = useRoute()
const ruleFormRef = ref<FormInstance>()
const date = new Date();   //创建日期对象
const year = date.getFullYear();
const month = date.getMonth() + 1;
if(month<10)
  var months='0'+month
else
  months=''+month
const dates = date.getDate();
if(dates<10)
  var dat='0'+dates
else
   dat=''+dates
const data = year+'.'+months+'.'+dat
const ruleForm = reactive({
  name: '',
  region: '',
  first:'',
  second:'',
  third:'',
  fourth:'',
  editmailbox:'',
  desc: '',
  mailbox:route.params.id,
  data:data,
  change:false,
})
const option = reactive({
  name: '',
  mailbox:'',
})
const rules = reactive<FormRules>({
  name: [
    { required: true, message: '请输入论文题目', trigger: 'blur' },
    { min: 3, max: 40, message: '长度应该在3~40之间', trigger: 'blur' },
  ],
  region: [
    {required: true, message: '请选择论文类型', trigger: 'change',},
  ],
  first: [
    { required: true, message: '请输入第一作者', trigger: 'blur' },
    { min: 2, max: 5, message: '长度应该在2~5之间', trigger: 'blur' },
  ],
  second: [
    { required: true, message: '请输入第二作者', trigger: 'blur' },
    { min: 2, max: 5, message: '长度应该在2~5之间', trigger: 'blur' },
  ],
  third: [
    { required: true, message: '请输入第三作者', trigger: 'blur' },
    { min: 2, max: 5, message: '长度应该在2~5之间', trigger: 'blur' },
  ],
  fourth: [
    { required: true, message: '请输入第四作者', trigger: 'blur' },
    { min: 2, max: 5, message: '长度应该在2~5之间', trigger: 'blur' },
  ],
  editmailbox: [
    {required: true, message: '请选择论文主编', trigger: 'change',},
  ],
  desc: [
    { required: true, message: '请输入论文摘要', trigger: 'blur' },
  ],
})
onMounted(() => {
  axios.post('/editor').then(res=>{
    if(res.status===200) {
      for(let i=0;i<res.data.rows.length;i++){
        if(res.data.rows[i].mailbox!=ruleForm.mailbox){
          option[i]=res.data.rows[i]
        }
      }
    }
  })
})
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) ruleForm.change = false
  await formEl.validate((valid) => {
      ruleForm.change = valid;
  })
}
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
const beforeUpload=()=>{
  if(ruleForm.change==false)
    ElMessage({
      showClose: true,
      message: '请完成所有信息',
      type: 'error',
    })
return ruleForm.change
}
const onSuccess: UploadProps['onSuccess'] = (response) => {
  if(response.res!="提交成功") {
    ElMessage({
      showClose: true,
      message: '提交失败',
      type: 'error',
    })
    window.location.reload()
  }
  if(response.res=="提交成功") {
    ElMessage({
      showClose: true,
      message: '提交成功',
      type: 'success',
    })
    window.location.reload()
  }
}
</script>

<style lang="less">
.sub{
  padding: 10px 500px 0 200px;
  .el-upload {
    display: flex;
  }
}
</style>