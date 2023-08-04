<template>
  <div>
    <iframe :src=form.file height="600px;" width="800px"></iframe>
    <div id="review">
      <el-button type="primary" @click="fh" style="float: right;">返回上一页</el-button>
      <el-form :model="form" label-width="120px" :rules="rules" ref="ruleFormRef">
      <el-form-item label="审稿意见" prop="region">
        <el-select v-model="form.region">
          <el-option label="拒稿" value="拒稿" />
          <el-option label="修改" value="修改" />
          <el-option label="录用" value="录用" />
        </el-select>
      </el-form-item>
<!--        <el-form-item label="稿件评分">-->
<!--            <div><div class="font">技术性</div>-->
<!--              <el-rate-->
<!--                  v-model="form.value"-->
<!--                  allow-half-->
<!--                  clearable-->
<!--                  :texts="['不及格', '及格', '中等', '良好', '优秀']"-->
<!--                  show-text-->
<!--              /></div>-->
<!--            <div><div class="font">逻辑性</div>-->
<!--              <el-rate-->
<!--                  v-model="form.value1"-->
<!--                  allow-half-->
<!--                  clearable-->
<!--                  :texts="['不及格', '及格', '中等', '良好', '优秀']"-->
<!--                  show-text-->
<!--              /></div>-->
<!--            <div><div class="font">创新性</div>-->
<!--              <el-rate-->
<!--                  v-model="form.value2"-->
<!--                  allow-half-->
<!--                  clearable-->
<!--                  :texts="['不及格', '及格', '中等', '良好', '优秀']"-->
<!--                  show-text-->
<!--              /></div>-->
<!--            <div><div class="font">实用性</div>-->
<!--              <el-rate-->
<!--                  v-model="form.value3"-->
<!--                  allow-half-->
<!--                  clearable-->
<!--                  :texts="['不及格', '及格', '中等', '良好', '优秀']"-->
<!--                  show-text-->
<!--              /></div>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="稿件建议" prop="desc">-->
<!--          <el-input v-model="form.desc" type="textarea" />-->
<!--        </el-form-item>-->
        <el-form-item label="审稿报告">
          <el-upload
              class="upload-demo"
              action="http://localhost:8081/review"
              :show-file-list="false"
              :data="form"
              :before-upload="beforeUpload"
              :on-success="onSuccess"
              accept=".pdf"
          >
            <el-button type="primary" @click="submitForm(ruleFormRef)">点击上传</el-button>
            <template #tip><div class="el-upload__tip">上传文件为PDF格式</div></template>
          </el-upload>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {onMounted, reactive, ref} from 'vue'
import {ElMessage, FormInstance, FormRules, UploadProps} from "element-plus";
import { useRoute,useRouter } from "vue-router"
import axios from "axios";
const route = useRoute()
const router = useRouter()
const ruleFormRef = ref<FormInstance>()
const form = reactive({
  region: '',
  manuscript:route.query.row,
  change:false,
  users:route.params.id,
  file:'',
})
const rules = reactive<FormRules>({
  region: [
    {required: true, message: '请选择审稿意见', trigger: 'change',},
  ],
  desc: [
    {required: true, message: '请完成稿件建议', trigger: 'change',},
  ],
})
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) form.change = false
  await formEl.validate((valid) => {
    form.change = valid;
  })
}
onMounted(() => {
  axios.post('/thesis0',{id:form.manuscript}).then(res=>{
    if(res.status===200) {
      form.file=res.data.data[0].file
    }
  })
})
const beforeUpload=()=>{
  if(form.change==false)
    ElMessage({
      showClose: true,
      message: '请完成内容',
      type: 'error',
    })
  return form.change
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
    router.go(-1)
  }
}
const fh=()=>{
 router.go(-1)
}
</script>

<style lang="less">
#review{
  float: right;
  .el-form {
    width: 469px;
  }
  .font{
    margin-right: 20px;
    float: left;
  }
}
</style>