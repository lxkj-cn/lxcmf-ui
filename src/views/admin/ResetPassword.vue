<template>
    <div>
        <el-card class="top">
            <TopBack :name="pathName"></TopBack>
            <el-form :model="obj.editForm" ref="formRef" :rules="editFormRules" label-width="120px">
                <el-form-item label="新密码" prop="password" class="reduce-width">
                    <el-input text="password" show-password v-model="obj.editForm.password"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="confirm_password" class="reduce-width">
                    <el-input text="password" show-password v-model="obj.editForm.confirm_password"></el-input>
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
// 全局路由对象
const router = useRouter()
// 当前页面路由对象
const route = useRoute()
const editForm = {
    admin_id: 0,
    password: '',
    confirm_password: ''
}
const formRef = ref(null)
const editFormRules = {
    password: [
        { required: true, message: '请输入新的登录密码', trigger: 'blur' },
        { min: 6, max: 34, message: '登录密码长度在6~34位之间', trigger: 'blur' }
    ],
    confirm_password: [
        { required: true, message: '请输入新的登录密码', trigger: 'blur' },
        { min: 6, max: 34, message: '登录密码长度在6~34位之间', trigger: 'blur' }
    ]
}

const obj = reactive({ editForm })
const pathName = route.name
const resetForm = function () {
    obj.dialogShow = false
    formRef.value.resetFields()
}
const subEdit = () => {
    formRef.value.validate((valid) => {
        if (valid) {
            if (obj.editForm.password !== obj.editForm.confirm_password) {
                ElMessage.error('两次输入的密码不一致')
                return false
            }
            apis.adminApis.setAdminPassword({ password: obj.editForm.password }).then(res => {
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
    obj.editForm.admin_id = route.query.admin_id
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
