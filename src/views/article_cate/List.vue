<template>
    <BrNav :name="pathName"></BrNav>
    <el-card class="top">
        <el-row>
            <el-col :span="2" class="tools">
                <ButtonPlus type="primary" name="article_cate_add" @clickSuccess="add"></ButtonPlus>
            </el-col>
        </el-row>
        <el-table :data="obj.listData" border stripe @sort-change="sortChange" row-key="category_id"
            style="width: 100%;margin-top:20px">
            <el-table-column prop="category_id" label="编号" width="80" />
            <el-table-column label="分类图像" width="180">
                <template v-slot="scope">
                    <el-image :src="imgUrl + scope.row.img_url_text" class="avatar" fit="fill"
                        :preview-src-list="[imgUrl + scope.row.img_url_text]" :preview-teleported="true"
                        v-if="scope.row.img_url_text" />
                    <el-image :src="defaultAvatar" :preview-src-list="[defaultAvatar]" :preview-teleported="true"
                        class="avatar" fit="fill" v-else />
                </template>
            </el-table-column>
            <el-table-column prop="name" label="分类名称" width="180" />
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
                        <ButtonPlus type="primary" size="small" name="article_cate_edit"
                            @clickSuccess="edit(scope.row)">
                        </ButtonPlus>
                        <ButtonPlus type="danger" size="small" name="article_cate_del" @clickSuccess="del(scope.row)">
                        </ButtonPlus>
                    </el-button-group>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
</template>

<script setup>
import { imgUrl } from '@/constant'
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
const defaultAvatar = require('@/assets/img/def-header.jpeg')
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
    apis.contentApis.getCategoryAllTree(formData).then(res => {
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
    updateData({ category_id: row.category_id, sort: row.sort })
}
const updateStatus = (row) => {
    updateData({ category_id: row.category_id, status: row.status })
}
const updateTop = (row) => {
    updateData({ category_id: row.category_id, is_top: row.is_top })
}
const updateData = (newData) => {
    apis.contentApis.saveArticleCategoryEdit(newData).then(res => {
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
    router.push('/article_cate/Add')
}
const search = (row) => {
    getList()
}
const edit = (row) => {
    router.push('/article_cate/Edit?category_id=' + row.category_id)
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
        apis.contentApis.saveArticleCategoryDel({ category_id: row.category_id }).then(res => {
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
