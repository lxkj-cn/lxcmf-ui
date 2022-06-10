<template>
    <div>
        <BrNav :name="pathName"></BrNav>
        <el-card class="top">
            <TopBack :name="pathName"></TopBack>
            <el-form :model="obj.editForm" ref="formRef" :rules="editFormRules" label-width="120px">
                <el-form-item label="广告类型名称" prop="name" class="reduce-width">
                    <el-input v-model="obj.editForm.name"></el-input>
                </el-form-item>
                <el-form-item label="广告类型标识" prop="tag" class="reduce-width">
                    <el-input v-model="obj.editForm.tag"></el-input>
                </el-form-item>
                <el-form-item label="广告图宽度" prop="width" class="reduce-width">
                    <el-input v-model="obj.editForm.width"></el-input>
                </el-form-item>
                <el-form-item label="广告图高度" prop="height" class="reduce-width">
                    <el-input v-model="obj.editForm.height"></el-input>
                </el-form-item>
                <el-form-item label="备注" class="reduce-width">
                    <el-input type="textarea" v-model="obj.editForm.remarks"></el-input>
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
const router = useRouter()
// 当前页面路由对象
const route = useRoute()
const pathName = route.name
const editForm = {
    type_id: 0,
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
const editFormRules = {
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
const obj = reactive({ editForm })
onMounted(() => {
    getRow()
})
const getRow = () => {
    apis.contentApis.getAdTypeRow({ type_id: route.query.type_id }).then(res => {
        if (res.meta.code === 1) {
            obj.editForm.name = res.data.name
            obj.editForm.tag = res.data.tag
            obj.editForm.width = res.data.width
            obj.editForm.height = res.data.height
            obj.editForm.remarks = res.data.remarks
            obj.editForm.status = res.data.status
            obj.editForm.type_id = res.data.type_id
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
const subEdit = () => {
    formRef.value.validate((valid) => {
        if (valid) {
            if (editForm.content === '') {
                ElMessage.error('请输入公告内容')
                return false
            }
            apis.contentApis.saveAdTypeEdit(obj.editForm).then(res => {
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
