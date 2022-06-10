<template>
    <BrNav :name="pathName"></BrNav>
    <el-card class="top">

        <el-row>
            <el-col :span="2" class="tools">
                <ButtonPlus type="primary" name="advert_position_add" @clickSuccess="add"></ButtonPlus>
            </el-col>
        </el-row>
        <el-table :data="obj.listData" border stripe @sort-change="sortChange" style="width: 100%;margin-top:20px">
            <el-table-column prop="type_id" label="编号" width="80" />
            <el-table-column prop="name" label="广告位置名称" width="180" />
            <el-table-column prop="tag" label="广告位置标识" width="120" />
            <el-table-column prop="width" label="图片宽度" width="120" />
            <el-table-column prop="height" label="图片高度" width="120" />
            <el-table-column prop="remarks" label="备注" width="320" />
            <el-table-column prop="create_time" label="添加时间" width="160" />
            <el-table-column label="状态" width="80">
                <template v-slot="scope">
                    <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0"
                        @change="updateStatus(scope.row)" />
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作">
                <template v-slot="scope">
                    <el-button-group>
                        <ButtonPlus type="primary" size="small" name="advert_position_edit"
                            @clickSuccess="edit(scope.row)">
                        </ButtonPlus>
                        <ButtonPlus type="danger" size="small" name="advert_position_del"
                            @clickSuccess="del(scope.row)"></ButtonPlus>
                    </el-button-group>
                </template>
            </el-table-column>
        </el-table>
        <el-config-provider>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="obj.formData.page" :page-sizes="[10, 20, 50, 100]" :page-size="obj.formData.limit"
                layout="total, sizes, prev, pager, next, jumper" :total="obj.total" style="width: 100%;margin-top:20px">
            </el-pagination>
        </el-config-provider>
    </el-card>
</template>

<script setup>

import { imgUrl } from '@/constant'
import { onMounted, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'
import apis from '@/request'
import { useStore } from 'vuex'
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
    apis.contentApis.getAdTypeListPage(formData).then(res => {
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
    updateData({ type_id: row.type_id, sort: row.sort })
}
const updateStatus = (row) => {
    updateData({ type_id: row.type_id, status: row.status })
}
const updateData = (newData) => {
    apis.contentApis.saveAdTypeEdit(newData).then(res => {
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
    router.push('/advert_position/Add')
}
const search = (row) => {
    getList()
}
const edit = (row) => {
    router.push('/advert_position/Edit?type_id=' + row.type_id)
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
        apis.contentApis.saveAdTypeDel({ type_id: row.type_id }).then(res => {
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
