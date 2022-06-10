<template>
    <div>
        <BrNav :name="pathName"></BrNav>
        <el-card class="top">
            <TopBack :name="pathName"></TopBack>
            <el-form :model="obj.addForm" ref="formRef" :rules="addFormRules" label-width="160px">
                <el-form-item label="配置类型" prop="category" class="reduce-width">
                    <el-select v-model="obj.addForm.category" placeholder="请选择配置类型">
                        <el-option v-for="item in obj.cateList" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="配置名称" prop="name_zh" class="reduce-width">
                    <el-input v-model="obj.addForm.name_zh">
                    </el-input>
                </el-form-item>
                <el-form-item label="配置名称（英文）" prop="name_en" class="reduce-width">
                    <el-input v-model="obj.addForm.name_en">
                    </el-input>
                </el-form-item>
                <el-form-item label="值类型" prop="value_type" class="reduce-width">
                    <el-select v-model="obj.addForm.value_type" placeholder="请选择配置类型">
                        <el-option v-for="item in obj.valueList" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="描述" prop="describe" class="reduce-width">
                    <el-input type="textarea" v-model="obj.addForm.describe"></el-input>
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
import { onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'

import apis from '@/request'
const router = useRouter()
// 当前页面路由对象
const route = useRoute()
const pathName = route.name
const addForm = {
    category: '',
    name_zh: '',
    name_en: '',
    value_type: '',
    describe: '',
    sort: 10,
    status: 1
}
const formRef = ref(null)
const dialogShow = false
const addFormRules = {
    category: [
        { required: true, message: '请选择配置类型', trigger: 'blur' }
    ],
    name_zh: [
        { required: true, message: '请输入配置名称', trigger: 'blur' },
        { min: 2, max: 34, message: '配置名称长度在2~34位之间', trigger: 'blur' }
    ],
    name_en: [
        { required: true, message: '请输入配置名称', trigger: 'blur' },
        { min: 2, max: 34, message: '配置名称长度在2~34位之间', trigger: 'blur' }
    ],
    value_type: [
        { required: true, message: '请选择配置值类型', trigger: 'blur' }
    ],
    describe: [
        { required: true, message: '请输入配置项描述', trigger: 'blur' }
    ]
}
const cateList = []
const valueList = []
const obj = reactive({ addForm, dialogShow, cateList, valueList })
onMounted(() => {
    getCateList()
    getValueList()
})
const getCateList = () => {
    apis.baseApis.getTagDictionary({ name_en: 'config_category' }).then(res => {
        if (res.meta.code === 1) {
            obj.cateList = res.data
        } else {
            ElMessage.error(res.meta.msg)
        }
    }).catch(error => {
        console.log(error)
    })
}
const getValueList = () => {
    apis.baseApis.getTagDictionary({ name_en: 'config_input_type' }).then(res => {
        if (res.meta.code === 1) {
            obj.valueList = res.data
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
}

const subAdd = () => {
    formRef.value.validate((valid) => {
        if (valid) {
            apis.baseApis.saveConfigAdd(obj.addForm).then(res => {
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
    router.push('/config/List')
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
