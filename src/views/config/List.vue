<template>
    <BrNav :name="pathName"></BrNav>
    <el-card class="top">
        <el-row class="bodybox">
            <el-alert title="本页面内容为系统基础板块，非技术人员请谨慎操作。" type="warning" />
        </el-row>
        <el-row>
            <el-col :span="8" class="tools">
                <el-select v-model="obj.formData.category" placeholder="请选择配置类型" style="width:160px;margin-right:10px">
                    <el-option v-for="item in obj.cateList" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
                <el-input v-model="obj.formData.keyword" placeholder="请输入配置项名称" clearable autocomplete="off"></el-input>
                <el-tooltip :enterable="false" effect="dark" content="搜索" placement="top">
                    <el-button type="primary" @click="search" :icon="`Search`" class="sub-search"></el-button>
                </el-tooltip>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="2" class="tools">
                <ButtonPlus type="primary" name="config_add" @clickSuccess="add"></ButtonPlus>
            </el-col>
        </el-row>
        <el-table :data="obj.listData" border stripe @sort-change="sortChange" style="width: 100%;margin-top:20px">
            <el-table-column type="selection" width="55" />
            <el-table-column prop="config_id" label="编号" width="80" />
            <el-table-column prop="name_zh" label="名称" width="160" />
            <el-table-column prop="name_en" label="名称(英文)" width="160" />
            <el-table-column prop="category" label="配置类型" width="120" />
            <el-table-column prop="value_type" label="输入方式" width="120" />
            <el-table-column prop="describe" label="描述" />
            <el-table-column label="排序" :sortable="`custom`" prop="sort" width="150">
                <template v-slot="scope">
                    <el-input v-model="scope.row.sort" autocomplete="off" size="large" @change="updateSort(scope.row)">
                    </el-input>
                </template>
            </el-table-column>
            <el-table-column label="状态" width="80">
                <template v-slot="scope">
                    <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0"
                        @change="updateStatus(scope.row)" :disabled="scope.row.config_id == 1" />
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作">
                <template v-slot="scope">
                    <el-button-group>
                        <ButtonPlus type="primary" size="small" name="config_edit" @clickSuccess="edit(scope.row)">
                        </ButtonPlus>
                        <ButtonPlus type="danger" size="small" name="config_del" @clickSuccess="del(scope.row)">
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
import { onMounted, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import apis from '@/request'
const router = useRouter()
// 当前页面路由对象
const route = useRoute()
const store = useStore()
const pathName = route.name
const listData = []
const formData = {
    limit: 10,
    category: '',
    page: 1,
    keyword: '',
    sort_field: '',
    sort_type: ''
}
const cateList = []
const total = 0
const obj = reactive({ listData, formData, total, cateList })
const defaultAvatar = require('@/assets/img/def-header.jpeg')
onMounted(() => {
    if (store.state.limit > 9) {
        obj.formData.limit = store.state.limit
    }
    getCateList()
    getList()
})
const getCateList = () => {
    apis.baseApis.getTagDictionary({ name_en: 'config_category' }).then(res => {
        if (res.meta.code === 1) {
            obj.cateList = res.data
        } else {
            ElMessage.error(res.meta.msg)
        }
    }).catch(error => {
        console.log(error)
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
    apis.baseApis.getConfigListPage(formData).then(res => {
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
    updateData({ config_id: row.config_id, sort: row.sort })
}
const updateStatus = (row) => {
    updateData({ config_id: row.config_id, status: row.status })
}
const updateData = (newData) => {
    apis.baseApis.saveConfigEdit(newData).then(res => {
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
    router.push('/config/Add')
}
const search = (row) => {
    getList()
}
const edit = (row) => {
    router.push('/config/Edit?config_id=' + row.config_id)
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
        apis.baseApis.saveConfigDel({ config_id: row.config_id }).then(res => {
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
