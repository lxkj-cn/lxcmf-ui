<template>
    <BrNav :name="pathName"></BrNav>
    <el-card class="top">
        <el-row>
            <el-alert title="本页面内容为系统基础板块，非技术人员请谨慎操作。" type="warning" />
        </el-row>
        <el-row>
            <el-col :span="2" class="tools">
                <ButtonPlus type="primary" name="roles_add" @clickSuccess="add"></ButtonPlus>
            </el-col>
        </el-row>
        <el-table :data="obj.listData" border stripe @sort-change="sortChange" row-key="roles_id"
            style="width: 100%;margin-top:20px">
            <el-table-column prop="roles_id" label="编号" width="80" />
            <el-table-column prop="name" label="角色名称" width="180" />
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
                        <ButtonPlus type="primary" size="small" name="roles_edit" @clickSuccess="edit(scope.row)">
                        </ButtonPlus>
                        <ButtonPlus type="danger" size="small" name="roles_del" @clickSuccess="del(scope.row)">
                        </ButtonPlus>
                    </el-button-group>
                    <el-button-group>
                        <ButtonPlus type="warning" size="small" name="roles_group" @clickSuccess="setGroup(scope.row)"
                            v-if="scope.row.roles_id > 1">
                        </ButtonPlus>
                        <ButtonPlus type="warning" size="small" name="roles_menu" @clickSuccess="set(scope.row)"
                            v-if="scope.row.roles_id > 1">
                        </ButtonPlus>
                    </el-button-group>
                    <ButtonPlus type="success" size="small" name="roles_refresh" @clickSuccess="updatePower(scope.row)"
                        v-if="scope.row.roles_id > 1">
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
const power = ref(null)
const formData = {
    limit: 10,
    page: 1,
    keyword: '',
    sort_field: '',
    sort_type: ''
}
const total = 0

const obj = reactive({ listData, formData, total })
const defaultAvatar = require('@/assets/img/def-header.jpeg')
onMounted(() => {
    if (store.state.limit > 9) {
        obj.formData.limit = store.state.limit
    }
    getList()
})
const setGroup = (row) => {
    power.value.startTools(2, 3, row.roles_id, '设置【' + row.name + '】权限')
}
const set = (row) => {
    power.value.startTools(1, 2, row.roles_id, '设置【' + row.name + '】权限')
}

const sortChange = (column) => {
    if (column.prop && column.order) {
        obj.formData.sort_field = column.prop
        obj.formData.sort_type = column.order
        getList()
    }
}
const getList = () => {
    apis.powerApis.getRolesAllTree(formData).then(res => {
        if (res.meta.code === 1) {
            obj.listData = res.data
        } else {
            ElMessage.error(res.meta.msg)
        }
    }).catch(error => {
        console.log(error)
    })
}
const updatePower = (row) => {
    apis.powerApis.updateRolesPower({ roles_id: row.roles_id }).then(res => {
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
const updateSort = (row) => {
    updateData({ roles_id: row.roles_id, sort: row.sort })
}
const updateStatus = (row) => {
    updateData({ roles_id: row.roles_id, status: row.status })
}
const updateData = (newData) => {
    apis.powerApis.saveRolesEdit(newData).then(res => {
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
    router.push('/roles/Add')
}
const edit = (row) => {
    router.push('/roles/Edit?roles_id=' + row.roles_id)
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
        apis.powerApis.saveRolesDel({ roles_id: row.roles_id }).then(res => {
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
