<template>
    <el-upload class="avatar-uploader" :action="apisUrl + 'resource/uploadImg' + obj.queryParam" name="img_file"
        :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
        <img v-if="imageUrl" :src="imageUrl" class="avatar" />
        <el-icon v-else class="avatar-uploader-icon">
            <Plus />
        </el-icon>
    </el-upload>
</template>

<script  setup>
import { onMounted, ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { apisUrl } from '@/constant'
const imageUrl = ref('')
const emit = defineEmits(['uploadSuccess'])
const props = defineProps({
    imgurl: String,
    group_id: Number
})
const queryParam = ''
const obj = reactive({ queryParam })
onMounted(() => {
    if (props.imgurl) {
        imageUrl.value = props.imgurl
    }
    if (props.group_id > 1) {
        obj.queryParam = '?group_id=' + props.group_id
    }
})
const handleAvatarSuccess = (
    response,
    uploadFile
) => {
    imageUrl.value = URL.createObjectURL(uploadFile.raw)
    if (response.meta.code === 1) {
        emit('uploadSuccess', response.data)
    } else {
        ElMessage.error(response.meta.msg)
    }
}

const beforeAvatarUpload = (rawFile) => {
    if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
        ElMessage.error('上传图片格式错误，请核实后再试')
        return false
    } else if (rawFile.size / 1024 / 1024 > 20) {
        ElMessage.error('上传文件过大，最大只能上传20M文件!')
        return false
    }
    return true
}
const resetUp = () => {
    imageUrl.value = ''
}
const setImgUrl = (url) => {
    imageUrl.value = url
}
defineExpose({
    resetUp, setImgUrl
})
</script>

<style scoped>
.avatar-uploader .avatar {
    width: 178px;
    display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
}
</style>
