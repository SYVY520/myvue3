<template>
  <div class="rd">
    <div class="revie">
      <el-descriptions
          class="margin-top"
          :column="4"
          :size="size"
          border
          :title="ruleForm.name"
      >
        <template #extra>
          <el-button type="primary" @click="fh">返回上一页</el-button>
        </template>
        <el-descriptions-item label="类型" width="180px">{{ ruleForm.region }}</el-descriptions-item>
        <el-descriptions-item label="论文">
          <el-tag style="margin-left: 10px;"><a :href="ruleForm.file" target="_blank" style="text-decoration: none;">阅读论文</a></el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="国家">{{ ruleForm.country }}</el-descriptions-item>
        <el-descriptions-item label="机构">{{ ruleForm.institution }}</el-descriptions-item>
        <el-descriptions-item label="审批状态">{{ ruleForm.status }}</el-descriptions-item>
        <el-descriptions-item label="一审">{{ ruleForms.firstinstance }}
          <el-tag size="small" style="margin-left: 10px;" v-if="ruleForm.status=='未审'" @click="t1">添加审稿人</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="二审">{{ ruleForms.secondinstance1}} | {{ ruleForms.secondinstance2 }} | {{ ruleForms.secondinstance3 }}
          <el-tag size="small" style="margin-left: 10px;" v-if="ruleForms.secondinstance3.trim()=='' && ruleForm.status=='二审'" @click="t2">添加审稿人</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="三审">{{ ruleForms.thirdinstance }}
          <el-tag size="small" style="margin-left: 10px;" v-if="ruleForm.status=='三审' && ruleForms.secondinstance3.trim()!='' && ruleForms.thirdinstance.trim()==''" @click="t3">添加审稿人</el-tag>
        </el-descriptions-item>
      </el-descriptions>
    </div>
    <div id="rig">
      <div class="demo-input-size">
        <el-input
            v-model="input"
            class="w-50 m-2"
            placeholder="请输入搜索内容"
            :prefix-icon="Search"
            @input="ss"
        />
      </div>
      <div>
          <el-button type="primary" @click="open" style="margin-left: 310px;float: left;margin-top: -31px;">随机选择</el-button>
        <el-button type="primary" @click="xttj" style="margin-left: 10px;float: left;margin-top: -31px;">系统推荐</el-button>
        <el-button type="danger" :icon="Delete" @click="qx" style="margin-left: 10px;float: left;margin-top: -31px;" v-if="ruleForm.tj==true" />
      </div>
      <div id="inq">
        <el-table
            ref="tableRef"
            :data="ruleForm.dataList.slice((currentPage-1)*pageSize,currentPage*pageSize)"
            style="width: 100%;height:400px;"
            @sort-change="sort"
        >
          <el-table-column prop="id" label="个人ID" sortable width="100"/>
          <el-table-column prop="name" label="名字" width="100" />
          <el-table-column prop="country" label="国家" width="100" />
          <el-table-column prop="institution" label="机构" width="300" />
          <el-table-column prop="count" label="未审稿件数量" sortable width="180" />
          <el-table-column prop="counts" label="该类型稿件的审稿数量" sortable />
        </el-table>
      </div>
      <el-config-provider :locale="locale">
        <div class="demo-pagination-block">
          <el-pagination
              v-model:current-page="currentPage"
              v-model:page-size="pageSize"
              :small="small"
              :disabled="disabled"
              :background="background"
              layout="total,prev, pager, next, jumper"
              :total="ruleForm.dataList.length"
              @current-change="currentChange"
          />
        </div>
      </el-config-provider>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useRoute, useRouter} from "vue-router"
