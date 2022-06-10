<template>
    <div>
        <BrNav :name="pathName"></BrNav>
        <el-card class="top">
            <TopBack :name="pathName"></TopBack>
            <el-form :model="obj.editForm" ref="formRef" :rules="editFormRules" label-width="160px">
                <el-form-item label="配置类型" prop="category" class="reduce-width">
                    <el-select v-model="obj.editForm.category" placeholder="请选择配置类型">
                        <el-option v-for="item in obj.cateList" :key="item.value" :label="item.label"
                            :value="item.value + ''" />
                    </el-select>
                </el-form-item>
                <el-form-item label="配置名称" prop="name_zh" class="reduce-width">
                    <el-input v-model="obj.editForm.name_zh">
                    </el-input>
                </el-form-item>
                <el-form-item label="配置名称（英文）" prop="name_en" class="reduce-width">
                    <el-input v-model="obj.editForm.name_en">
                    </el-input>
                </el-form-item>
                <el-form-item label="值类型" prop="value_type" class="reduce-width">
                    <el-select v-model="obj.editForm.value_type" placeholder="请选择配置类型">
                        <el-option v-for="item in obj.valueList" :key="item.value" :label="item.label"
                            :value="item.value + ''" />
                    </el-select>
                </el-form-item>
                <el-form-item label="描述" prop="describe" class="reduce-width">
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
import { onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'
import apis from '@/request'

const router = useRouter()
// 当前页面路由对象
const route = useRoute()
const pathName = route.name
const editForm = {
    config_id: '',
    category: '',
    name_zh: '',
    name_en: '',
    value_type: '',
    describe: '',
    sort: 10,
    status: 1
}
const formRef = ref(null)
const editFormRules = {
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
const obj = reactive({ editForm, cateList, valueList })
onMounted(() => {
    getCateList()
    getValueList()
    getRow()
})
const getRow = () => {
    apis.baseApis.getConfigRow({ config_id: route.query.config_id }).then(res => {
        if (res.meta.code === 1) {
            obj.editForm.category = res.data.category + ''
            obj.editForm.name_zh = res.data.name_zh
            obj.editForm.name_en = res.data.name_en
            obj.editForm.value_type = res.data.value_type + ''
            obj.editForm.describe = res.data.describe
            obj.editForm.sort = res.data.sort
            obj.editForm.status = res.data.status
            obj.editForm.config_id = res.data.config_id
        } else {
            ElMessage.error(res.meta.msg)
        }
    }).catch(error => {
        console.log(error)
    })
}
const getCateList = () => {
    apis.baseApis.getTagDictionary({ name_en: 'config_category' }).then(res => {
        if (res.meta.code === 1) {
            obj.cateList = res.data
        }
    }).catch(error => {
        console.log(error)
    })
}
const getValueList = () => {
    apis.baseApis.getTagDictionary({ name_en: 'config_input_type' }).then(res => {
        if (res.meta.code === 1) {
            obj.valueList = res.data
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
            apis.baseApis.saveConfigEdit(obj.editForm).then(res => {
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
