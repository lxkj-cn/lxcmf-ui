<template>
    <BrNav :name="pathName"></BrNav>
    <el-card class="top">
        <el-row>
            <el-col :span="6" class="tools">
                <el-select v-model="obj.formData.type_id" placeholder="请选择广告图位置">
                    <el-option v-for="item in obj.typeList" :key="item.type_id" :label="item.name"
                        :value="item.type_id" />
                </el-select>
                <el-tooltip :enterable="false" effect="dark" content="搜索" placement="top">
                    <el-button type="primary" @click="search" :icon="`Search`" class="sub-search"></el-button>
                </el-tooltip>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="2" class="tools">
                <ButtonPlus type="primary" name="advert_add" @clickSuccess="add"></ButtonPlus>
                <ButtonPlus type="danger" name="advert_del_all" @clickSuccess="delAll"></ButtonPlus>
            </el-col>
        </el-row>
        <el-table :data="obj.listData" border stripe @sort-change="sortChange" style="width: 100%;margin-top:20px"
            @selection-change="changeFun">
            <el-table-column type="selection" width="55" />
            <el-table-column prop="ad_id" label="编号" width="80" />
            <el-table-column prop="type.name" label="广告图位置" width="180" />
            <el-table-column label="广告图" width="80">
                <template v-slot="scope">
                    <el-image :src="imgUrl + scope.row.img_url_text" class="avatar" fit="fill"
                        :preview-src-list="[imgUrl + scope.row.img_url_text]" :preview-teleported="true"
                        v-if="scope.row.img_url_text" />
                    <el-image :src="defaultAvatar" :preview-src-list="[defaultAvatar]" :preview-teleported="true"
                        class="avatar" fit="fill" v-else />
                </template>
            </el-table-column>
            <el-table-column label="跳转类型" width="150">
                <template v-slot="scope">
                    <el-tag v-if="scope.row.redirect_type == 1">文章分类</el-tag>
                    <el-tag v-if="scope.row.redirect_type == 2">文章</el-tag>
                    <el-tag v-if="scope.row.redirect_type == 3">外链</el-tag>
                    <el-tag v-if="scope.row.redirect_type == 0">不跳转</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="remarks" label="备注" width="320" />
            <el-table-column prop="create_time" label="添加时间" width="160" />
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
                        <ButtonPlus type="primary" size="small" name="advert_edit" @clickSuccess="edit(scope.row)">
                        </ButtonPlus>
                        <ButtonPlus type="danger" size="small" name="advert_del" @clickSuccess="del(scope.row)">
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
    type_id: '',
    sort_field: '',
    sort_type: ''
}
const total = 0
const typeList = []
const ids = []
const obj = reactive({ listData, formData, total, typeList, ids })
const defaultAvatar = require('@/assets/img/def-header.jpeg')
onMounted(() => {
    if (store.state.limit > 9) {
        obj.formData.limit = store.state.limit
    }
    getOptionsList()
    getList()
})
const changeFun = (data) => {
    obj.ids = []
    data.forEach((item) => {
        obj.ids.push(item.ad_id)
    })
}
const delAll = () => {
    console.log(obj.ids.length)
    if (obj.ids.length > 0) {
        if (obj.ids.length < 2) {
            ElMessage({
                type: 'warning',
                message: '批量删除记录数量不能小于两条'
            })
        } else {
            ElMessageBox.confirm(
                '此操作将永久删除选中记录, 是否继续?',
                '删除确认',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }
            ).then(() => {
                apis.contentApis.saveAdAllDel({ ids: obj.ids }).then(res => {
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
    } else {
        ElMessage({
            type: 'warning',
            message: '请选择需要批量删除的记录'
        })
    }
}
const getOptionsList = () => {
    apis.contentApis.getAdTypeAll().then(res => {
        if (res.meta.code === 1) {
            obj.typeList = res.data
        }
    })
}
const sortChange = (column) => {
    if (column.prop && column.order) {
        obj.formData.sort_field = column.prop
        obj.formData.sort_type = column.order
        getList()
    }
}
const getList = () => {
    apis.contentApis.getAdListPage(formData).then(res => {
        if (res.meta.code === 1) {
            obj.listData = []
            obj.total = 0
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
    updateData({ ad_id: row.ad_id, sort: row.sort })
}
const updateStatus = (row) => {
    updateData({ ad_id: row.ad_id, status: row.status })
}
const updateData = (newData) => {
    apis.contentApis.saveAdEdit(newData).then(res => {
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
    router.push('/advert/Add')
}
const search = (row) => {
    getList()
}
const edit = (row) => {
    router.push('/advert/Edit?ad_id=' + row.ad_id)
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
        apis.contentApis.saveAdDel({ ad_id: row.ad_id }).then(res => {
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
