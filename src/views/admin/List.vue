<template>
    <BrNav :name="pathName"></BrNav>
    <el-card class="top">
        <el-row>
            <el-col :span="6" class="tools">
                <el-input v-model="obj.formData.keyword" placeholder="请输入姓名或账号、手机号" clearable autocomplete="off">
                </el-input>
                <el-tooltip :enterable="false" effect="dark" content="搜索" placement="top">
                    <el-button type="primary" @click="search" :icon="`Search`" class="sub-search"></el-button>
                </el-tooltip>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="2" class="tools">
                <ButtonPlus type="primary" name="admin_add" @clickSuccess="add"></ButtonPlus>
            </el-col>
        </el-row>
        <el-table :data="obj.listData" border stripe @sort-change="sortChange" style="width: 100%;margin-top:20px">
            <el-table-column type="selection" width="55" />
            <el-table-column prop="admin_id" label="编号" width="60" />
            <el-table-column label="头像" width="80">
                <template v-slot="scope">
                    <el-image :src="imgUrl + scope.row.head_img_url" class="avatar" fit="fill"
                        :preview-src-list="[imgUrl + scope.row.head_img_url]" :preview-teleported="true"
                        v-if="scope.row.head_img_url" />
                    <el-image :src="defaultAvatar" :preview-src-list="[defaultAvatar]" :preview-teleported="true"
                        class="avatar" fit="fill" v-else />
                </template>
            </el-table-column>
            <el-table-column prop="login_account" label="登录账号" width="120" />
            <el-table-column prop="name" label="姓名" width="160" />
            <el-table-column prop="roles_name" label="角色" width="150" />
            <el-table-column prop="tel" label="电话" width="120" />
            <el-table-column prop="email" label="邮箱" width="150" />
            <el-table-column prop="last_ip" label="上次登录ip" width="100" />
            <el-table-column prop="last_time" :sortable="`custom`" label="上次登录时间" width="140" />
            <el-table-column label="排序" :sortable="`custom`" prop="sort" width="120">
                <template v-slot="scope">
                    <el-input v-model="scope.row.sort" autocomplete="off" size="large" @change="updateSort(scope.row)">
                    </el-input>
                </template>
            </el-table-column>
            <el-table-column label="状态" width="80">
                <template v-slot="scope">
                    <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0"
                        @change="updateStatus(scope.row)" :disabled="scope.row.admin_id == 1" />
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作">
                <template v-slot="scope">
                    <el-button-group>
                        <ButtonPlus type="primary" size="small" name="admin_edit" @clickSuccess="edit(scope.row)">
                        </ButtonPlus>
                        <ButtonPlus type="danger" size="small" name="admin_del" @clickSuccess="del(scope.row)"
                            v-if="scope.row.admin_id > 1"></ButtonPlus>
                    </el-button-group>
                    <ButtonPlus type="warning" size="small" name="admin_roles" @clickSuccess="set(scope.row)"
                        v-if="scope.row.admin_id > 1"></ButtonPlus>
                </template>
            </el-table-column>
        </el-table>
        <el-config-provider>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                v-model:currentPage="obj.formData.page" :page-sizes="[10, 20, 50, 100]"
                v-model:page-size="obj.formData.limit" layout="total, sizes, prev, pager, next, jumper"
                :total="obj.total" style="width: 100%;margin-top:20px">
            </el-pagination>
        </el-config-provider>
    </el-card>
    <power-operate ref="power"></power-operate>
</template>

<script setup>

import { imgUrl } from '@/constant'
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import powerOperate from '@/components/power-operate'
import apis from '@/request'
const router = useRouter()
const store = useStore()
// 当前页面路由对象
const route = useRoute()
const pathName = route.name
const listData = []
const formData = {
    limit: 10,
    page: 1,
    keyword: '',
    sort_field: '',
    sort_type: ''
}
const total = 0
const power = ref(null)
const obj = reactive({ listData, formData, total })
const defaultAvatar = require('@/assets/img/def-header.jpeg')
onMounted(() => {
    if (store.state.limit > 9) {
        obj.formData.limit = store.state.limit
    }
    getList()
})
const set = (row) => {
    power.value.startTools(3, 4, row.admin_id, '设置【' + row.name + '】角色')
}
const sortChange = (column) => {
    if (column.prop && column.order) {
        obj.formData.sort_field = column.prop
        obj.formData.sort_type = column.order
        getList()
    }
}
const getList = () => {
    apis.adminApis.getAdminListPage(formData).then(res => {
        if (res.meta.code === 1) {
            obj.listData = res.data.list
            obj.total = res.data.total
        } else {
            ElMessage.error(res.meta.msg)
        }
    }).catch(error => {
        console.log(error)
    })
}
const handleSizeChange = function (newLimit) {
    formData.limit = newLimit
    store.dispatch('setLimit', newLimit)
    getList()
}
const handleCurrentChange = function (newPage) {
    formData.page = newPage
    getList()
}
const updateSort = (row) => {
    updateData({ admin_id: row.admin_id, sort: row.sort })
}
const updateStatus = (row) => {
    updateData({ admin_id: row.admin_id, status: row.status })
}
const updateData = (newData) => {
    apis.adminApis.saveAdminEdit(newData).then(res => {
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
    router.push('/admin/Add')
}
const search = (row) => {
    getList()
}
const edit = (row) => {
    router.push('/admin/Edit?admin_id=' + row.admin_id)
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
        apis.adminApis.saveAdminDel({ admin_id: row.admin_id }).then(res => {
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
