<template>
    <div>
        <BrNav :name="pathName"></BrNav>
        <el-card class="top">
            <TopBack :name="pathName"></TopBack>
            <el-form :model="obj.editForm" ref="formRef" :rules="editFormRules" label-width="120px">
                <el-form-item label="seo目标类型" class="reduce-width">
                    <el-select v-model="obj.editForm.target_type" placeholder="请选择菜单类型" size="large">
                        <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="seo目标id" class="reduce-width">
                    <el-input v-model="obj.editForm.target_id"></el-input>
                </el-form-item>
                <el-form-item label="seo标题" prop="seo_title" class="reduce-width">
                    <el-input v-model="obj.editForm.seo_title"></el-input>
                </el-form-item>
                <el-form-item label="seo关键词" prop="seo_keywords" class="reduce-width">
                    <el-input v-model="obj.editForm.seo_keywords"></el-input>
                </el-form-item>
                <el-form-item label="seo描述" prop="seo_description" class="reduce-width">
                    <el-input type="textarea" v-model="obj.editForm.seo_description"></el-input>
                </el-form-item>

                <el-form-item label="状态" align="left">
                    <el-switch v-model="obj.editForm.status" :active-value="1" :inactive-value="0"></el-switch>
                </el-form-item>
                <el-form-item>
                    <el-button @click="resetForm">重置</el-button>
                    <el-button type="primary" @click="subAdd">保存</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'
import apis from '@/request'
import { add } from 'lodash'
const router = useRouter()
// 当前页面路由对象
const route = useRoute()
const pathName = route.name
const editForm = {
    target_type: '',
    target_id: '',
    seo_title: '',
    seo_description: '',
    seo_keywords: '',
    status: 1
}
const typeList = [
    { value: 1, label: '栏目' },
    { value: 2, label: '文章分类' },
    { value: 3, label: '文章' }
]
const formRef = ref(null)
const uploadRef = ref(null)
const editFormRules = {
    seo_title: [
        { required: true, message: '请输入seo标题', trigger: 'blur' },
        { min: 2, max: 20, message: 'seo标题长度在2~20位之间', trigger: 'blur' }
    ],
    seo_description: [
        { required: true, message: '请输入seo描述', trigger: 'blur' }
    ],
    seo_keywords: [
        { required: true, message: '请输入seo关键词', trigger: 'blur' }
    ]
}
const obj = reactive({ editForm })
onMounted(() => {
    getRow()
})
const getRow = () => {
    apis.contentApis.getSeoRow({ seo_id: route.query.seo_id }).then(res => {
        if (res.meta.code === 1) {
            obj.editForm.target_type = res.data.target_type
            obj.editForm.target_id = res.data.target_id
            obj.editForm.seo_title = res.data.seo_title
            obj.editForm.seo_description = res.data.seo_description
            obj.editForm.seo_keywords = res.data.seo_keywords
            obj.editForm.status = res.data.status
            obj.editForm.seo_id = res.data.seo_id
        } else {
            ElMessage.error(res.meta.msg)
        }
    }).catch(error => {
        console.log(error)
    })
}
const resetForm = function () {
    formRef.value.resetFields()
}
const subAdd = () => {
    formRef.value.validate((valid) => {
        if (valid) {
            apis.contentApis.saveSeoEdit(obj.editForm).then(res => {
                if (res.meta.code === 1) {
                    gotoList()
                } else {
                    ElMessage.error(res.meta.msg)
                }
            }).catch(error => {
                console.log(error)
            })
        } else {
            return false
        }
    })
}
const gotoList = () => {
    router.push('/seo/List')
}
</script>

<style lang="scss" scoped>
.top {
    margin-top: 20px;
}

.el-form {
    margin-top: 20px;
}

.reduce-width {
    width: 50%;
}
</style>
