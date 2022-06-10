<template>
    <div>
        <BrNav :name="pathName"></BrNav>
        <el-card class="top">
            <TopBack :name="pathName"></TopBack>
            <el-form :model="obj.editForm" ref="formRef" :rules="editFormRules" label-width="120px">
                <el-form-item label="登录账号" prop="login_account" class="reduce-width">
                    <el-input v-model="obj.editForm.login_account"></el-input>
                </el-form-item>
                <el-form-item label="登录密码" prop="password" class="reduce-width">
                    <el-input type="password" v-model="obj.editForm.password" show-password></el-input>
                </el-form-item>
                <el-form-item label="头像">
                    <uploadImg ref="uploadRef" @uploadSuccess="setHeadImg"></uploadImg>
                </el-form-item>
                <el-form-item label="姓名" prop="name" class="reduce-width">
                    <el-input v-model="obj.editForm.name"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="tel" class="reduce-width">
                    <el-input v-model="obj.editForm.tel"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email" class="reduce-width">
                    <el-input v-model="obj.editForm.email"></el-input>
                </el-form-item>
                <el-form-item label="排序" prop="sort" class="reduce-width">
                    <el-input v-model="obj.editForm.sort"></el-input>
                </el-form-item>
                <el-form-item label="状态" align="left">
                    <el-switch v-model="obj.editForm.status" :active-value="1" :inactive-value="0"></el-switch>
                </el-form-item>
                <el-form-item>
                    <el-button @click="resetForm">重置</el-button>
                    <el-button type="primary" @click="subEdit">保存</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { imgUrl } from '@/constant'
import { ElMessage } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'
import apis from '@/request'
import validator from '@/components/validator'
import uploadImg from '@/components/upload-img'

// 全局路由对象
const router = useRouter()
// 当前页面路由对象
const route = useRoute()
const pathName = route.name
const editForm = {
    admin_id: 0,
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
const editFormRules = {
    login_account: [
        { required: true, message: '请输入登录账号', trigger: 'blur' },
        { min: 2, max: 20, message: '登录账号长度在2~20位之间', trigger: 'blur' }
    ],
    password: [
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
const obj = reactive({ editForm })
const resetForm = function () {
    obj.dialogShow = false
    formRef.value.resetFields()
    uploadRef.value.resetUp()
}
const setHeadImg = (res) => {
    obj.editForm.head_img = res.code
}
const getRow = () => {
    apis.adminApis.getAdminRow({ admin_id: route.query.admin_id }).then(res => {
        if (res.meta.code === 1) {
            obj.editForm.login_account = res.data.login_account
            obj.editForm.name = res.data.name
            obj.editForm.tel = res.data.tel
            obj.editForm.email = res.data.email
            obj.editForm.head_img = res.data.head_img
            obj.editForm.sort = res.data.sort
            obj.editForm.status = res.data.status
            obj.editForm.admin_id = res.data.admin_id
            if (res.data.head_img_url) {
                uploadRef.value.setImgUrl(imgUrl + res.data.head_img_url)
            }
        } else {
            ElMessage.error(res.meta.msg)
        }
    }).catch(error => {
        console.log(error)
    })
}
const subEdit = () => {
    formRef.value.validate((valid) => {
        if (valid) {
            apis.adminApis.saveAdminEdit(obj.editForm).then(res => {
                if (res.meta.code === 1) {
                    ElMessage.success(res.meta.msg)
                    router.push('/admin/List')
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
onMounted(() => {
    getRow()
})
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
