import requestTool from './axios-tools'
const powerApis = {
    // 菜单管理
    getOperateListPage: function (data) {
        return requestTool.post('power_operate/getOperateListPage', data)
    },
    saveOperateAdd: function (data) {
        return requestTool.post('power_operate/saveOperateAdd', data)
    },
    getOperateRow: function (data) {
        return requestTool.post('power_operate/getOperateRow', data)
    },
    saveOperateEdit: function (data) {
        return requestTool.post('power_operate/saveOperateEdit', data)
    },
    saveOperateDel: function (data) {
        return requestTool.post('power_operate/saveOperateDel', data)
    },
    getAllTree: function (data) {
        return requestTool.post('power_operate/getAllTree', data)
    },
    getUseTree: function (data) {
        return requestTool.post('power_operate/getUseTree', data)
    },
    getPowerTree: function (data) {
        return requestTool.post('power_operate/getPowerTree', data)
    },
    getBreadcrumbsNavigation: function (data) {
        return requestTool.post('power_operate/getBreadcrumbsNavigation', data)
    },
    getOperateName: function (data) {
        return requestTool.post('power_operate/getOperateName', data)
    },
    getPowerButton: function (data) {
        return requestTool.post('power_operate/getPowerButton', data)
    },
    getAll: function () {
        return requestTool.post('power_operate/getAll')
    },
    // 角色管理
    getRolesListPage: function (data) {
        return requestTool.post('power_roles/getRolesListPage', data)
    },
    saveRolesAdd: function (data) {
        return requestTool.post('power_roles/saveRolesAdd', data)
    },
    getRolesRow: function (data) {
        return requestTool.post('power_roles/getRolesRow', data)
    },
    saveRolesEdit: function (data) {
        return requestTool.post('power_roles/saveRolesEdit', data)
    },
    saveRolesDel: function (data) {
        return requestTool.post('power_roles/saveRolesDel', data)
    },
    getRolesAllTree: function (data) {
        return requestTool.post('power_roles/getAllTree', data)
    },
    getRolesUseTree: function (data) {
        return requestTool.post('power_roles/getUseTree', data)
    },
    updateRolesPower: function (data) {
        return requestTool.post('power_roles/updateRolesPower', data)
    },
    // 权限组管理
    getGroupListPage: function (data) {
        return requestTool.post('power_group/getGroupListPage', data)
    },
    saveGroupAdd: function (data) {
        return requestTool.post('power_group/saveGroupAdd', data)
    },
    getGroupRow: function (data) {
        return requestTool.post('power_group/getGroupRow', data)
    },
    saveGroupEdit: function (data) {
        return requestTool.post('power_group/saveGroupEdit', data)
    },
    saveGroupDel: function (data) {
        return requestTool.post('power_group/saveGroupDel', data)
    },
    getGroupAllTree: function (data) {
        return requestTool.post('power_group/getAllTree', data)
    },
    getGroupUseTree: function (data) {
        return requestTool.post('power_group/getUseTree', data)
    },
    // 绑定关系
    saveBind: function (data) {
        return requestTool.post('power_bind/saveBind', data)
    },
    getBind: function (data) {
        return requestTool.post('power_bind/getBind', data)
    }
}
export default powerApis
