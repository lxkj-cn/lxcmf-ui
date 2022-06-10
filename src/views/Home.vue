<template>
    <div>
        <el-container class="common-layout">
            <el-header>
                <el-row :gutter="20">
                    <el-col :span="4" class="company-logo">
                        <el-image :src="obj.companyLogo" class="logo" fit="fill" />
                    </el-col>
                    <el-col :span="16"></el-col>
                    <el-col :span="4" class="header-right">
                        <!-- <el-icon class="act-icon">
                            <bell-filled />
                        </el-icon> -->
                        <el-icon class="act-icon" @click="clean">
                            <refresh />
                        </el-icon>
                        <div class="admin-info">
                            <el-dropdown>
                                <span class="el-dropdown-link">
                                    <el-image :src="imgUrl + obj.adminInfo.head_img_url" class="avatar" fit="fill"
                                        v-if="obj.adminInfo.head_img_url" />
                                    <el-image :src="defaultAvatar" class="avatar" fit="fill" v-else />
                                    <el-icon class="more">
                                        <arrow-down />
                                    </el-icon>
                                </span>
                                <template #dropdown>
                                    <el-dropdown-menu>
                                        <el-dropdown-item @click="gotoMy()">个人中心</el-dropdown-item>
                                        <el-dropdown-item @click="gotoResetPasswd()">修改密码</el-dropdown-item>
                                        <el-dropdown-item divided @click="logout">退出登录</el-dropdown-item>
                                    </el-dropdown-menu>
                                </template>
                            </el-dropdown>
                        </div>
                    </el-col>
                </el-row>
            </el-header>
            <el-container>
                <el-aside width="200px">
                    <el-menu active-text-color="#409eff" background-color="#304156" default-active="main/dashboard"
                        text-color="#fff" router unique-opened>
                        <el-menu-item index="/main/dashboard">
                            <template #title>
                                <component :is="menuIcon" class="menu-icon" size="10" />
                                <span>控制台</span>
                            </template>
                        </el-menu-item>
                        <div v-for="(item, index) in obj.leftMenu" :key="index">
                            <el-sub-menu :index="'/' + item.path" v-if="item.children.length > 0">
                                <template #title>
                                    <component :is="item.icon" class="menu-icon" size="10" v-if="item.icon" />
                                    <el-tooltip :enterable="false" effect="dark" :content="item.describe"
                                        v-if="item.describe" placement="top">
                                        <span>{{ item.name_zh }}</span>
                                    </el-tooltip>
                                    <span v-else>{{ item.name_zh }}</span>
                                </template>
                                <div v-for="(son, key) in item.children" :key="key">
                                    <el-sub-menu :index="'/' + son.path" v-if="son.children.length > 0">
                                        <template #title>
                                            <component :is="son.icon" class="menu-icon" size="10" v-if="son.icon" />
                                            <el-tooltip :enterable="false" effect="dark" :content="son.describe"
                                                v-if="son.describe" placement="top">
                                                <span>{{ son.name_zh }}</span>
                                            </el-tooltip>
                                            <span v-else>{{ son.name_zh }}</span>
                                        </template>
                                        <div v-for="(grandson, keys) in son.children" :key="keys">
                                            <el-menu-item :index="'/' + grandson.path">
                                                <template #title>
                                                    <component :is="grandson.icon" class="menu-icon" size="10"
                                                        v-if="grandson.icon" />
                                                    <el-tooltip :enterable="false" effect="dark"
                                                        :content="grandson.describe" v-if="son.describe"
                                                        placement="top">
                                                        <span>{{ grandson.name_zh }}</span>
                                                    </el-tooltip>
                                                    <span v-else>{{ grandson.name_zh }}</span>
                                                </template>
                                            </el-menu-item>
                                        </div>
                                    </el-sub-menu>
                                    <el-menu-item :index="'/' + son.path" v-else>
                                        <template #title>
                                            <component :is="son.icon" class="menu-icon" size="10" v-if="son.icon" />
                                            <el-tooltip :enterable="false" effect="dark" :content="son.describe"
                                                v-if="son.describe" placement="top">
                                                <span>{{ son.name_zh }}</span>
                                            </el-tooltip>
                                            <span v-else>{{ son.name_zh }}</span>
                                        </template>
                                    </el-menu-item>
                                </div>
                            </el-sub-menu>
                            <el-menu-item :index="'/' + item.path" v-else>
                                <template #title>
                                    <component :is="item.icon" class="menu-icon" size="10" v-if="item.icon" />
                                    <el-tooltip :enterable="false" effect="dark" :content="item.describe"
                                        v-if="item.describe" placement="top">
                                        <span>{{ item.name_zh }}</span>
                                    </el-tooltip>
                                    <span v-else>{{ item.name_zh }}</span>
                                </template>
                            </el-menu-item>
                        </div>
                    </el-menu>
                </el-aside>
                <el-main>
                    <router-view />
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script setup>
import apis from '@/request'
import { imgUrl } from '@/constant'
import { onMounted, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
const companyLogo = ''
const systemName = ''
const defaultAvatar = require('@/assets/img/def-header.jpeg')
const menuIcon = 'Stopwatch'
const router = useRouter()
const store = useStore()
onMounted(() => {
    getInfo()
    getLeftMenu()
    getSystemLogo()
    getSystemName()
})
const adminInfo = {}
const leftMenu = []
const obj = reactive({ adminInfo, leftMenu, companyLogo, systemName })
const getInfo = () => {
    apis.adminApis.getAdminInfo().then(res => {
        if (res.meta.code === 1) {
            obj.adminInfo = res.data
        } else {
            ElMessage.error(res.meta.msg)
        }
    }).catch(error => {
        console.log(error)
    })
}

const gotoMy = () => {
    router.push('/admin/My?admin_id=' + obj.adminInfo.admin_id)
}
const gotoResetPasswd = () => {
    router.push('/admin/ResetPassword?admin_id=' + obj.adminInfo.admin_id)
}
const logout = () => {
    apis.adminApis.logout().then(res => {
        if (res.meta.code === 1) {
            ElMessage.success(res.meta.msg)
            sessionStorage.clear()
            store.dispatch('setToken', '')
            router.push('/')
        } else {
            ElMessage.error(res.meta.msg)
        }
    }).catch(error => {
        console.log(error)
    })
}
const getLeftMenu = () => {
    apis.baseApis.getLeftMenu({ sort_field: 'sort', sort_type: 'descending' }).then(res => {
        if (res.meta.code === 1) {
            obj.leftMenu = res.data
        } else {
            ElMessage.error(res.meta.msg)
        }
    }).catch(error => {
        console.log('接口请求异常', error)
    })
}
const clean = () => {
    apis.baseApis.cleanCache({}).then(res => {
        if (res.meta.code === 1) {
            ElMessage.success(res.meta.msg)
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

</script>
<style lang="scss" scoped>
.menu-icon {
    width: 20px;
    height: 20px;
    margin-right: 10px;
}

.common-layout {
    height: 100vh;

    .company-logo {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-wrap: wrap;
        height: 60px;
        padding-left: 0px !important;

        .logo {
            height: 30px;
        }

        .system {
            color: #fff;
        }
    }

    .header-right {
        text-align: right;
        display: flex;
        justify-content: flex-end;
        flex-wrap: wrap;
        align-items: center;

        .admin-info {
            width: 80px;
            padding-right: 15px;
            margin-left: 10px;

            .avatar {
                width: 50px;
                border-radius: 4px;
            }

            .more {
                font-size: 24px;
                color: #fff;
                margin-left: 5px;
            }
        }

        .act-icon {
            font-size: 24px;
            color: #fff;
            margin: 0px 6px;
        }
    }
}

.el-header {
    background-color: #324d6a;
}

.el-menu {
    border-right: 1px solid;
}

.el-aside {
    background-color: #304156;
}
</style>
