<template>
    <div>
        <BrNav :name="pathName"></BrNav>
        <el-tabs v-model="obj.activeName" class="demo-tabs" type="border-card" @tab-click="handleClick">
            <el-tab-pane :label="item.label" :name="item.value" v-for="(item, index) in obj.cateList" :key="index">
                <el-form :model="configList" label-width="220px">
                    <template v-for="(rows, indexs) in obj.configList" :key="indexs">
                        <el-form-item :label="rows.name_zh" align="left" v-if="rows.value_type == 1">
                            <el-tooltip :enterable="false" effect="dark" :content="rows.describe"
                                placement="bottom-end">
                                <el-input class="width70" v-model="rows.value"> </el-input>
                            </el-tooltip>
                            <el-tag class="ml-2" type="info">调用名称：{{ rows.name_en }}</el-tag>
                        </el-form-item>
                        <el-form-item :label="rows.name_zh" align="left" v-if="rows.value_type == 2">
                            <el-tooltip :enterable="false" effect="dark" :content="rows.describe"
                                placement="bottom-end">
                                <el-input type="textarea" class="width70" v-model="rows.value"> </el-input>
                            </el-tooltip>
                            <el-tag class="ml-2" type="info">调用名称：{{ rows.name_en }}</el-tag>
                        </el-form-item>
                        <el-form-item :label="rows.name_zh" v-if="rows.value_type == 3">
                            <uploadImg :ref="`uploadRef${index}`" :imgurl="rows.value_url"
                                @uploadSuccess="setHeadImg($event, indexs)">
                            </uploadImg>
                            <el-tag class="ml-2" type="info">调用名称：{{ rows.name_en }}</el-tag>
                        </el-form-item>

                    </template>
                    <el-form-item align="left">
                        <el-button type="primary" @click="subConfig">
                            保存
                        </el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script setup>
import { reactive, onMounted, ref, getCurrentInstance } from 'vue'
import uploadImg from '@/components/upload-img'
import { ElMessage } from 'element-plus'
import apis from '@/request'

import { useRoute } from 'vue-router'
// 当前页面路由对象
const route = useRoute()
const pathName = route.name
const ctx = getCurrentInstance()
const activeName = ''
const cateList = []
const configList = []
const uploadRef = ref(null)
const obj = reactive({ cateList, activeName, configList })
onMounted(() => {
    getCateList()
})
const handleClick = (tab, event) => {
    obj.activeName = tab.paneName
    getConfigList()
}
const getCateList = () => {
    apis.baseApis.getTagDictionary({ name_en: 'config_category' }).then(res => {
        if (res.meta.code === 1) {
            obj.cateList = res.data
            if (!obj.activeName) {
                obj.activeName = res.data[0].value
                getConfigList()
            } else {
                ElMessage.error(res.meta.msg)
            }
        }
    }).catch(error => {
        console.log(error)
    })
}
const subConfig = () => {
    apis.baseApis.saveCategoryConfig({ list: obj.configList }).then(res => {
        if (res.meta.code === 1) {
            getConfigList()
            ElMessage.success(res.meta.msg)
        } else {
            ElMessage.error(res.meta.msg)
        }
    }).catch(error => {
        console.log(error)
    })
}
const setHeadImg = (emit, index) => {
    obj.configList[index].value = emit.code
}
const getConfigList = () => {
    apis.baseApis.getCategoryConfig({ category: obj.activeName }).then(res => {
        if (res.meta.code === 1) {
            obj.configList = res.data
        }
    }).catch(error => {
        console.log(error)
    })
}

</script>

<style lang="scss" scoped>
.demo-tabs {
    margin-top: 20px;
}

.width70 {
    width: 70%;
}

.el-tag {
    margin-left: 10px;
}
</style>
