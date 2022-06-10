<template>
    <div>
        <BrNav :name="pathName"></BrNav>
        <el-row class="bodybox">
            <el-alert title="本页面内容为系统基础板块，非技术人员请谨慎操作。" type="warning" />
        </el-row>
        <el-row class="bodybox">
            <el-col :span="4">
                <el-card class="">
                    <el-tree :data="obj.treeData" accordion @node-click="dictionaryClick" />
                </el-card>
            </el-col>
            <el-col :span="20" v-if="obj.isShow">
                <el-card class="">
                    <el-row>
                        <el-col :span="2" class="tools">
                            <ButtonPlus type="primary" name="dictionary_add_value" @clickSuccess="add"></ButtonPlus>
                        </el-col>
                    </el-row>
                    <el-table :data="obj.valueList" border stripe @sort-change="sortChange"
                        style="width: 100%;margin-top:20px">
                        <el-table-column prop="value_id" label="编号" width="80" />
                        <el-table-column prop="value" label="值" width="80" />
                        <el-table-column prop="label" label="名称" />
                        <el-table-column label="排序" :sortable="`custom`" prop="sort" width="150">
                            <template v-slot="scope">
                                <el-input v-model="scope.row.sort" autocomplete="off" size="large"
                                    @change="updateSort(scope.row)">
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
                                    <ButtonPlus type="primary" size="small" name="dictionary_edit_value"
                                        @clickSuccess="edit(scope.row)">
                                    </ButtonPlus>
                                    <ButtonPlus type="danger" size="small" name="dictionary_del_value"
                                        @clickSuccess="del(scope.row)">
                                    </ButtonPlus>
                                </el-button-group>
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
            </el-col>
            <el-drawer ref="drawerRef" v-model="obj.isAdd" title="添加数据" direction="rtl" custom-class="demo-drawer">
                <div class="demo-drawer__content">
                    <el-form :model="obj.subForm" label-width="80px">
                        <el-form-item label="名称">
                            <el-input v-model="obj.subForm.label" prop="labels" autocomplete="off" />
                        </el-form-item>
                        <el-form-item label="值">
                            <el-input v-model="obj.subForm.value" prop="values" autocomplete="off" />
                        </el-form-item>
                        <el-form-item label="排序">
                            <el-input v-model="obj.subForm.sort" autocomplete="off" />
                        </el-form-item>
                    </el-form>
                    <div class="demo-drawer__footer">
                        <el-button @click="cancelForm">取消</el-button>
                        <el-button type="primary" @click="subAdd">提交</el-button>
                    </div>
                </div>
            </el-drawer>
            <el-drawer ref="drawerRef" v-model="obj.isEdit" title="编辑" direction="rtl" custom-class="demo-drawer">
                <div class="demo-drawer__content">
                    <el-form :model="obj.subForm" label-width="80px">
                        <el-form-item label="名称">
                            <el-input v-model="obj.subForm.label" prop="labels" autocomplete="off" />
                        </el-form-item>
                        <el-form-item label="值">
                            <el-input v-model="obj.subForm.value" prop="values" autocomplete="off" />
                        </el-form-item>
                        <el-form-item label="排序">
                            <el-input v-model="obj.subForm.sort" autocomplete="off" />
                        </el-form-item>
                    </el-form>
                    <div class="demo-drawer__footer">
                        <el-button @click="cancelForm">取消</el-button>
                        <el-button type="primary" @click="subEdit">提交</el-button>
                    </div>
                </div>
            </el-drawer>
        </el-row>
    </div>
</template>

<script setup>
import { ElMessage, ElDrawer } from 'element-plus'
import { onMounted, reactive, ref } from 'vue'
import { useStore } from 'vuex'
import apis from '@/request'
import { useRouter, useRoute } from 'vue-router'

