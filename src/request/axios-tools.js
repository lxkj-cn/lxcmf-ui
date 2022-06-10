import axios from 'axios'
import store from '@/store'
import router from '@/router'
import { ElMessage } from 'element-plus'
import { apisUrl } from '@/constant'
axios.defaults.baseURL = apisUrl
axios.defaults.timeout = 10000
/* 设置axios拦截器 自动装填token */
axios.interceptors.request.use(config => {
    if (store.state.token) {
        config.headers.Authorization = store.state.token
    }

    return config
})
// 添加响应拦截器 范围code等于2 是token有问题 直接跳转登录页
axios.interceptors.response.use(function (response) {
    if (response.data.meta.code === -1) {
        ElMessage.error(response.data.meta.msg)
        router.push('/')
    }
    return response
}, function (error) {
    return error
})
const requestTool = {
    get: async (url, data) => {
        // 发起get请求
        const res = await axios.get(
            url,
            {
                params: data
            })
        return res.data
    },
    post: async (url, data) => {
        // 发起post请求
        const res = await axios.post(
            url,
            data)
        return res.data
    }
}
export default requestTool
