<template>
    <div>
        <BrNav :name="pathName"></BrNav>
        <el-card class="top">
            <TopBack :name="pathName"></TopBack>
            <el-form :model="obj.editForm" ref="formRef" :rules="editFormRules" label-width="120px">
                <el-form-item label="友情链接名称" prop="name" class="reduce-width">
                    <el-input v-model="obj.editForm.name"></el-input>
                </el-form-item>
                <el-form-item label="友情链接地址" prop="url" class="reduce-width">
                    <el-input v-model="obj.editForm.url"></el-input>
                </el-form-item>
                <el-form-item label="logo">
                    <uploadImg ref="uploadRef" @uploadSuccess="setImgUrl"></uploadImg>
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
import { ElMessage } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'
import apis from '@/request'
import { imgUrl } from '@/constant'
const router = useRouter()
// 当前页面路由对象
const route = useRoute()
const pathName = route.name
const editForm = {
    name: '',
    url: '',
    logo_url: '',
    sort: 10,
    status: 1
}
const formRef = ref(null)
const uploadRef = ref(null)
const editFormRules = {
    name: [
        { required: true, message: '请输入友情链接名称', trigger: 'blur' },
        { min: 2, max: 20, message: '友情链接名称长度在2~20位之间', trigger: 'blur' }
    ],
    url: [
        { required: true, message: '请输入友情链接地址', trigger: 'blur' },
        { min: 2, max: 34, message: '友情链接地址长度在2~34位之间', trigger: 'blur' }
    ]
}
const obj = reactive({ editForm })
onMounted(() => {
    getRow()
})
const getRow = () => {
    apis.contentApis.getLinksRow({ links_id: route.query.links_id }).then(res => {
        if (res.meta.code === 1) {
            obj.editForm.name = res.data.name
            obj.editForm.url = res.data.url
            obj.editForm.logo_url = res.data.logo_url
            obj.editForm.remarks = res.data.remarks
            obj.editForm.sort = res.data.sort
            obj.editForm.status = res.data.status
            obj.editForm.links_id = res.data.links_id
            if (res.data.logo_url_text) {
                uploadRef.value.setImgUrl(imgUrl + res.data.logo_url_text)
            }
        } else {
            ElMessage.error(res.meta.msg)
        }
    }).catch(error => {
        console.log(error)
    })
}
const resetForm = function () {
    obj.dialogShow = false
    formRef.value.resetFields()
    uploadRef.value.resetUp()
}
const setImgUrl = (res) => {
    obj.editForm.logo_url = res.code
}
const subEdit = () => {
    formRef.value.validate((valid) => {
        if (valid) {
            apis.contentApis.saveLinksEdit(obj.editForm).then(res => {
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
    router.push('/links/List')
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
