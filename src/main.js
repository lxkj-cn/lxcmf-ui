import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 引入 ElementPlus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 引入element图标
import * as ElIconModules from '@element-plus/icons-vue'
// 引入 中文ui样式
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
// 引入粒子特效
import VueParticles from 'vue-particles'
import TopBack from '@/components/top-back'
import BrNav from '@/components/br-nav'
import ButtonPlus from '@/components/button-plus'
import uploadImg from '@/components/upload-img'
import apis from '@/request'
const app = createApp(App)
// 统一注册Icon图标
for (const iconName in ElIconModules) {
    if (Reflect.has(ElIconModules, iconName)) {
        const item = ElIconModules[iconName]
        app.component(iconName, item)
    }
}
const asynRouter = JSON.parse(sessionStorage.getItem('asynRouter'))
if (asynRouter !== null) {
    asynRouter.forEach(item => {
        router.addRoute('Home', {
            path: '/' + item.path,
            name: item.name_en,
            component: () => import(/* webpackChunkName: "about" */ '@/views/' + item.path)
        })
    })
}
app.component('TopBack', TopBack)
app.component('BrNav', BrNav)
app.component('ButtonPlus', ButtonPlus)
app.component('uploadImg', uploadImg)
app.use(store).use(router).use(VueParticles).use(ElementPlus, { locale: zhCn }).mount('#app')
