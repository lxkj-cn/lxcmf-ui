<template>
    <BrNav :name="pathName"></BrNav>
    <el-card class="top">
        <el-row>
            <el-col :span="6" class="tools">
                <el-input v-model="obj.formData.keyword" placeholder="请输入seo标题" clearable autocomplete="off">
                </el-input>
                <el-tooltip :enterable="false" effect="dark" content="搜索" placement="top">
                    <el-button type="primary" @click="search" :icon="`Search`" class="sub-search"></el-button>
                </el-tooltip>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="2" class="tools">
                <ButtonPlus type="primary" name="seo_add" @clickSuccess="add"></ButtonPlus>
            </el-col>
        </el-row>
        <el-table :data="obj.listData" border stripe @sort-change="sortChange" style="width: 100%;margin-top:20px">
            <el-table-column type="selection" width="55" />
            <el-table-column prop="seo_id" label="编号" width="80" />
            <el-table-column label="目标类型" width="100">
                <template v-slot="scope">
                    <el-tag v-if="scope.row.target_type == 1">栏目</el-tag>
                    <el-tag v-if="scope.row.target_type == 2">文章分类</el-tag>
                    <el-tag v-if="scope.row.target_type == 3">文章</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="target_id" label="目标id" width="80" />
            <el-table-column prop="seo_title" label="seo标题" width="180" />
            <el-table-column prop="seo_keywords" label="seo关键词" width="280" />
            <el-table-column prop="create_time" label="发布时间" width="160" />
            <el-table-column label="状态" width="80">
                <template v-slot="scope">
                    <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0"
                        @change="updateStatus(scope.row)" />
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作">
                <template v-slot="scope">
                    <el-button-group>
                        <ButtonPlus type="primary" size="small" name="seo_edit" @clickSuccess="edit(scope.row)">
                        </ButtonPlus>
                        <ButtonPlus type="danger" size="small" name="seo_del" @clickSuccess="del(scope.row)">
                        </ButtonPlus>
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
    apis.contentApis.getSeoListPage(formData).then(res => {
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
const updateStatus = (row) => {
    updateData({ seo_id: row.seo_id, status: row.status })
}
const updateData = (newData) => {
    apis.contentApis.saveSeoEdit(newData).then(res => {
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
    router.push('/seo/Add')
}
const search = (row) => {
    getList()
}
const edit = (row) => {
    router.push('/seo/Edit?seo_id=' + row.seo_id)
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
        apis.contentApis.saveSeoDel({ seo_id: row.seo_id }).then(res => {
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
