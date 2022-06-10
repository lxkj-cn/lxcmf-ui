<template>
    <BrNav :name="pathName"></BrNav>
    <el-card class="top">
        <el-row>
            <el-col :span="2" class="tools">
                <ButtonPlus type="primary" name="column_add" @clickSuccess="add"></ButtonPlus>
            </el-col>
        </el-row>
        <el-table :data="obj.listData" border stripe @sort-change="sortChange" row-key="column_id"
            style="width: 100%;margin-top:20px">
            <el-table-column prop="column_id" label="编号" width="80" />
            <el-table-column prop="name" label="栏目名称" />
            <el-table-column label="跳转类型" width="150">
                <template v-slot="scope">
                    <el-tag v-if="scope.row.redirect_type == 1">文章分类</el-tag>
                    <el-tag v-if="scope.row.redirect_type == 2">文章</el-tag>
                    <el-tag v-if="scope.row.redirect_type == 3">单页</el-tag>
                    <el-tag v-if="scope.row.redirect_type == 4">外链</el-tag>
                    <el-tag v-if="scope.row.redirect_type == 0">不跳转</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="page_size" label="列表分页大小" />
            <el-table-column prop="template_list" label="列表模板名称" width="180" />
            <el-table-column prop="template_views" label="详情模板名称" width="180" />
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
            <el-table-column fixed="right" width="180" label="操作">
                <template v-slot="scope">
                    <el-button-group>
                        <ButtonPlus type="primary" size="small" name="column_edit" @clickSuccess="edit(scope.row)">
                        </ButtonPlus>
                        <ButtonPlus type="danger" size="small" name="column_del" @clickSuccess="del(scope.row)">
                        </ButtonPlus>
                    </el-button-group>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
</template>

<script setup>

import { onMounted, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import apis from '@/request'
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
const obj = reactive({ listData, formData })
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
    apis.contentApis.getAllTree(formData).then(res => {
        if (res.meta.code === 1) {
            obj.listData = res.data
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
    updateData({ column_id: row.column_id, sort: row.sort })
}
const updateStatus = (row) => {
    updateData({ column_id: row.column_id, status: row.status })
}
const updateTop = (row) => {
    updateData({ column_id: row.column_id, is_top: row.is_top })
}
const updateData = (newData) => {
    apis.contentApis.saveColumnEdit(newData).then(res => {
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
    router.push('/column/Add')
}
const search = (row) => {
    getList()
}
const edit = (row) => {
    router.push('/column/Edit?column_id=' + row.column_id)
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
        console.log(row)
        apis.contentApis.saveColumnDel({ column_id: row.column_id }).then(res => {
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
</style>
