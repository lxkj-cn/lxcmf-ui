<template>
    <div>
        <BrNav :name="pathName"></BrNav>
        <el-card class="top">
            <TopBack :name="pathName"></TopBack>
            <el-form :model="obj.editForm" ref="formRef" :rules="editFormRules" label-width="120px">
                <el-form-item label="父级栏目" prop="parent_id" class="reduce-width">
                    <el-tree-select v-model="obj.editForm.parent_id" :data="obj.optionList" check-strictly />
                </el-form-item>
                <el-form-item label="栏目名称" prop="name" class="reduce-width">
                    <el-input v-model="obj.editForm.name"></el-input>
                </el-form-item>
                <el-form-item label="跳转类型" class="reduce-width">
                    <el-select v-model="obj.editForm.redirect_type" placeholder="请选择配置类型">
                        <el-option v-for="item in obj.typeList" :key="item.value" :label="item.name"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="跳转目标id" prop="redirect_id" class="reduce-width"
                    v-if="obj.editForm.redirect_type == 1 || obj.editForm.redirect_type == 2">
                    <el-input v-model="obj.editForm.redirect_id"></el-input>
                </el-form-item>
                <el-form-item label="分页大小" class="reduce-width" v-if="obj.editForm.redirect_type == 1">
                    <el-input v-model="obj.editForm.page_size"></el-input>
                </el-form-item>
                <el-form-item label="跳转外链" prop="redirect_link" class="reduce-width"
                    v-if="obj.editForm.redirect_type == 4">
                    <el-input v-model="obj.editForm.redirect_link"></el-input>
                </el-form-item>
                <el-form-item label="列表模板" prop="template_list" class="reduce-width"
                    v-if="obj.editForm.redirect_type == 1">
                    <el-input v-model="obj.editForm.template_list"></el-input>
                </el-form-item>
                <el-form-item label="详情模板" prop="template_views" class="reduce-width"
                    v-if="obj.editForm.redirect_type == 1 || obj.editForm.redirect_type == 2 || obj.editForm.redirect_type == 3">
                    <el-input v-model="obj.editForm.template_views"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remarks" class="reduce-width">
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
import apis from '@/request'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
// 当前页面路由对象
const route = useRoute()
const pathName = route.name
const editForm = {
    parent_id: 0,
    name: '',
    redirect_type: 0,
    redirect_id: 0,
    page_size: 6,
    redirect_link: '',
    template_list: '',
    template_views: '',
    remarks: '',
    sort: 10,
    status: 1
}
const formRef = ref(null)
const editFormRules = {
    name: [
        { required: true, message: '请输入栏目名称', trigger: 'blur' },
        { min: 2, max: 20, message: '栏目名称长度在2~20位之间', trigger: 'blur' }
    ]
}
const optionList = []
const typeList = [{ value: 0, name: '不跳转' }, { value: 1, name: '文章分类' }, { value: 2, name: '文章' }, { value: 3, name: '单页' }, { value: 4, name: '外链' }]
const obj = reactive({ editForm, optionList, typeList })
onMounted(() => {
    getOptionsList()
    getRow()
})
const getRow = () => {
    apis.contentApis.getColumnRow({ column_id: route.query.column_id }).then(res => {
        if (res.meta.code === 1) {
            obj.editForm.parent_id = res.data.parent_id
            obj.editForm.name = res.data.name
            obj.editForm.redirect_type = res.data.redirect_type
            obj.editForm.redirect_id = res.data.redirect_id
            obj.editForm.redirect_link = res.data.redirect_link
            obj.editForm.template_list = res.data.template_list
            obj.editForm.template_views = res.data.template_views
            obj.editForm.remarks = res.data.remarks
            obj.editForm.sort = res.data.sort
            obj.editForm.status = res.data.status
            obj.editForm.column_id = res.data.column_id
        } else {
            ElMessage.error(res.meta.msg)
        }
    }).catch(error => {
        console.log(error)
    })
}
const getOptionsList = () => {
    apis.contentApis.getUseTree().then(res => {
        if (res.meta.code === 1) {
            obj.optionList = res.data
        }
    })
}

const resetForm = function () {
    formRef.value.resetFields()
}
const subEdit = () => {
    formRef.value.validate((valid) => {
        if (valid) {
            apis.contentApis.saveColumnEdit(obj.editForm).then(res => {
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
    router.push('/column/List')
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
