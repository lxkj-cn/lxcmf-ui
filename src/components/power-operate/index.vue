<template>
    <div>
        <el-drawer v-model="obj.isShow" :title="obj.drawerTitle" direction="rtl" size="15%" custom-class="demo-drawer">
            <div class="demo-drawer__content">
                <el-tree :data="obj.operateList" ref="operateTree" check-strictly
                    :default-checked-keys="obj.checkedKeys" show-checkbox check-on-click-node node-key="node_code" />
            </div>
            <div style="margin-top: 20px">
                <el-button type="primary" @click="subPower">提交</el-button>
            </div>
        </el-drawer>
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import apis from '@/request'
import { ElMessage, ElMessageBox } from 'element-plus'
const isShow = false
const operateList = []
const operateTree = ref(null)
const powerData = {}
const checkedKeys = []
const drawerTitle = ''
const obj = reactive({ isShow, operateList, powerData, checkedKeys, drawerTitle })

const emit = defineEmits(['bindSuccess'])
const getPower = () => {
    apis.powerApis.getBind(obj.powerData).then(res => {
        obj.checkedKeys = []
        operateTree.value.setCheckedNodes([])
        if (res.meta.code === 1) {
            obj.checkedKeys = res.data
        } else {
            ElMessage.error(res.meta.msg)
        }
    }).catch(error => {
        console.log(error)
    })
}
const subPower = () => {
    const res = operateTree.value.getCheckedNodes()
    const nodeCodeList = []
    res.forEach((item) => {
        nodeCodeList.push(item.node_code)
    })
    obj.powerData.list = nodeCodeList.join(',')
    apis.powerApis.saveBind(obj.powerData).then(res => {
        if (res.meta.code === 1) {
            obj.isShow = false
            emit('bindSuccess', res)
        } else {
            ElMessage.error(res.meta.msg)
        }
    }).catch(error => {
        console.log(error)
    })
}
const startTools = (cate, type, baseId, title) => {
    obj.isShow = true
    obj.powerData.type = type
    obj.powerData.base_id = baseId
    obj.drawerTitle = title
    if (cate === 1) {
        getOperateList()
    } else if (cate === 2) {
        getGroupList()
    } else if (cate === 3) {
        getRolesList()
    }
}
const getOperateList = () => {
    apis.powerApis.getPowerTree({}).then(res => {
        if (res.meta.code === 1) {
            obj.operateList = res.data
            getPower()
        } else {
            ElMessage.error(res.meta.msg)
        }
    }).catch(error => {
        console.log(error)
    })
}
const getGroupList = () => {
    apis.powerApis.getGroupAllTree({}).then(res => {
        if (res.meta.code === 1) {
            obj.operateList = res.data
            getPower()
        } else {
            ElMessage.error(res.meta.msg)
        }
    }).catch(error => {
        console.log(error)
    })
}
const getRolesList = () => {
    apis.powerApis.getRolesUseTree().then(res => {
        if (res.meta.code === 1) {
            obj.operateList = res.data
            getPower()
        }
    })
}
defineExpose({
    startTools
})
</script>

<style lang="scss" scoped>
</style>
