<template>
    <div>
        <BrNav :name="pathName"></BrNav>
        <el-card class="top">
            <TopBack :name="pathName"></TopBack>
            <el-form :model="obj.addForm" ref="formRef" label-width="120px">
                <el-form-item label="广告图位置" class="reduce-width">
                    <el-select v-model="obj.addForm.type_id" placeholder="请选择广告图位置">
                        <el-option v-for="item in obj.typeList" :key="item.type_id"
                            :label="item.name + '（图片大小：' + item.width + '*' + item.height + ')'" :value="item.type_id"
                            value-key="type_id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="广告图">
                    <uploadImg ref="uploadRef" @uploadSuccess="setImgUrl" :group_id="2"></uploadImg>
                </el-form-item>
                <el-form-item label="跳转类型" class="reduce-width">
                    <el-select v-model="obj.addForm.redirect_type" placeholder="请选择配置类型">
                        <el-option v-for="item in obj.redirectList" :key="item.value" :label="item.name"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="跳转目标id" prop="redirect_id" class="reduce-width"
                    v-if="obj.addForm.redirect_type == 1 || obj.addForm.redirect_type == 2">
                    <el-input v-model="obj.addForm.redirect_id"></el-input>
                </el-form-item>
                <el-form-item label="跳转外链" prop="redirect_link" class="reduce-width"
                    v-if="obj.addForm.redirect_type == 3">
                    <el-input v-model="obj.addForm.redirect_link"></el-input>
                </el-form-item>
                <el-form-item label="备注" class="reduce-width">
                    <el-input type="textarea" v-model="obj.addForm.remarks"></el-input>
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
    type_id: '',
    img_url: '',
    redirect_type: '',
    redirect_id: '',
    redirect_link: '',
    remarks: '',
    sort: 10,
    status: 1
}
const formRef = ref(null)
const uploadRef = ref(null)
const dialogShow = false
const typeList = []
const redirectList = [{ value: 0, name: '不跳转' }, { value: 1, name: '文章分类' }, { value: 2, name: '文章' }, { value: 3, name: '外链' }]
const obj = reactive({ addForm, dialogShow, typeList, redirectList })
onMounted(() => {
    getOptionsList()
})
const setImgUrl = (res) => {
    obj.addForm.img_url = res.code
}
const getOptionsList = () => {
    apis.contentApis.getAdTypeAll().then(res => {
        if (res.meta.code === 1) {
            obj.typeList = res.data
        }
    })
}
const resetForm = function () {
    obj.dialogShow = false
    obj.addForm = {
        type_id: '',
        img_url: '',
        redirect_type: '',
        redirect_id: '',
        redirect_link: '',
        remarks: '',
        sort: 10,
        status: 1
    }
    formRef.value.resetFields()
    uploadRef.value.resetUp()
}
const subAdd = () => {
    formRef.value.validate((valid) => {
        if (valid) {
            apis.contentApis.saveAdAdd(obj.addForm).then(res => {
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
    router.push('/advert/List')
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

.el-select {
    width: 80%;
}
</style>
