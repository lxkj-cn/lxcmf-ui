<template>
    <div class="login">
        <el-carousel indicator-position="none" :interval="10000" height="100vh" arrow="never">
            <el-carousel-item v-for="(item, index) in obj.bgList" :key="index">
                <template v-if="obj.isBg">
                    <el-image class="login-bg" :src="imgUrl + item.img_url_text" fit="scale-down" />
                </template>
                <template v-else>
                    <el-image class="login-bg" :src="item.img_url" fit="scale-down" />
                </template>
            </el-carousel-item>
        </el-carousel>
        <vue-particles color="#ffffff" :particleOpacity="0.7" :particlesNumber="40" shapeType="circle" :particleSize="3"
            linesColor="#fff" :linesWidth="2" :lineLinked="true" :lineOpacity="0.6" :linesDistance="150" :moveSpeed="4"
            :hoverEffect="false" hoverMode="grab" :clickEffect="false" clickMode="push" class="lizi"></vue-particles>
        <div class="login-box">
            <div class="login-body">
                <el-image :src="obj.companyLogo" class="login-logo" fit="fill" />
                <div class="system-name">{{ obj.systemName }}</div>
                <el-form ref="loginFormRef" :model="loginForm" class="login-form" :rules="loginFormRules">
                    <el-form-item prop="login_account">
                        <el-input v-model="loginForm.login_account" autocomplete="off" placeholder="请输入登录账号"
                            size="large" :prefix-icon="accountIcon"></el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input v-model="loginForm.password" autocomplete="off" placeholder="请输入登录密码" show-password
                            size="large" :prefix-icon="passwordIcon"></el-input>
                    </el-form-item>
                </el-form>
                <div class="btns">
                    <el-button @click="resetLoginForm" size="large" :icon="resetIcon">重置</el-button>
                    <el-button type="primary" @click="subLogin" size="large" :icon="loginIcon">登录</el-button>
                </div>
                <div class="sustain">{{ obj.sustain }}</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { imgUrl } from '@/constant'
import { onMounted, reactive, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import apis from '@/request'
const companyLogo = ''
const systemName = ''
const sustain = ''
const accountIcon = 'Avatar'
const passwordIcon = 'Lock'
const resetIcon = 'Refresh'
const loginIcon = 'Promotion'
const store = useStore()
const router = useRouter()
const loginFormRef = ref(null)
const loginForm = reactive({
    login_account: 'admin_plus',
    password: '123456'
})
const isBg = false
const bgList = [
    { img_url: require('@/assets/img/login-bg3.jpg') },
    { img_url: require('@/assets/img/login-bg4.jpg') }, { img_url: require('@/assets/img/login-bg3.jpg') },
    { img_url: require('@/assets/img/login-bg4.jpg') }, { img_url: require('@/assets/img/login-bg3.jpg') },
    { img_url: require('@/assets/img/login-bg4.jpg') }, { img_url: require('@/assets/img/login-bg3.jpg') },
    { img_url: require('@/assets/img/login-bg4.jpg') }, { img_url: require('@/assets/img/login-bg3.jpg') },
    { img_url: require('@/assets/img/login-bg4.jpg') }
]
const obj = reactive({ companyLogo, systemName, sustain, bgList, isBg })
onMounted(() => {
    getBgLIst()
    getRouterList()
    getSystemLogo()
    getSystemName()
    getCompanyName()
})
const getBgLIst = function () {
    // 触发成功验证表单，调用接口；
    apis.baseApis.getLoginBg().then(res => {
        if (res.meta.code === 1) {
            obj.bgList = res.data.ad
            obj.isBg = true
        } else {
            ElMessage.error(res.meta.msg)
        }
    }).catch(error => {
        console.log('接口请求异常', error)
    })
}

const resetLoginForm = function () {
    loginFormRef.value.resetFields()
}
const loginFormRules = {
    login_account: [
        { required: true, message: '请输入登录账号', trigger: 'blur' },
        { min: 2, max: 20, message: '登录账号长度在2~20位之间', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入登录密码', trigger: 'blur' },
        { min: 6, max: 40, message: '登录密码长度在6~40位之间', trigger: 'blur' }
    ]
}
const subLogin = function () {
    loginFormRef.value.validate((valid) => {
        if (valid) {
            // 触发成功验证表单，调用接口；
            apis.baseApis.login(loginForm).then(res => {
                if (res.meta.code === 1) {
                    ElMessage.success(res.meta.msg)
                    store.dispatch('setToken', res.data)
                    router.push('/home')
                } else {
                    ElMessage.error(res.meta.msg)
                }
            }).catch(error => {
                console.log('接口请求异常', error)
            })
        } else {
            return false
        }
    })
}

const getRouterList = () => {
    apis.baseApis.getRouterMenu({}).then(res => {
        if (res.meta.code === 1) {
            sessionStorage.setItem('asynRouter', JSON.stringify(res.data.list))
            res.data.list.forEach(item => {
                router.addRoute('Home', {
                    path: '/' + item.path,
                    name: item.name_en,
                    component: () => import(/* webpackChunkName: "about" */ '@/views/' + item.path + '.vue')
                })
            })
        } else {
            ElMessage.error(res.meta.msg)
        }
    }).catch(error => {
        console.log('接口请求异常', error)
    })
}

const getSystemLogo = () => {
    apis.baseApis.getTagConfig({ name_en: 'system_logo' }).then(res => {
        if (res.meta.code === 1) {
            obj.companyLogo = res.data.value_url
        }
    }).catch(error => {
        console.log('接口请求异常', error)
    })
}
const getSystemName = () => {
    apis.baseApis.getTagConfig({ name_en: 'system_name' }).then(res => {
        if (res.meta.code === 1) {
            obj.systemName = res.data.value
        }
    }).catch(error => {
        console.log('接口请求异常', error)
    })
}
const getCompanyName = () => {
    apis.baseApis.getTagConfig({ name_en: 'company_name' }).then(res => {
        if (res.meta.code === 1) {
            obj.sustain = '技术支持：' + res.data.value
        }
    }).catch(error => {
        console.log('接口请求异常', error)
    })
}

</script>
<style lang="scss">
.login {
    position: relative;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
}

.el-carousel {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
}

.lizi {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 500;
}

.login-box {
    width: 360px;
    z-index: 1000;
    background-color: rgba(255, 255, 255, 0.4);
    position: absolute;
    top: 25%;
    left: 50%;
    border-radius: 15px;

    .login-body {
        width: 90%;
        margin: 0px auto;

        .system-name {
            font-size: 20px;
        }

        .login-logo {
            width: 300px;
            margin-top: 30px;
        }

        .system-name {
            margin-top: 10px;
        }

        .login-form {
            margin-top: 15px;

            .el-input {
                font-size: 22px;

                .el-input__inner {
                    padding-left: 50px;
                }
            }
        }

        .btns {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 15px;
        }

        .sustain {
            color: #444;
            font-size: 20px;
            text-align: right;
            margin-top: 5px;
            margin-bottom: 20px;
        }
    }
}
</style>
