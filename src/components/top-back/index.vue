<template>
    <div>
        <el-page-header @back="goBack" :content="obj.backName"></el-page-header>
    </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import apis from '@/request'
import { useRouter } from 'vue-router'
const router = useRouter()
const backName = ''
const obj = reactive({ backName })
const props = defineProps({
    name: String
})
onMounted(() => {
    if (props.name) {
        getBackName(props.name)
    }
})
const goBack = () => {
    router.back()
}
const getBackName = (nameEn) => {
    apis.powerApis.getOperateName({ name_en: nameEn }).then(res => {
        if (res.meta.code === 1) {
            obj.backName = res.data
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
