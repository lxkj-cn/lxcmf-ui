<template>
    <div>
        <BrNav :name="pathName"></BrNav>
        <el-card class="top">
            <TopBack :name="pathName"></TopBack>
            <el-form :model="obj.editForm" ref="formRef" label-width="120px">
                <el-form-item label="广告图位置" class="reduce-width">
                    <el-select v-model="obj.editForm.type_id" placeholder="请选择广告图位置">
                        <el-option v-for="item in obj.typeList" :key="item.type_id"
                            :label="item.name + '（图片大小：' + item.width + '*' + item.height + ')'"
                            :value="item.type_id + ''" />
                    </el-select>
                </el-form-item>
                <el-form-item label="广告图">
                    <uploadImg ref="uploadRef" @uploadSuccess="setImgUrl" :group_id="2"></uploadImg>
                </el-form-item>
                <el-form-item label="跳转类型" class="reduce-width">
                    <el-select v-model="obj.editForm.redirect_type" placeholder="请选择配置类型">
                        <el-option v-for="item in obj.redirectList" :key="item.value" :label="item.name"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="跳转目标id" prop="redirect_id" class="reduce-width"
                    v-if="obj.editForm.redirect_type == 1 || obj.editForm.redirect_type == 2">
                    <el-input v-model="obj.editForm.redirect_id"></el-input>
                </el-form-item>
                <el-form-item label="跳转外链" prop="redirect_link" class="reduce-width"
                    v-if="obj.editForm.redirect_type == 3">
                    <el-input v-model="obj.editForm.redirect_link"></el-input>
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
import { imgUrl } from '@/constant'
const router = useRouter()
// 当前页面路由对象
const route = useRoute()
const pathName = route.name
const editForm = {
    type_id: 0,
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
const obj = reactive({ editForm, dialogShow, typeList, redirectList })
onMounted(() => {
    getOptionsList()
    getRow()
})
const getRow = () => {
    apis.contentApis.getAdRow({ ad_id: route.query.ad_id }).then(res => {
        if (res.meta.code === 1) {
            obj.editForm.type_id = res.data.type_id
            obj.editForm.img_url = res.data.img_url
            obj.editForm.redirect_type = res.data.redirect_type
            obj.editForm.redirect_id = res.data.redirect_id
            obj.editForm.redirect_link = res.data.redirect_link
            obj.editForm.remarks = res.data.remarks
            obj.editForm.sort = res.data.sort
            obj.editForm.status = res.data.status
            obj.editForm.ad_id = res.data.ad_id
            if (res.data.img_url_text) {
                uploadRef.value.setImgUrl(imgUrl + res.data.img_url_text)
            }
        } else {
            ElMessage.error(res.meta.msg)
        }
    }).catch(error => {
        console.log(error)
    })
}
const setImgUrl = (res) => {
    obj.editForm.img_url = res.code
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
    obj.editForm = {
        type_id: '',
        img_url: '',
        redirect_type: '',
        redirect_id: '',
        redirect_link: '',
        remarks: '',
        sort: 10,
        status: 1
    }
    uploadRef.value.resetUp()
}
const subEdit = () => {
    formRef.value.validate((valid) => {
        if (valid) {
            apis.contentApis.saveAdEdit(obj.editForm).then(res => {
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
