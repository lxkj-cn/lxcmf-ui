<template>
    <div>
        <el-breadcrumb :separator-icon="`DArrowRight`">
            <el-breadcrumb-item :to="{ path: '/main/dashboard' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/' + item.path }" v-for="(item, index) in obj.itemList" :key="index">
                {{ item.name_zh }}
            </el-breadcrumb-item>
        </el-breadcrumb>
    </div>
</template>
<!-- 面包屑导航组件 -->
<script setup>
import { onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import apis from '@/request'
const itemList = []
const obj = reactive({ itemList })
const props = defineProps({
    name: String
})
onMounted(() => {
    if (props.name) {
        getBrNavList(props.name)
    }
})
const getBrNavList = (nameEn) => {
    apis.powerApis.getBreadcrumbsNavigation({ name_en: nameEn }).then(res => {
        if (res.meta.code === 1) {
            obj.itemList = res.data
        } else {
            ElMessage.error(res.meta.msg)
        }
    }).catch(error => {
        console.log(error)
    })
}
</script>

<style lang="scss" scoped>
</style>
