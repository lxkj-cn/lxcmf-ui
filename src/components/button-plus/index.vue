<template>
    <el-tooltip :enterable="false" effect="dark" :content="obj.tooltipContent" placement="top" v-if="obj.buttonShow">
        <el-button :type="obj.buttonType" @click="buttonClick" :size="obj.buttonSize" :icon="obj.buttonInfo.icon">
        </el-button>
    </el-tooltip>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import apis from '@/request'
const emit = defineEmits(['clickSuccess'])
const router = useRouter()
const props = defineProps({
    name: String,
    type: String,
    size: String
})
const buttonType = ''
const buttonInfo = {}
const buttonShow = false
const tooltipContent = ''
const buttonSize = 'default'
const obj = reactive({ buttonType, buttonInfo, buttonShow, tooltipContent, buttonSize })
onMounted(() => {
    if (props.name) {
        getButtonInfo(props.name)
    }
    if (props.type) {
        obj.buttonType = props.type
    }
    if (props.size) {
        obj.buttonSize = props.size
    }
})
const buttonClick = () => {
    emit('clickSuccess')
}
const getButtonInfo = (nameEn) => {
    var cacheinfo = sessionStorage.getItem(nameEn)
    cacheinfo = JSON.parse(cacheinfo)
    if (cacheinfo && cacheinfo.meta) {
        if (cacheinfo.meta.code === 1) {
            setButton(cacheinfo.data)
        }
    } else {
        apis.powerApis.getPowerButton({ name_en: nameEn }).then(res => {
            sessionStorage.setItem(nameEn, JSON.stringify(res))
            if (res.meta.code === 1) {
                setButton(res.data)
            }
        }).catch(error => {
            console.log(error)
        })
    }
}
const setButton = (data) => {
    obj.buttonShow = true
    if (data.describe) {
        obj.tooltipContent = data.describe
    } else {
        obj.tooltipContent = data.name_zh
    }
    obj.buttonInfo = data
}
</script>

<style lang="scss" scoped>
</style>
