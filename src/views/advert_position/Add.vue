<template>
    <div>
        <BrNav :name="pathName"></BrNav>
        <el-card class="top">
            <TopBack :name="pathName"></TopBack>
            <el-form :model="obj.addForm" ref="formRef" :rules="addFormRules" label-width="120px">
                <el-form-item label="广告类型名称" prop="name" class="reduce-width">
                    <el-input v-model="obj.addForm.name"></el-input>
                </el-form-item>
                <el-form-item label="广告类型标识" prop="tag" class="reduce-width">
                    <el-input v-model="obj.addForm.tag"></el-input>
                </el-form-item>
                <el-form-item label="广告图宽度" prop="width" class="reduce-width">
                    <el-input v-model="obj.addForm.width"></el-input>
                </el-form-item>
                <el-form-item label="广告图高度" prop="height" class="reduce-width">
                    <el-input v-model="obj.addForm.height"></el-input>
                </el-form-item>
                <el-form-item label="备注" class="reduce-width">
                    <el-input type="textarea" v-model="obj.addForm.remarks"></el-input>
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
const router = useRouter()
// 当前页面路由对象
const route = useRoute()
const pathName = route.name
const addForm = {
    name: '',
    tag: '',
    width: '',
    height: '',
    remarks: '',
    sort: 10,
    status: 1
}
const isNum = (rule, value, callback) => {
    const price = /^[0-9]*$/
    if (!price.test(value)) {
        callback(new Error('金额只能为数字'))
    } else {
        callback()
    }
}
const formRef = ref(null)
const dialogShow = false
const addFormRules = {
    name: [
        { required: true, message: '请输入广告类型名称', trigger: 'blur' },
        { min: 2, max: 20, message: '广告类型名称长度在2~20位之间', trigger: 'blur' }
    ],
    tag: [
        { required: true, message: '请输入广告类型标识', trigger: 'blur' },
        { min: 2, max: 20, message: '广告类型标识长度在2~20位之间', trigger: 'blur' }
    ],
    width: [
        { required: true, message: '请输入广告图宽度', trigger: 'blur' },
        { validator: isNum, message: '广告图宽度必须为数字', trigger: 'blur' }
    ],
    height: [
        { required: true, message: '请输入广告图高度', trigger: 'blur' },
        { validator: isNum, message: '广告图高度必须为数字', trigger: 'blur' }
    ]
}
const obj = reactive({ addForm, dialogShow })
const resetForm = function () {
    obj.dialogShow = false
    obj.addForm.remarks = ''
    formRef.value.resetFields()
}
const subAdd = () => {
    formRef.value.validate((valid) => {
        if (valid) {
            apis.contentApis.saveAdTypeAdd(obj.addForm).then(res => {
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
    router.push('/advert_position/List')
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
