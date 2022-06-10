<template>
    <div style="border: 1px solid #ccc; margin-top: 10px">
        <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig"
            :mode="mode" />
        <Editor style="height: 500px; overflow-y: hidden;" v-model="valueHtml" @onChange="subHtml"
            :defaultConfig="editorConfig" :mode="mode" @onCreated="handleCreated" />
    </div>
</template>

<script setup>
import '@wangeditor/editor/dist/css/style.css' // 引入 css

import { apisUrl, imgUrl } from '@/constant'
import { computed, onBeforeUnmount, ref, shallowRef, onMounted } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()
const props = defineProps({
    mode: String,
    defHtml: String
})
const emit = defineEmits(['subHtml'])
// 内容 HTML
const valueHtml = ref(null)
const toolbarConfig = {
    excludeKeys: [
        'group-more-style' // 排除菜单组，写菜单组 key 的值即可
    ]
}
onMounted(() => {
    setTimeout(() => {
        valueHtml.value = props.defHtml
    }, 500)
})
const editorConfig = {
    MENU_CONF: {}
}
editorConfig.MENU_CONF.uploadImage = {
    server: apisUrl + 'resource/uploadImg?group_id=4',
    fieldName: 'img_file',
    withCredentials: true,
    // 自定义插入图片
    customInsert (res, insertFn) {
        // 从 res 中找到 url alt href ，然后插图图片
        if (res.meta.code === 1) {
            insertFn(imgUrl + res.data.original_url, res.data.code, res.data.original_url)
        }
    }
}
editorConfig.MENU_CONF.uploadVideo = {
    server: apisUrl + 'resource/uploadFile?group_id=4',
    fieldName: 'file',
    withCredentials: true,
    // 自定义插入图片
    customInsert (res, insertFn) {
        // 从 res 中找到 url alt href ，然后插图图片
        if (res.meta.code === 1) {
            insertFn(imgUrl + res.data.original_url, res.data.code, res.data.original_url)
        }
    }
}
const subHtml = () => {
    emit('subHtml', editorRef.value.getHtml())
}
// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
    const editor = editorRef.value
    if (editor == null) return
    editor.destroy()
})

const handleCreated = (editor) => {
    editorRef.value = editor // 记录 editor 实例，重要！
}
</script>

<style lang="scss" scoped>
</style>