import axios from "axios";
import {computed, onMounted, reactive, ref} from 'vue'
import { Search ,Delete} from '@element-plus/icons-vue'
import type { TableInstance } from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import {ElMessage, ElMessageBox} from "element-plus";
const language = ref('zh-cn')
const locale = computed(() => (language.value === 'zh-cn' ? zhCn : null))
const input = ref('')
const currentPage = ref(1)
const pageSize = ref(9)
const small = ref(false)
const background = ref(false)
const disabled = ref(false)
const size = ref('default')
const route = useRoute()
const router = useRouter()
interface User {
  id:string
  name: string
  region:string
  country:string
  institution:string
  count:number
  counts:number
}
const tableRef = ref<TableInstance>()
const tableData: User[] =reactive(
    [
      {
        id:'',
        name:'',
        region:'',
        country:'',
        institution:'',
        count:0,
        counts:0,
      },
    ]
)
const ruleForm = reactive({
  id:route.query.row,
  name:'',
  status:'',
  region:'',
  file:'',
  dataList:[],
  dataList0:[],
  mailbox:'',
  institution:'',
  country:'',
  tj:false,
})
const ruleForms = reactive({
  firstinstance:'',
  secondinstance1:'',
  secondinstance2:'',
  secondinstance3:'',
  thirdinstance:'',
})
const fh = () => {
  router.go(-1)
}
const open = () => {
  const element = ruleForm.dataList[Math.floor((Math.random() * ruleForm.dataList.length))].id
  console.log(element)
  ElMessageBox.alert('随机选择审稿专家个人ID：'+element, {
    confirmButtonText: 'OK',
  })
}
onMounted(() => {
  axios.post('/thesis0',JSON.stringify(ruleForm)).then(res=>{
    if(res.status===200) {
      ruleForm.name=res.data.data[0].name
      ruleForm.status=res.data.data[0].status
      ruleForm.region=res.data.data[0].region
      ruleForm.file=res.data.data[0].file
      ruleForm.mailbox=res.data.data[0].mailbox
      axios.post('/information',JSON.stringify(ruleForm)).then(res=>{
        if(res.status===200) {
          console.log(res.data)
          ruleForm.country=res.data.rows.country
          ruleForm.institution=res.data.rows.institution
        }
      })
    }
  })
  axios.post('/th1',JSON.stringify(ruleForm)).then(res=>{
    if(res.status===200 && res.data.data!=null) {
      ruleForms.firstinstance=res.data.data[0].id
    }
  })
  axios.post('/th2',JSON.stringify(ruleForm)).then(res=>{
    if(res.status===200 && res.data.data!=null) {
      ruleForms.secondinstance1=res.data.data[0].id
      ruleForms.secondinstance2=res.data.data[1].id
      ruleForms.secondinstance3=res.data.data[2].id
    }
  })
  axios.post('/th3',JSON.stringify(ruleForm)).then(res=>{
    if(res.status===200 && res.data.data!=null) {
      ruleForms.thirdinstance=res.data.data[0].id
    }
  })
    axios.post('/inquirys',JSON.stringify(ruleForm)).then(res=>{
      if(res.status===200) {
        for(let i=0;i<res.data.rows.length;i++){
          tableData[i]=res.data.rows[i]
          ruleForm.dataList0[i] = res.data.rows[i]
          ruleForm.dataList[i] = res.data.rows[i]
        }
      }
    })
  axios.post('/sp',JSON.stringify(ruleForm)).then(res=>{
  })
})
const currentChange = (val)=> {
  this.currentPage = val
}
const filterTable = computed(() =>
    tableData.filter((data) =>
        !input.value
        || data.name.toLowerCase().includes(input.value.toLowerCase())
        || data.id.toLowerCase().includes(input.value.toLowerCase())
        || data.country.toLowerCase().includes(input.value.toLowerCase())
        || data.institution.toLowerCase().includes(input.value.toLowerCase())
    )
)
const ss = () => {
    ruleForm.dataList=filterTable.value.slice(0)
}
const sort = (column) => {
    if(input.value==""){
      if(column.order != null)
        ruleForm.dataList= ruleForm.dataList.sort(sortFun(column.prop, column.order))
      else
        ruleForm.dataList = ruleForm.dataList0.slice(0)
    }else
    {
      ruleForm.dataList=filterTable.value.slice(0)
      if(column.order != null)
        ruleForm.dataList= ruleForm.dataList.sort(sortFun(column.prop, column.order)).slice(0)
      else
        ruleForm.dataList = filterTable.value.slice(0)
    }
}
const sortFun = (attr, rev) => {
  if(rev === 'ascending') {
    rev = 1
  } else if (rev === 'descending') {
    rev = -1
  } else {
    rev = 0
  }
  return function (x, y) {
    let a = x[attr]
    let b = y[attr]
    if (!a) {
      a = ""
    }
    if (!b) {
      b = ""
    }
    if (a < b) {
      return rev * -1
    }
    if (a > b) {
      return rev * 1
    }
    return 0
  }
}
const jy = (value) =>{
  value = Number(value)
  if (value==0) {
    return '请输入审稿人个人ID'
  }
    if (isNaN(value)) {
      return '请填写数字'
    }
  else return true
}
const xttj = () =>{
 ruleForm.tj=true
  ruleForm.dataList= ruleForm.dataList.sort(sortFun('px','descending'))
  console.log(ruleForm.dataList)
}
const qx = () =>{
  ruleForm.tj=false
  ruleForm.dataList = ruleForm.dataList0.slice(0)
}
const t1 = () => {
  ElMessageBox.prompt('请输入一审审稿人个人ID', '添加一审审稿人', {
    confirmButtonText: '添加',
    cancelButtonText: '取消',
    inputValidator:jy,
  })
      .then(({ value }) => {
        axios.post('/tj',{id:value,manuscript:ruleForm.id,identity:'一审'}).then(res=>{
          if(res.status===200) {
            ElMessage({
              type: 'success',
              message: `加入成功`,
            })
            window.location.reload()
          }else{
            ElMessage({
              type: 'error',
              message: `加入失败`,
            })
            window.location.reload()
          }
        })
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '添加取消',
        })
      })
}
const t2 = () => {
  ElMessageBox.prompt('请输入二审审稿人个人ID', '添加二审审稿人', {
    confirmButtonText: '添加',
    cancelButtonText: '取消',
    inputValidator:jy,
  })
      .then(({ value }) => {
        if(value==ruleForms.firstinstance){
          ElMessage({
            type: 'error',
            message: `该审稿人已审过该稿件`,
          })
        }
       else if(value==ruleForms.secondinstance1 || value==ruleForms.secondinstance2){
          ElMessage({
            type: 'error',
            message: `审稿人重复选择`,
          })
        }
        else{
          axios.post('/tj',{id:value,manuscript:ruleForm.id,identity:'二审'}).then(res=>{
            if(res.status===200) {
              ElMessage({
                type: 'success',
                message: `加入成功`,
              })
              window.location.reload()
            }else{
              ElMessage({
                type: 'error',
                message: `加入失败`,
              })
              window.location.reload()
            }
          })
        }
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '添加取消',
        })
      })
}
const t3 = () => {
  ElMessageBox.prompt('请输入三审审稿人个人ID', '添加三审审稿人', {
    confirmButtonText: '添加',
    cancelButtonText: '取消',
    inputValidator:jy,
  })
      .then(({ value }) => {
        if(value==ruleForms.firstinstance || value==ruleForms.secondinstance1 || value==ruleForms.secondinstance2 || value==ruleForms.secondinstance3){
          ElMessage({
            type: 'error',
            message: `该审稿人已审过该稿件`,
          })
        }
        else{
          axios.post('/tj',{id:value,manuscript:ruleForm.id,identity:'三审'}).then(res=>{
            if(res.status===200) {
              ElMessage({
                type: 'success',
                message: `加入成功`,
              })
              window.location.reload()
            }else{
              ElMessage({
                type: 'error',
                message: `加入失败`,
              })
              window.location.reload()
            }
          })
        }
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '添加取消',
        })
      })
}
</script>

<style lang="less">
.rd{
  .revie{
    width: 100%;
  }
  .demo-input-size{
    width: 300px;
  }
  #rig{
    margin-top: 7px;
  }
  #inq{
    width: 100%;
    height: 399px;
    border: 1px solid lightgrey;
    margin-top: 7px;
  }
}
</style>