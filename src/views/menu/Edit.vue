<template>
    <div>
        <BrNav :name="pathName"></BrNav>
        <el-card class="top">
            <TopBack :name="pathName"></TopBack>
            <el-form :model="obj.editForm" ref="formRef" :rules="editFormRules" label-width="160px">
                <el-form-item label="父级菜单" prop="parent_id" class="reduce-width">
                    <el-tree-select v-model="obj.editForm.parent_id" :data="obj.optionList" check-strictly />
                </el-form-item>
                <el-form-item label="菜单类型" prop="type" class="reduce-width">
                    <el-select v-model="obj.editForm.type" placeholder="请选择菜单类型" size="large">
                        <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="图标" prop="icon" class="reduce-width">
                    <el-input v-model="obj.editForm.icon"></el-input>
                </el-form-item>
                <el-form-item label="菜单名称" prop="name_zh" class="reduce-width">
                    <el-input v-model="obj.editForm.name_zh"></el-input>
                </el-form-item>
                <el-form-item label="菜单名称（英文）" prop="name_en" class="reduce-width">
                    <el-input v-model="obj.editForm.name_en"></el-input>
                </el-form-item>
                <el-form-item label="菜单路径" prop="path" class="reduce-width">
                    <el-input v-model="obj.editForm.path"></el-input>
                </el-form-item>
                <el-form-item label="是否权限控制" align="left">
                    <el-switch v-model="obj.editForm.is_power" :active-value="1" :inactive-value="0"></el-switch>
                </el-form-item>
                <el-form-item label="功能描述" class="reduce-width">
                    <el-input type="textarea" v-model="obj.editForm.describe"></el-input>
                </el-form-item>
                <el-form-item label="排序" prop="sort" class="reduce-width">
                    <el-input v-model="obj.editForm.sort"></el-input>
                </el-form-item>

                <el-form-item label="状态" align="left">
                    <el-switch v-model="obj.editForm.status" :active-value="1" :inactive-value="0"></el-switch>
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
import { ElMessage } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'
import apis from '@/request'

const router = useRouter()
// 当前页面路由对象
const route = useRoute()
const pathName = route.name
const editForm = {
    parent_id: '',
    type: 1,
    icon: '',
    name_zh: '',
    name_en: '',
    path: '',
    is_power: '',
    describe: '',
    sort: 10,
    status: 1
}
const typeList = [
    { value: 1, label: '菜单' },
    { value: 2, label: '操作' }
]
const formRef = ref(null)
const editFormRules = {
    icon: [
        { min: 2, max: 34, message: '图标在2~34位之间', trigger: 'blur' }
    ],
    name_zh: [
        { required: true, message: '请输入菜单中文名称', trigger: 'blur' },
        { min: 2, max: 34, message: '菜单中文名称长度在2~34位之间', trigger: 'blur' }
    ],
    name_en: [
        { required: true, message: '请输入菜单英文名称', trigger: 'blur' },
        { min: 2, max: 34, message: '邮箱长度在2~34位之间', trigger: 'blur' }
    ],
    path: [
        { required: true, message: '请输入菜单路径', trigger: 'blur' },
        { min: 2, max: 34, message: '菜单路径长度在2~34位之间', trigger: 'blur' }
    ]
}
onMounted(() => {
    getOptionsList()
    getRow()
})
const optionList = []
const obj = reactive({ editForm, optionList })

const resetForm = function () {
    formRef.value.resetFields()
    getOptionsList()
}
const getRow = () => {
    apis.powerApis.getOperateRow({ operate_id: route.query.operate_id }).then(res => {
        if (res.meta.code === 1) {
            obj.editForm.parent_id = res.data.parent_id
            obj.editForm.name = res.data.name
            obj.editForm.type = res.data.type
            obj.editForm.icon = res.data.icon
            obj.editForm.name_zh = res.data.name_zh
            obj.editForm.name_en = res.data.name_en
            obj.editForm.path = res.data.path
            obj.editForm.is_power = res.data.is_power
            obj.editForm.describe = res.data.describe
            obj.editForm.sort = res.data.sort
            obj.editForm.status = res.data.status
            obj.editForm.operate_id = res.data.operate_id
        } else {
            ElMessage.error(res.meta.msg)
        }
    }).catch(error => {
        console.log(error)
    })
}
const getOptionsList = () => {
    apis.powerApis.getUseTree().then(res => {
        if (res.meta.code === 1) {
            obj.optionList = res.data
        }
    })
}
const subEdit = () => {
    formRef.value.validate((valid) => {
        if (valid) {
            apis.powerApis.saveOperateEdit(obj.editForm).then(res => {
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
    router.push('/menu/List')
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
