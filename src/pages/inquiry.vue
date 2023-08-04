<template>
  <div>
    <el-button type="success" round style="float: right;" v-if="route.query.index=='1-3'" @click="wgx">未更新</el-button>
    <el-button type="success" round style="float: right;margin-right: 10px;" v-if="route.query.index=='1-3'" @click="ygx">已更新</el-button>
    <el-button type="success" round style="float: right;" v-if="route.query.index=='4-1'" @click="yfp">已分配</el-button>
    <el-button type="success" round style="float: right;margin-right: 10px;" v-if="route.query.index=='4-1'" @click="wfp">未分配</el-button>
    <el-button type="success" round style="float: right;" v-if="route.query.index=='3-2'" @click="wxg">未修改</el-button>
    <el-button type="success" round style="float: right;margin-right: 10px;" v-if="route.query.index=='3-2'" @click="yxg">已修改</el-button>
    <el-button type="success" round style="float: right;" v-if="route.query.index=='4-3'" @click="open1">加入主编</el-button>
    <el-button type="success" round style="float: right;margin-right: 10px;" v-if="route.query.index=='4-3'" @click="open2">加入审稿人</el-button>
    <div class="demo-input-size" v-if="ruleForm.dataList.length!=0">
      <el-input
          v-model="input"
          class="w-50 m-2"
          placeholder="请输入搜索内容"
          :prefix-icon="Search"
          @input="ss"
      />
    </div>
    <div id="inquiry" v-if="ruleForm.dataList.length!=0">
      <el-table
          ref="tableRef"
          :row-key="rk"
          :data="ruleForm.dataList.slice((currentPage-1)*pageSize,currentPage*pageSize)"
          style="width: 100%;height:521px;"
          @sort-change="sort"
          @cell-dblclick="click"
      >
        <slot name="users">
          <el-table-column prop="uid" label="个人ID" sortable width="180"/>
          <el-table-column prop="uname" label="名字" width="180" />
          <el-table-column prop="country" label="国家" width="180" />
          <el-table-column prop="institution" label="机构"  />
          <el-table-column prop="identity" label="身份"  />
          <el-table-column fixed="right" label="移除账号" width="180">
            <template #default="index">
              <el-button
                  link
                  type="primary"
                  size="small"
                  @click.prevent="deleteRow(index.row.uid)"
              >
                移除
              </el-button>
            </template>
          </el-table-column>
        </slot>
        <slot name="manage">
        <el-table-column prop="id" label="稿件号" sortable width="90"/>
          <el-table-column prop="name" label="标题" width="400" />
        <el-table-column prop="region" label="类型" width="180" />
          <slot name="edit">
            <el-table-column prop="edit" label="主编" width="180" />
          </slot>
          <el-table-column prop="data" label="申请时间" sortable width="180" />
        </slot>
        <slot name="status">
          <el-table-column prop="status" label="审批状态"/>
        </slot>
        <slot name="nmregion">
          <el-table-column prop="nmregion" label="审批状态"/>
        </slot>
        <slot name="nmidentity">
          <el-table-column prop="nmidentity" label="审批身份"/>
        </slot>
        <slot name="right">
          <el-table-column fixed="right" label="审批意向" width="100">
            <template #default="index">
              <el-button
                  link
                  type="primary"
                  size="small"
                  @click.prevent="deleteRow0(index.row.id)"
              >
                拒绝
              </el-button>
            </template>
          </el-table-column>
        </slot>
      </el-table>
    </div>
    <el-config-provider :locale="locale">
      <div class="demo-pagination-block" v-if="ruleForm.dataList.length!=0">
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
  <el-empty :image-size="200" v-if="ruleForm.dataList.length==0" style="margin-top: 150px;" description="暂无数据"/>
</template>

