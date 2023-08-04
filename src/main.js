import {createApp} from 'vue'
import ElementPlus, {ElMessage} from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router/router.js'
import axios from "axios";
import Inquiry from "./pages/inquiry.vue"
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
const app = createApp(App)
axios.defaults.baseURL='http://localhost:8081'
app.use(ElementPlus)
app.use(router)
// 使用meta
router.beforeEach((to, from, next) => {
    if (to.meta.isAuth) {//判断是否需要鉴权
        axios.post('/home',{mailbox:to.params.id,token:localStorage.token}).then(res=>{
            if(res.data.data.username==to.params.id){
                if(to.meta.infor){
                    axios.post('/information',{mailbox:to.params.id}).then(res=>{
                        if(res.status===200) {
                            if(res.data.rows.name==''){
                                ElMessage({
                                    type: 'error',
                                    message: `请完成个人信息`,
                                })
                                next('/information/'+to.params.id)
                            }
                            else next()
                        }
                    })
                }
                else next()
            }
            else{
                ElMessage({
                    type: 'error',
                    message: `请登录`,
                })
                next('/')
            }
        })
    } else {
        // 如果不是，直接放行即可
        next()
    }
})
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
    app.component('Inquiry', Inquiry)
}
app.mount('#app')

