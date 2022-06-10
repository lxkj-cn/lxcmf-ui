<template>
    <div>
        <el-breadcrumb :separator-icon="`DArrowRight`">
            <el-breadcrumb-item>首页</el-breadcrumb-item>
            <el-breadcrumb-item>控制台</el-breadcrumb-item>
        </el-breadcrumb>
        <el-row :gutter="10" class="top">
            <el-col :span="6">
                <el-card class="box-card user">
                    <component :is="userIcon" class="menu-icon" />
                    <div>总浏览：95</div>
                </el-card>
            </el-col>

            <el-col :span="6">
                <el-card class="box-card art">
                    <component :is="menuIcon" class="menu-icon" />
                    <div>今日新增：95</div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card class="box-card user">
                    <component :is="userIcon" class="menu-icon" />
                    <div>昨日新增：95</div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card class="box-card art">
                    <component :is="menuIcon" class="menu-icon" />
                    <div>文章数：95</div>
                </el-card>
            </el-col>
        </el-row>
        <el-row :gutter="10" class="main-box">
            <el-col :span="24">
                <el-card id="main-line"></el-card>
            </el-col>
        </el-row>
        <el-row :gutter="10" class="main-box">
            <el-col :span="24">
                <el-card>
                    <el-row>
                        <el-col :span="24">
                            <el-descriptions title="管理员信息" :column="2" border>
                                <el-descriptions-item label="头像" :span="2">
                                    <el-image :src="imgUrl + obj.adminInfo.head_img_url"
                                        :preview-src-list="[imgUrl + obj.adminInfo.head_img_url]" class="avatar"
                                        fit="fill" v-if="obj.adminInfo.head_img_url" />
                                    <el-image :src="defaultAvatar" class="avatar" fit="fill" v-else />
                                </el-descriptions-item>
                                <el-descriptions-item label="姓名" :span="2">{{ obj.adminInfo.name }}
                                </el-descriptions-item>
                                <el-descriptions-item label="电话">{{ obj.adminInfo.tel }}</el-descriptions-item>
                                <el-descriptions-item label="邮箱">{{ obj.adminInfo.email }}
                                </el-descriptions-item>

                                <el-descriptions-item label="上次登录ip">{{ obj.adminInfo.last_ip }}
                                </el-descriptions-item>
                                <el-descriptions-item label="上次登录时间">{{ obj.adminInfo.last_time }}
                                </el-descriptions-item>
                            </el-descriptions>
                        </el-col>
                    </el-row>
                </el-card>
            </el-col>
        </el-row>
        <el-row :gutter="10" class="main-box">
            <el-col :span="24">

                <el-card>
                    <el-row>
                        <el-col :span="24">
                            <el-descriptions title="系统信息" border>
                                <el-descriptions-item :label="index" v-for="(item, index) in obj.syatemInfo"
                                    :key="index">{{
                                            item
                                    }}</el-descriptions-item>
                            </el-descriptions>
                        </el-col>
                    </el-row>

                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'
import apis from '@/request'
import { imgUrl } from '@/constant'
const menuIcon = 'setting'
const userIcon = 'avatar'
onMounted(() => { // 需要获取到element,所以是onMounted的Hook
    const chartData = {
        title: { text: '数据统计' },
        tooltip: {},
        legend: {
            // Try 'horizontal'
            icon: 'rect'
        },
        xAxis: {
            boundaryGap: false,
            data: ['12-3', '12-4', '12-5', '12-6', '12-7', '12-8', '12-8', '12-9', '12-10', '12-11', '12-12', '12-13', '12-14', '12-15']
        },
        yAxis: {},
        series: [
            {
                name: '访问量',
                type: 'line',
                smooth: true,
                data: [5, 20, 36, 10, 10, 20, 70, 10, 90, 60, 80, 40, 90, 50]
            },
            {
                name: '留言数',
                type: 'line',
                smooth: true,
                data: [2, 25, 17, 98, 15, 2, 52, 73, 94, 75, 67, 88, 51, 99]
            }
        ]
    }
    const myChart = echarts.init(document.getElementById('main-line'))
    // 绘制图表
    myChart.setOption(chartData)
    getSystem()
    getInfo()
    getOperateAll()
})
const syatemInfo = {}
const adminInfo = {}
const defaultAvatar = require('@/assets/img/def-header.jpeg')
const obj = reactive({
    syatemInfo, adminInfo
})
const getSystem = () => {
    apis.baseApis.getSystemInfo().then(res => {
        if (res.meta.code === 1) {
            obj.syatemInfo = res.data
        } else {
            ElMessage.error(res.meta.msg)
        }
    }).catch(error => {
        console.log('接口请求异常', error)
    })
}
const getOperateAll = () => {
    apis.powerApis.getAll().then(res => {
        if (res.meta.code === 1) {
            res.data.forEach(item => {
                getButtonInfo(item.name_en)
            })
        }
    }).catch(error => {
        console.log(error)
    })
}
const getButtonInfo = (nameEn) => {
    var cacheinfo = sessionStorage.getItem(nameEn)
    if (!cacheinfo) {
        apis.powerApis.getPowerButton({ name_en: nameEn }).then(res => {
            sessionStorage.setItem(nameEn, JSON.stringify(res))
        }).catch(error => {
            console.log(error)
        })
    }
}
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
</script>

<style lang="scss" scoped>
.main-box {
    margin-top: 10px;
}

.user {
    color: #409eff;
}

.art {
    color: #985684;
}

#main-line {
    height: 500px;
    padding: 30px;
}

.menu-icon {
    width: 50px;
    height: 50px;
}

.top {
    margin-top: 20px;
}

.avatar {
    height: 80px;
    width: 80px;
}
</style>
