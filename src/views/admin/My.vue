<template>
    <div>
        <el-card class="top">
            <TopBack :name="pathName"></TopBack>
            <el-form :model="obj.editForm" ref="formRef" :rules="editFormRules" label-width="120px">
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
                <el-form-item>
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
const editForm = {
    admin_id: 0,
    login_account: '',
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
const pathName = route.name
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
                    router.push('/home')
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
