<template>
    <div>
        <BrNav :name="pathName"></BrNav>
        <el-card class="top">
            <TopBack :name="pathName"></TopBack>
            <el-form :model="obj.addForm" ref="formRef" :rules="addFormRules" label-width="160px">
                <el-form-item label="父级菜单" class="reduce-width">
                    <el-tree-select v-model="obj.addForm.parent_id" :data="obj.optionList" check-strictly />
                </el-form-item>

                <el-form-item label="栏目名称" prop="name_zh" class="reduce-width">
                    <el-input v-model="obj.addForm.name_zh"></el-input>
                </el-form-item>
                <el-form-item label="栏目名称（英文）" prop="name_en" class="reduce-width">
                    <el-input v-model="obj.addForm.name_en"></el-input>
                </el-form-item>
                <el-form-item label="备注" class="reduce-width">
                    <el-input type="textarea" v-model="obj.addForm.remarks"></el-input>
                </el-form-item>
                <el-form-item label="排序" prop="sort" class="reduce-width">
                    <el-input v-model="obj.addForm.sort"></el-input>
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
// 全局路由对象
const router = useRouter()
// 当前页面路由对象
const route = useRoute()
const pathName = route.name
const addForm = {
    parent_id: 0,
    name_zh: '',
    name_en: '',
    remarks: '',
    sort: 10,
    status: 1
}
const formRef = ref(null)
const dialogShow = false
const addFormRules = {

    name_zh: [
        { required: true, message: '请输入菜单中文名称', trigger: 'blur' },
        { min: 2, max: 34, message: '菜单中文名称长度在2~34位之间', trigger: 'blur' }
    ],
    name_en: [
        { required: true, message: '请输入菜单英文名称', trigger: 'blur' },
        { min: 2, max: 34, message: '邮箱长度在2~34位之间', trigger: 'blur' }
    ]
}
onMounted(() => {
    getOptionsList()
})
const optionList = []
const obj = reactive({ addForm, dialogShow, optionList })

const resetForm = function () {
    obj.dialogShow = false
    formRef.value.resetFields()
    getOptionsList()
}
const getOptionsList = () => {
    apis.baseApis.getUseTree().then(res => {
        if (res.meta.code === 1) {
            obj.optionList = res.data
        }
    })
}
const subAdd = () => {
    formRef.value.validate((valid) => {
        if (valid) {
            apis.baseApis.saveDictionaryAdd(obj.addForm).then(res => {
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
    router.push('/dictionary/List')
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
