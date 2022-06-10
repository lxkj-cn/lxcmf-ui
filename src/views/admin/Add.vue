<template>
    <div>
        <BrNav :name="pathName"></BrNav>
        <el-card class="top">
            <TopBack :name="pathName"></TopBack>
            <el-form :model="obj.addForm" ref="formRef" :rules="addFormRules" label-width="120px">
                <el-form-item label="登录账号" prop="login_account" class="reduce-width">
                    <el-input v-model="obj.addForm.login_account"></el-input>
                </el-form-item>
                <el-form-item label="登录密码" prop="password" class="reduce-width">
                    <el-input type="password" v-model="obj.addForm.password" show-password></el-input>
                </el-form-item>
                <el-form-item label="头像">
                    <uploadImg ref="uploadRef" @uploadSuccess="setHeadImg"></uploadImg>
                </el-form-item>
                <el-form-item label="姓名" prop="name" class="reduce-width">
                    <el-input v-model="obj.addForm.name"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="tel" class="reduce-width">
                    <el-input v-model="obj.addForm.tel"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email" class="reduce-width">
                    <el-input v-model="obj.addForm.email"></el-input>
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
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'
import apis from '@/request'
import validator from '@/components/validator'

const router = useRouter()
// 当前页面路由对象
const route = useRoute()
const pathName = route.name
const addForm = {
    login_account: '',
    password: '',
    name: '',
    tel: '',
    email: '',
    head_img: '',
    sort: 10,
    status: 1
}
const formRef = ref(null)
const uploadRef = ref(null)
const dialogShow = false
const addFormRules = {
    login_account: [
        { required: true, message: '请输入登录账号', trigger: 'blur' },
        { min: 2, max: 20, message: '登录账号长度在2~20位之间', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入登录密码', trigger: 'blur' },
        { min: 6, max: 34, message: '登录密码长度在6~34位之间', trigger: 'blur' }
    ],
    name: [
        { required: true, message: '请输入管理员姓名', trigger: 'blur' },
        { min: 2, max: 34, message: '管理员姓名长度在2~34位之间', trigger: 'blur' }
    ],
    email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { min: 6, max: 34, message: '邮箱长度在6~34位之间', trigger: 'blur' },
        { validator: validator.checkEmail, trigger: 'blur' }
    ],
    tel: [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        { validator: validator.checkMobile, trigger: 'blur' }
    ]
}
const obj = reactive({ addForm, dialogShow })

const resetForm = function () {
    obj.dialogShow = false
    formRef.value.resetFields()
    uploadRef.value.resetUp()
}
const setHeadImg = (res) => {
    obj.addForm.head_img = res.code
}
const subAdd = () => {
    formRef.value.validate((valid) => {
        if (valid) {
            apis.adminApis.saveAdminAdd(obj.addForm).then(res => {
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
    router.push('/admin/List')
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
