<template>
    <div>
        <BrNav :name="pathName"></BrNav>
        <el-card class="top">
            <TopBack :name="pathName"></TopBack>
            <el-form :model="obj.editForm" ref="formRef" :rules="editFormRules" label-width="120px">
                <el-form-item label="公告标题" prop="title" class="reduce-width">
                    <el-input v-model="obj.editForm.title"></el-input>
                </el-form-item>
                <el-form-item label="公告内容" class="reduce-width">
                    <WangEditor ref="editorRef" @subHtml="setContent" mode="simple" :defHtml="obj.defineHtml">
                    </WangEditor>
                </el-form-item>
                <el-form-item label="发布人" prop="author" class="reduce-width">
                    <el-input v-model="obj.editForm.author"></el-input>
                </el-form-item>
                <el-form-item label="排序" prop="sort" class="reduce-width">
                    <el-input v-model="obj.editForm.sort"></el-input>
                </el-form-item>
                <el-form-item label="是否置顶" align="left">
                    <el-switch v-model="obj.editForm.is_top" :active-value="1" :inactive-value="0"></el-switch>
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
import WangEditor from '@/components/wang-editor'
import { add } from 'lodash'
const router = useRouter()
// 当前页面路由对象
const route = useRoute()
const pathName = route.name
const editForm = {
    notice_id: '',
    title: '',
    content: '',
    is_top: 0,
    author: '',
    sort: 10,
    status: 1
}
const formRef = ref(null)
const uploadRef = ref(null)
const editorRef = ref(null)
const defineHtml = ''
const dialogShow = false
const editFormRules = {
    title: [
        { required: true, message: '请输入公告标题', trigger: 'blur' },
        { min: 2, max: 20, message: '公告标题长度在2~20位之间', trigger: 'blur' }
    ],
    author: [
        { required: true, message: '请输入发布人', trigger: 'blur' },
        { min: 2, max: 34, message: '发布人长度在2~34位之间', trigger: 'blur' }
    ]
}
const obj = reactive({ editForm, dialogShow, defineHtml })
onMounted(() => {
    getRow()
})

const resetForm = function () {
    obj.dialogShow = false
    formRef.value.resetFields()
    uploadRef.value.resetUp()
}
const setContent = (content) => {
    obj.editForm.content = content
}
const getRow = () => {
    apis.contentApis.getNoticeRow({ notice_id: route.query.notice_id }).then(res => {
        if (res.meta.code === 1) {
            obj.editForm.title = res.data.title
            obj.editForm.content = res.data.content
            obj.editForm.is_top = res.data.is_top
            obj.editForm.author = res.data.author
            obj.editForm.status = res.data.status
            obj.editForm.notice_id = res.data.notice_id
            obj.defineHtml = res.data.content
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
            if (editForm.content === '') {
                ElMessage.error('请输入公告内容')
                return false
            }
            apis.contentApis.saveNoticeEdit(obj.editForm).then(res => {
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
    obj.dialogShow = false
    router.push('/notice/List')
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