<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import {computed, onMounted, reactive, ref} from 'vue'
import { Search } from '@element-plus/icons-vue'
import type { TableInstance } from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import axios from "axios";
import { useRoute,useRouter } from "vue-router"
const route = useRoute()
const router = useRouter()
const language = ref('zh-cn')
const locale = computed(() => (language.value === 'zh-cn' ? zhCn : null))
const input = ref('')
const currentPage = ref(1)
const pageSize = ref(12)
const small = ref(false)
const background = ref(false)
const disabled = ref(false)
interface User {
  id:string
  name: string
  data: string
  status: string
  region:string
  edit:string
  country:string
  institution:string
  uid:string
  uname:string
  identity:string
  nmregion:string
  nmidentity:string
}
const tableRef = ref<TableInstance>()
const tableData: User[] =reactive(
    [
      {
        id:'',
        name:'',
        data:'',
        status:'',
        region:'',
        edit:'',
        country:'',
        institution:'',
        uid:'',
        uname:'',
        identity:'',
        nmregion:'',
        nmidentity:'',
      },
    ]
)
onMounted(() => {
  if(route.query.index=="1-3"){
    if(route.query.status=='已更新'){
      axios.post('/inquiry',{mailbox:route.params.id}).then(res=>{
        if(res.status===200) {
          for(let i=0,j=0;i<res.data.rows.length;i++){
            if(res.data.rows[i].statu=='已更新'){
              tableData[j]=res.data.rows[i]
              ruleForm.dataList0[j] = res.data.rows[i]
              ruleForm.dataList[j] = res.data.rows[i]
              j++
            }
          }
        }
      })
    }else{
      axios.post('/inquiry',{mailbox:route.params.id}).then(res=>{
        if(res.status===200) {
          for(let i=0,j=0;i<res.data.rows.length;i++){
            if(res.data.rows[i].statu=='未更新'){
              tableData[j]=res.data.rows[i]
              ruleForm.dataList0[j] = res.data.rows[i]
              ruleForm.dataList[j] = res.data.rows[i]
              j++
            }
          }
        }
      })
    }
  }
  if(route.query.index=="4-1"){
    if(route.query.status=='未分配'){
      axios.post('/inquiry0',{editmailbox:route.params.id}).then(res=>{
        if(res.status===200) {
          for(let i=0,j=0;i<res.data.rows.length;i++){
            if(res.data.rows[i].count==0 || res.data.rows[i].count==2 || (res.data.rows[i].count==1 && res.data.rows[i].status=="二审")){
              tableData[j]=res.data.rows[i]
              ruleForm.dataList0[j] = res.data.rows[i]
              ruleForm.dataList[j] = res.data.rows[i]
              j++
            }
          }
        }
        console.log(ruleForm.dataList0)
      })
    }
    else{
      axios.post('/inquiry0',{editmailbox:route.params.id}).then(res=>{
        if(res.status===200) {
          for(let i=0,j=0;i<res.data.rows.length;i++){
            if(res.data.rows[i].count==1 || res.data.rows[i].count==3){
              tableData[j]=res.data.rows[i]
              ruleForm.dataList0[j] = res.data.rows[i]
              ruleForm.dataList[j] = res.data.rows[i]
              j++
            }
          }
        }
      })
    }
  }
  if(route.query.index=="4-2"){
    axios.post('/inquiry1',{editmailbox:route.params.id}).then(res=>{
      if(res.status===200) {
        for(let i=0;i<res.data.rows.length;i++){
          tableData[i]=res.data.rows[i]
          ruleForm.dataList0[i] = res.data.rows[i]
          ruleForm.dataList[i] = res.data.rows[i]
        }
      }
    })
  }
  if(route.query.index=="4-3"){
    axios.post('/inquiry2').then(res=>{
      if(res.status===200) {
        for(let i=0;i<res.data.rows.length;i++){
          tableData[i]=res.data.rows[i]
          ruleForm.dataList0[i] = res.data.rows[i]
          ruleForm.dataList[i] = res.data.rows[i]
          ruleForm.dataList0[i].uid = res.data.rows[i].id
          ruleForm.dataList[i].uname = res.data.rows[i].name
          ruleForm.dataList0[i].uname = res.data.rows[i].name
          ruleForm.dataList[i].uid = res.data.rows[i].id
          if(res.data.rows[i].identity=='contributors') {
            ruleForm.dataList0[i].identity = '作者'
            ruleForm.dataList[i].identity = '作者'
          }
            if(res.data.rows[i].identity=='editor'){
              ruleForm.dataList0[i].identity = '主编'
              ruleForm.dataList[i].identity = '主编'
            }
              if(res.data.rows[i].identity=='review'){
                ruleForm.dataList0[i].identity = '审稿人'
                ruleForm.dataList[i].identity = '审稿人'
              }
        }
      }
    })
  }
  if(route.query.index=="3-1"){
    axios.post('/inquiry4',{editmailbox:route.params.id}).then(res=>{
      if(res.status===200) {
        for(let i=0;i<res.data.rows.length;i++){
          tableData[i]=res.data.rows[i]
          ruleForm.dataList0[i] = res.data.rows[i]
          ruleForm.dataList[i] = res.data.rows[i]
        }
      }
    })
  }
  if(route.query.index=="3-2"){
    if(route.query.status=='已修改'){
      axios.post('/inquiry5',{editmailbox:route.params.id}).then(res=>{
        if(res.status===200) {
          for(let i=0,j=0;i<res.data.rows.length;i++){
            if(res.data.rows[i].statu=='已修改'){
              tableData[j]=res.data.rows[i]
              ruleForm.dataList0[j] = res.data.rows[i]
              ruleForm.dataList[j] = res.data.rows[i]
              j++
            }
          }
        }
      })
    }
    else{
      axios.post('/inquiry5',{editmailbox:route.params.id}).then(res=>{
        if(res.status===200) {
          for(let i=0,j=0;i<res.data.rows.length;i++){
            if(res.data.rows[i].statu!='已修改'){
              tableData[j]=res.data.rows[i]
              ruleForm.dataList0[j] = res.data.rows[i]
              ruleForm.dataList[j] = res.data.rows[i]
              j++
            }
          }
        }
      })
    }
  }
  if(route.query.index=="3-3"){
    axios.post('/inquiry3',{editmailbox:route.params.id}).then(res=>{
      if(res.status===200) {
        for(let i=0;i<res.data.rows.length;i++){
          tableData[i]=res.data.rows[i]
          ruleForm.dataList0[i] = res.data.rows[i]
          ruleForm.dataList[i] = res.data.rows[i]
        }
      }
    })
  }
})
//增加2个方法
const clearFilter = () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  tableRef.value!.clearFilter()
}
const currentChange = (val)=> {
  clearFilter()
  this.currentPage = val
}
const filterTableData = computed(() =>
    tableData.filter((data) =>
        !input.value
        || data.name.toLowerCase().includes(input.value.toLowerCase())
        || data.id.toLowerCase().includes(input.value.toLowerCase())
        || data.region.toLowerCase().includes(input.value.toLowerCase())
        || data.edit.toLowerCase().includes(input.value.toLowerCase())
        || data.status.toLowerCase().includes(input.value.toLowerCase())
    )
)
const filterTable = computed(() =>
    tableData.filter((data) =>
        !input.value
        || data.uname.toLowerCase().includes(input.value.toLowerCase())
        || data.uid.toLowerCase().includes(input.value.toLowerCase())
        || data.country.toLowerCase().includes(input.value.toLowerCase())
        || data.institution.toLowerCase().includes(input.value.toLowerCase())
        || data.identity.toLowerCase().includes(input.value.toLowerCase())
    )
)
const ss = () => {
  if(route.query.index=="4-3"){
    ruleForm.dataList=filterTable.value.slice(0)
  }else{
    ruleForm.dataList=filterTableData.value.slice(0)
  }
}
const ruleForm = reactive({
  dataList:[],
  dataList0:[],
})
const sort = (column) => {
  if(route.query.index=="4-3"){
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
  }else{
    if(input.value==""){
      if(column.order != null)
        ruleForm.dataList= ruleForm.dataList.sort(sortFun(column.prop, column.order))
      else
        ruleForm.dataList = ruleForm.dataList0.slice(0)
    }else
    {
      ruleForm.dataList=filterTableData.value.slice(0)
      if(column.order != null)
        ruleForm.dataList= ruleForm.dataList.sort(sortFun(column.prop, column.order)).slice(0)
      else
        ruleForm.dataList = filterTableData.value.slice(0)
    }
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
const rk = (row) => {
  return row.id
}
const click = (row) => {
  if(route.query.index=="1-3" || route.query.index=="4-2"){
    router.push({path:'/thesis/'+route.params.id,query:{row:row.id}})
  }
  if(route.query.index=="3-1" || route.query.index=="3-2"){
    router.push({path:'/review/'+route.params.id,query:{row:row.id}})
  }
  if(route.query.index=="4-1"){
    router.push({path:'/Reviewed0/'+route.params.id,query:{row:row.id}})
  }
}
const deleteRow = (index:number) => {
  ElMessageBox.confirm(
      '是否移除该账号?',
      {
        confirmButtonText: '移除',
        cancelButtonText: '取消',
        type: 'warning',
      }
  )
      .then(() => {
        axios.post('/Remove',{id:index}).then(res=>{
          if(res.status===200) {
            ElMessage({
              type: 'success',
              message: '移除成功',
            })
          }
          window.location.reload()
        })
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '移除取消',
        })
      })
}
const deleteRow0 = (index:number) => {
  ElMessageBox.confirm(
      '是否拒绝审批该稿件?',
      {
        confirmButtonText: '拒绝',
        cancelButtonText: '取消',
        type: 'warning',
      }
  )
      .then(() => {
        axios.post('/jj',{users:route.params.id,manuscript:index}).then(res=>{
          if(res.status===200) {
            ElMessage({
              type: 'success',
              message: '移除成功',
            })
            window.location.reload()
          }
        })
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '操作取消',
        })
      })
}
const open1 = () => {
  ElMessageBox.prompt('请输入账号邮箱', '加入主编', {
    confirmButtonText: '加入',
    cancelButtonText: '取消',
    inputPattern:
        /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
    inputErrorMessage: '请输入正确格式的邮箱',
  })
      .then(({ value }) => {
        axios.post('/uploadeditor',{mailbox:value}).then(res=>{
          if(res.status===200) {
            ElMessage({
              type: 'success',
              message: `加入成功`,
            })
            window.location.reload()
          }
        })
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '加入取消',
        })
      })
}
const open2 = () => {
  ElMessageBox.prompt('请输入账号邮箱', '加入审稿人', {
    confirmButtonText: '加入',
    cancelButtonText: '取消',
    inputPattern:
        /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
    inputErrorMessage: '请输入正确格式的邮箱',
  })
      .then(({ value }) => {
        axios.post('/uploadreview',{mailbox:value}).then(res=>{
          if(res.status===200) {
            ElMessage({
              type: 'success',
              message: `加入成功`,
            })
            window.location.reload()
          }
        })
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '加入取消',
        })
      })
}
const yfp = async () => {
 await router.push('/Unreviewed/'+route.params.id+'?index=4-1&status=已分配')
  await  window.location.reload()
}
const wfp = async () => {
await  router.push('/Unreviewed/'+route.params.id+'?index=4-1&status=未分配')
  await  window.location.reload()
}
const yxg = async () => {
  await router.push('/unreviewed2/'+route.params.id+'?index=3-2&status=已修改')
  await  window.location.reload()
}
const wxg = async () => {
  await  router.push('/unreviewed2/'+route.params.id+'?index=3-2&status=未修改')
  await  window.location.reload()
}
const ygx = async () => {
  await router.push('/manuscript/'+route.params.id+'?index=1-3&status=已更新')
  await  window.location.reload()
}
const wgx = async () => {
  await  router.push('/manuscript/'+route.params.id+'?index=1-3&status=未更新')
  await  window.location.reload()
}
</script>


<style lang="less">
.demo-input-size{
  width: 300px;
}
#inquiry{
  width: 100%;
  height: 521px;
  border: 1px solid lightgrey;
  margin-top: 10px;
}
.demo-pagination-block{
  margin-top: 15px;
  margin-bottom: -10px;
  margin-left: 30%;
}
</style>
