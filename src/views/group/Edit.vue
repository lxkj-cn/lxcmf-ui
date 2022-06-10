<template>
    <div>
        <BrNav :name="pathName"></BrNav>
        <el-card class="top">
            <TopBack :name="pathName"></TopBack>
            <el-form :model="obj.editForm" ref="formRef" :rules="editFormRules" label-width="120px">
                <el-form-item label="父级菜单" prop="parent_id" class="reduce-width">
                    <el-tree-select v-model="obj.editForm.parent_id" :data="obj.optionList" check-strictly />
                </el-form-item>
                <el-form-item label="权限组名称" prop="name" class="reduce-width">
                    <el-input v-model="obj.editForm.name"></el-input>
                </el-form-item>
                <el-form-item label="描述" class="reduce-width">
                    <el-input type="textarea" v-model="obj.editForm.describe"></el-input>
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
import { reactive, ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'
import apis from '@/request'

const router = useRouter()
// 当前页面路由对象
const route = useRoute()
const pathName = route.name
const editForm = {
    parent_id: 0,
    name: '',
    type: 1,
    describe: '',
    sort: 10,
    status: 1
}
const formRef = ref(null)
const dialogShow = false
const editFormRules = {
    name: [
        { required: true, message: '请输入权限组名称', trigger: 'blur' },
        { min: 2, max: 20, message: '权限组名称长度在2~20位之间', trigger: 'blur' }
    ]
}
const optionList = []
const obj = reactive({ editForm, dialogShow, optionList })
onMounted(() => {
    getOptionsList()
    getRow()
})
const getOptionsList = () => {
    apis.powerApis.getGroupUseTree().then(res => {
        if (res.meta.code === 1) {
            obj.optionList = res.data
        }
    })
}

const resetForm = function () {
    obj.dialogShow = false
    formRef.value.resetFields()
}
const getRow = () => {
    apis.powerApis.getGroupRow({ group_id: route.query.group_id }).then(res => {
        if (res.meta.code === 1) {
            obj.editForm.parent_id = res.data.parent_id
            obj.editForm.name = res.data.name
            obj.editForm.type = res.data.type
            obj.editForm.describe = res.data.describe
            obj.editForm.sort = res.data.sort
            obj.editForm.status = res.data.status
            obj.editForm.group_id = res.data.group_id
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
            apis.powerApis.saveGroupEdit(obj.editForm).then(res => {
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
    router.push('/group/List')
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
