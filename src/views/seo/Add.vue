<template>
    <div>
        <BrNav :name="pathName"></BrNav>
        <el-card class="top">
            <TopBack :name="pathName"></TopBack>
            <el-form :model="obj.addForm" ref="formRef" :rules="addFormRules" label-width="120px">
                <el-form-item label="seo目标类型" class="reduce-width">
                    <el-select v-model="obj.addForm.target_type" placeholder="请选择菜单类型" size="large">
                        <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="seo目标id" class="reduce-width">
                    <el-input v-model="obj.addForm.target_id"></el-input>
                </el-form-item>
                <el-form-item label="seo标题" prop="seo_title" class="reduce-width">
                    <el-input v-model="obj.addForm.seo_title"></el-input>
                </el-form-item>
                <el-form-item label="seo关键词" prop="seo_keywords" class="reduce-width">
                    <el-input v-model="obj.addForm.seo_keywords"></el-input>
                </el-form-item>
                <el-form-item label="seo描述" prop="seo_description" class="reduce-width">
                    <el-input type="textarea" v-model="obj.addForm.seo_description"></el-input>
                </el-form-item>

                <el-form-item label="状态" align="left">
                    <el-switch v-model="obj.addForm.status" :active-value="1" :inactive-value="0"></el-switch>
                </el-form-item>
                <el-form-item>
                    <el-button @click="resetForm">重置</el-button>
                    <el-button type="primary" @click="subAdd">保存</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-dialog v-model="obj.dialogShow" title="确认提示" width="20%">
            <span>数据添加成功</span>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="gotoList">返回列表</el-button>
                    <el-button type="primary" @click="resetForm">继续添加</el-button>
                </span>
            </template>
        </el-dialog>
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
const addForm = {
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
const dialogShow = false
const addFormRules = {
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
const obj = reactive({ addForm, dialogShow })

const resetForm = function () {
    obj.dialogShow = false
    formRef.value.resetFields()
    uploadRef.value.resetUp()
}
const subAdd = () => {
    formRef.value.validate((valid) => {
        if (valid) {
            apis.contentApis.saveSeoAdd(obj.addForm).then(res => {
                if (res.meta.code === 1) {
                    obj.dialogShow = true
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
    obj.dialogShow = false
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