// 当前页面路由对象
const route = useRoute()
const pathName = route.name
const treeData = []
const dictionaryId = 0
const isShow = false
const isAdd = false
const isEdit = false
const valueList = []
const total = 0
const store = useStore()
const formRef = ref(null)
const formData = {
    dictionary_id: 0,
    limit: 10,
    page: 1,
    keyword: '',
    sort_field: '',
    sort_type: ''
}
const subForm = {
    dictionary_id: 0,
    value: '',
    label: '',
    sort: 10
}
const obj = reactive({ treeData, dictionaryId, isShow, valueList, formData, total, isAdd, isEdit, subForm })
onMounted(() => {
    if (store.state.limit > 9) {
        obj.formData.limit = store.state.limit
    }
    getList()
})
const getList = () => {
    apis.baseApis.getAllTree().then(res => {
        if (res.meta.code === 1) {
            obj.treeData = res.data
        } else {
            ElMessage.error(res.meta.msg)
        }
    }).catch(error => {
        console.log(error)
    })
}
const dictionaryClick = (data) => {
    obj.formData.dictionary_id = data.dictionary_id
    getValueList()
}
const subAdd = () => {
    obj.subForm.dictionary_id = obj.formData.dictionary_id
    apis.baseApis.saveDictionaryValueAdd(obj.subForm).then(res => {
        if (res.meta.code === 1) {
            getValueList()
            obj.isAdd = false
            obj.subForm = {
                dictionary_id: 0,
                value: '',
                label: '',
                sort: 10
            }
        } else {
            ElMessage.error(res.meta.msg)
        }
    }).catch(error => {
        console.log(error)
    })
}
const subEdit = () => {
    obj.subForm.dictionary_id = obj.formData.dictionary_id
    apis.baseApis.saveDictionaryValueEdit(obj.subForm).then(res => {
        if (res.meta.code === 1) {
            getValueList()
            obj.subForm = {
                dictionary_id: 0,
                value: '',
                label: '',
                sort: 10
            }
            obj.isEdit = false
        } else {
            ElMessage.error(res.meta.msg)
        }
    }).catch(error => {
        console.log(error)
    })
}

const getValueList = () => {
    apis.baseApis.getDictionaryValueListPage(formData).then(res => {
        obj.isShow = true
        if (res.meta.code === 1) {
            obj.valueList = res.data.list
            obj.total = res.data.total
        } else {
            ElMessage.error(res.meta.msg)
        }
    }).catch(error => {
        console.log(error)
    })
}
const updateSort = (row) => {
    updateData({ value_id: row.value_id, sort: row.sort })
}
const updateStatus = (row) => {
    updateData({ value_id: row.value_id, status: row.status })
}
const updateData = (newData) => {
    apis.baseApis.saveDictionaryValueEdit(newData).then(res => {
        if (res.meta.code === 1) {
            ElMessage.success(res.meta.msg)
            getValueList()
        } else {
            ElMessage.error(res.meta.msg)
        }
    }).catch(error => {
        console.log(error)
    })
}

const add = (row) => {
    obj.isAdd = true
}
const edit = (row) => {
    obj.subForm.dictionary_id = row.dictionary_id
    obj.subForm.value = row.value
    obj.subForm.label = row.label
    obj.subForm.sort = row.sort
    obj.subForm.value_id = row.value_id
    obj.isEdit = true
}
const del = (row) => {
    apis.baseApis.saveDictionaryValueDel({ value_id: row.value_id }).then(res => {
        if (res.meta.code === 1) {
            getValueList()
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
    getValueList()
}
const handleCurrentChange = function (newPage) {
    formData.page = newPage
    getValueList()
}
const sortChange = (column) => {
    if (column.prop && column.order) {
        obj.formData.sort_field = column.prop
        obj.formData.sort_type = column.order
        getValueList()
    }
}
const cancelForm = () => {
    obj.isAdd = false
}
</script>

<style lang="scss" scoped>
.bodybox {
    margin-top: 20px;
}
</style>
