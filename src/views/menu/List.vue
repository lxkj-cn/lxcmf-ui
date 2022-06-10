<template>
    <BrNav :name="pathName"></BrNav>
    <el-card class="top">
        <el-row>
            <el-alert title="本页面内容为系统基础板块，非技术人员请谨慎操作。" type="warning" />
        </el-row>
        <el-row>
            <el-col :span="2" class="tools">
                <ButtonPlus type="primary" name="menu_add" @clickSuccess="add"></ButtonPlus>
            </el-col>
        </el-row>
        <el-table :data="obj.listData" border stripe row-key="operate_id" @sort-change="sortChange"
            style="width: 100%;margin-top:20px">
            <el-table-column prop="operate_id" label="编号" width="120" />
            <el-table-column label="菜单图标" width="120">
                <template v-slot="scope">
                    <component :is="scope.row.icon" class="menu-icon" size="5" v-if="scope.row.icon" />
                </template>
            </el-table-column>
            <el-table-column label="菜单类型" width="100">
                <template v-slot="scope">
                    <el-tag v-if="scope.row.type == 1">菜单</el-tag>
                    <el-tag v-else type="success">操作</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="name_zh" label="菜单名称" width="120" />
            <el-table-column prop="name_en" label="菜单英文名称（菜单标识）" width="120" />
            <el-table-column prop="describe" label="功能描述" width="350" />
            <el-table-column label="排序" :sortable="`custom`" prop="sort" width="150">
                <template v-slot="scope">
                    <el-input v-model="scope.row.sort" autocomplete="off" size="large" @change="updateSort(scope.row)">
                    </el-input>
                </template>
            </el-table-column>
            <el-table-column label="是否绑定页面" width="80">
                <template v-slot="scope">
                    <el-switch v-model="scope.row.is_page" :active-value="1" :inactive-value="0"
                        @change="updatePage(scope.row)" />
                </template>
            </el-table-column>
            <el-table-column label="是否权限控制" width="80">
                <template v-slot="scope">
                    <el-switch v-model="scope.row.is_power" :active-value="1" :inactive-value="0"
                        @change="updatePower(scope.row)" />
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
                    <ButtonPlus type="success" size="small" name="menu_son" @clickSuccess="addSon(scope.row)">
                    </ButtonPlus>
                    <el-button-group>
                        <ButtonPlus type="primary" size="small" name="menu_edit" @clickSuccess="edit(scope.row)">
                        </ButtonPlus>
                        <ButtonPlus type="danger" size="small" name="menu_del" @clickSuccess="del(scope.row)">
                        </ButtonPlus>
                    </el-button-group>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
</template>

<script setup>
// describe
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
const obj = reactive({ listData, formData })
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
    apis.powerApis.getAllTree(formData).then(res => {
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
    updateData({ operate_id: row.operate_id, sort: row.sort })
}
const updateStatus = (row) => {
    updateData({ operate_id: row.operate_id, status: row.status })
}
const updatePower = (row) => {
    updateData({ operate_id: row.operate_id, is_power: row.is_power })
}
const updatePage = (row) => {
    updateData({ operate_id: row.operate_id, is_page: row.is_page })
}
const updateData = (newData) => {
    apis.powerApis.saveOperateEdit(newData).then(res => {
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
    router.push('/menu/Add')
}
const search = (row) => {
    getList()
}
const addSon = (row) => {
    router.push('/menu/Add?operate_id=' + row.operate_id)
}
const edit = (row) => {
    router.push('/menu/Edit?operate_id=' + row.operate_id)
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
        apis.powerApis.saveOperateDel({ operate_id: row.operate_id }).then(res => {
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

.menu-icon {
    width: 50px;
    height: 50px
}

.el-button-group {
    margin-left: 10px
}
</style>
