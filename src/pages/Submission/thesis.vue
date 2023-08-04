<template>
  <div id="thes">
    <el-descriptions
        class="margin-top"
        :column="2"
        :size="size"
        border
        :title="ruleForm.name"
    >
      <template #extra  v-if="ruleForm.identity=='contributors' && (ruleForms.firstinstance=='修改'|| ruleForms.secondinstance[0]=='修改' || ruleForms.secondinstance[1]=='修改' || ruleForms.secondinstance[2]=='修改' || ruleForms.thirdinstance=='修改')">
        <el-upload
            class="upload-demo"
            action="http://localhost:8081/cj"
            :data="ruleForm"
            :on-success="onSuccess"
            :show-file-list="false"
            accept=".pdf"
        >
          <el-button type="primary">重交稿件</el-button>
          <template #tip><div class="el-upload__tip">上传文件为PDF格式</div></template>
        </el-upload>
        <el-button type="primary" @click="fh" style="margin-left: 200px;margin-top: -100px;">返回上一页</el-button>
      </template>
      <template #extra v-else>
        <el-button type="primary" @click="fh">返回上一页</el-button>
      </template>
      <el-descriptions-item label="申请时间" width="300px">{{ ruleForm.data }}</el-descriptions-item>
      <el-descriptions-item label="类型">{{ ruleForm.region }}</el-descriptions-item>
      <el-descriptions-item label="第一作者">{{ ruleForm.first }}</el-descriptions-item>
      <el-descriptions-item label="第二作者">{{ ruleForm.second }}</el-descriptions-item>
      <el-descriptions-item label="第三作者">{{ ruleForm.third }}</el-descriptions-item>
      <el-descriptions-item label="第四作者">{{ ruleForm.fourth }}</el-descriptions-item>
      <el-descriptions-item label="机构">{{ ruleForm.institution }}</el-descriptions-item>
      <el-descriptions-item label="联系方式">{{ ruleForm.phone }}</el-descriptions-item>
      <el-descriptions-item label="主编">{{ ruleForm.edit }}</el-descriptions-item>
      <el-descriptions-item label="论文">
        <el-tag style="margin-left: 10px;"><a :href="ruleForm.file" target="_blank" style="text-decoration: none;">阅读论文</a></el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="审批状态">{{ ruleForm.status }}</el-descriptions-item>
      <el-descriptions-item label="一审">
        {{ ruleForms.firstinstance }}
        <el-tag size="small" style="margin-left: 10px;" v-if="ruleForms.firstreport!=''"><a :href="ruleForms.firstreport" target="_blank" style="text-decoration: none;">阅读审稿报告</a></el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="二审">
        {{ ruleForms.secondinstance[0]}}
        <el-tag size="small" style="margin-left: 10px;" v-if="ruleForms.secondreport[0]!=null && ruleForms.secondreport[0]!=''"><a :href="ruleForms.secondreport[0]" target="_blank" style="text-decoration: none;">阅读审稿报告</a></el-tag>
        {{ ruleForms.secondinstance[1]}}
        <el-tag size="small" style="margin-left: 10px;" v-if="ruleForms.secondreport[1]!=null && ruleForms.secondreport[1]!=''"><a :href="ruleForms.secondreport[1]" target="_blank" style="text-decoration: none;">阅读审稿报告</a></el-tag>
        {{ ruleForms.secondinstance[2]}}
        <el-tag size="small" style="margin-left: 10px;" v-if="ruleForms.secondreport[2]!=null && ruleForms.secondreport[2]!=''"><a :href="ruleForms.secondreport[2]" target="_blank" style="text-decoration: none;">阅读审稿报告</a></el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="三审">
        {{ ruleForms.thirdinstance }}
        <el-tag size="small" style="margin-left: 10px;" v-if="ruleForms.thirdreport!=''"><a :href="ruleForms.thirdreport" target="_blank" style="text-decoration: none;">阅读审稿报告</a></el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="摘要">
        {{ ruleForm.desc }}
      </el-descriptions-item>
    </el-descriptions>
  </div>
  <div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref} from 'vue'
import axios from "axios";
import {ElMessage, UploadProps} from "element-plus";
const size = ref('default')
import {useRoute, useRouter} from "vue-router"
const route = useRoute()
const router = useRouter()
const ruleForm = reactive({
  id:route.query.row,
  name:'',
  data:'',
  status:'',
  region:'',
  edit:'',
  first:'',
  second:'',
  third:'',
  fourth:'',
  desc: '',
  file:'',
  report:'',
  identity:'',
  mailbox:'',
  phone:'',
  institution:'',
})
const ruleForms = reactive({
  firstinstance:'',
  secondinstance:[],
  thirdinstance:'',
  firstreport:'',
  secondreport:[],
  thirdreport:'',
})
onMounted(() => {
  axios.post('/information',{mailbox:route.params.id}).then(res=>{
    if(res.status===200) {
      ruleForm.identity = res.data.rows.identity
    }
  })
  axios.post('/gx',JSON.stringify(ruleForm)).then(res=>{

  })
  axios.post('/thesis0',JSON.stringify(ruleForm)).then(res=>{
    if(res.status===200) {
      ruleForm.name=res.data.data[0].name
      ruleForm.data=res.data.data[0].data
      ruleForm.status=res.data.data[0].status
      ruleForm.region=res.data.data[0].region
      ruleForm.edit=res.data.data[0].edit
      ruleForm.first=res.data.data[0].first
      ruleForm.second=res.data.data[0].second
      ruleForm.third=res.data.data[0].third
      ruleForm.fourth=res.data.data[0].fourth
      ruleForm.desc=res.data.data[0].desc
      ruleForm.file=res.data.data[0].file
      ruleForm.report=res.data.data[0].report
      ruleForm.mailbox=res.data.data[0].mailbox
      axios.post('/information',JSON.stringify(ruleForm)).then(res=>{
        if(res.status===200) {
          console.log(res.data)
          ruleForm.phone=res.data.rows.phone
          ruleForm.institution=res.data.rows.institution
        }
      })
    }
  })
  axios.post('/thesis1',JSON.stringify(ruleForm)).then(res=>{
    if(res.status===200 && res.data.data!=null) {
      ruleForms.firstinstance=res.data.data[0].status
      ruleForms.firstreport=res.data.data[0].report
    }
  })
  axios.post('/thesis2',JSON.stringify(ruleForm)).then(res=>{
    if(res.status===200 && res.data.data!=null) {
      for(let i=0;i<res.data.data.length;i++){
        ruleForms.secondinstance[i]=res.data.data[i].status
        ruleForms.secondreport[i]=res.data.data[i].report
      }
    }
  })
  axios.post('/thesis3',JSON.stringify(ruleForm)).then(res=>{
    if(res.status===200 && res.data.data!=null) {
      ruleForms.thirdinstance=res.data.data[0].status
      ruleForms.thirdreport=res.data.data[0].report
    }
  })
})
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
const fh = () => {
  router.go(-1)
}
</script>

<style lang="less">
#thes{
  width: 1260px;
}
</style>
