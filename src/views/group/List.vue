<template>
    <BrNav :name="pathName"></BrNav>
    <el-card class="top">
        <el-row>
            <el-alert title="本页面内容为系统基础板块，非技术人员请谨慎操作。" type="warning" />
        </el-row>
        <el-row>
            <el-col :span="2" class="tools">
                <ButtonPlus type="primary" name="group_add" @clickSuccess="add"></ButtonPlus>
            </el-col>
        </el-row>
        <el-table :data="obj.listData" border stripe @sort-change="sortChange" row-key="group_id"
            style="width: 100%;margin-top:20px">
            <el-table-column type="selection" width="55" />
            <el-table-column prop="group_id" label="编号" width="80" />
            <el-table-column prop="name" label="权限组名称" width="180" />
            <el-table-column prop="node_code" label="权限节点标识" width="380" />
            <el-table-column prop="describe" label="描述" width="380" />
            <el-table-column label="排序" :sortable="`custom`" prop="sort" width="150">
                <template v-slot="scope">
                    <el-input v-model="scope.row.sort" autocomplete="off" size="large" @change="updateSort(scope.row)">
                    </el-input>
                </template>
            </el-table-column>
            <el-table-column label="状态" width="80">
                <template v-slot="scope">
                    <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0"
                        @change="updateStatus(scope.row)" />
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作">
                <template v-slot="scope">

                    <el-button-group>
                        <ButtonPlus type="primary" size="small" name="group_edit" @clickSuccess="edit(scope.row)">
                        </ButtonPlus>
                        <ButtonPlus type="danger" size="small" name="group_del" @clickSuccess="del(scope.row)">
                        </ButtonPlus>
                    </el-button-group>
                    <ButtonPlus type="warning" size="small" class="setting" name="group_set"
                        @clickSuccess="set(scope.row)">
                    </ButtonPlus>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
    <power-operate ref="power"></power-operate>
</template>

<script setup>

import { onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'
import apis from '@/request'
import { useStore } from 'vuex'
import powerOperate from '@/components/power-operate'
const router = useRouter()
// 当前页面路由对象
const route = useRoute()
const pathName = route.name
const store = useStore()
const listData = []
const formData = {
    limit: 10,
    page: 1,
    keyword: '',
    sort_field: '',
    sort_type: ''
}
const total = 0
const obj = reactive({ listData, formData, total })
const power = ref(null)
const defaultAvatar = require('@/assets/img/def-header.jpeg')
onMounted(() => {
    if (store.state.limit > 9) {
        obj.formData.limit = store.state.limit
    }
    getList()
})

const sortChange = (column) => {
    if (column.prop && column.order) {
        obj.formData.sort_field = column.prop
        obj.formData.sort_type = column.order
        getList()
    }
}
const getList = () => {
    apis.powerApis.getGroupAllTree(formData).then(res => {
        if (res.meta.code === 1) {
            obj.listData = res.data
        } else {
            ElMessage.error(res.meta.msg)
        }
    }).catch(error => {
        console.log(error)
    })
}

const updateSort = (row) => {
    updateData({ group_id: row.group_id, sort: row.sort })
}
const updateStatus = (row) => {
    updateData({ group_id: row.group_id, status: row.status })
}
const updateData = (newData) => {
    apis.powerApis.saveGroupEdit(newData).then(res => {
        if (res.meta.code === 1) {
            ElMessage.success(res.meta.msg)
            getList()
        } else {
            ElMessage.error(res.meta.msg)
        }
    }).catch(error => {
        console.log(error)
    })
}
const add = (row) => {
    router.push('/group/Add')
}
const edit = (row) => {
    router.push('/group/Edit?group_id=' + row.group_id)
}
const set = (row) => {
    power.value.startTools(1, 1, row.group_id, '设置【' + row.name + '】权限')
}
const del = (row) => {
    ElMessageBox.confirm(
        '此操作将永久删除这条记录, 是否继续?',
        '删除确认',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }
    ).then(() => {
        apis.powerApis.saveGroupDel({ group_id: row.group_id }).then(res => {
            if (res.meta.code === 1) {
                ElMessage.success(res.meta.msg)
                getList()
            } else {
                ElMessage.error(res.meta.msg)
            }
        }).catch(error => {
            console.log(error)
        })
    })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '删除操作已取消'
            })
        })
}
</script>

<style lang="scss" scoped>
.top {
    margin-top: 20px;
}

.avatar {
    width: 50px;
}

.tools {
    text-align: left;
    margin-top: 10px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;

    .el-input {
        width: 50%;
    }

    .sub-search {
        margin-left: 10px;
    }
}

.el-button-group {
    margin-right: 10px;
}
</style>
