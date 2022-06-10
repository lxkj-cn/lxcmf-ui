import requestTool from './axios-tools'
const adminApis = {
    getAdminListPage: function (data) {
        return requestTool.post('admin/getAdminListPage', data)
    },
    saveAdminAdd: function (data) {
        return requestTool.post('admin/saveAdminAdd', data)
    },
    saveAdminEdit: function (data) {
        return requestTool.post('admin/saveAdminEdit', data)
    },
    getAdminRow: function (data) {
        return requestTool.post('admin/getAdminRow', data)
    },
    saveAdminDel: function (data) {
        return requestTool.post('admin/saveAdminDel', data)
    },
    getAdminInfo: function (data) {
        return requestTool.post('admin/getAdminInfo', data)
    },
    saveAdminInfo: function (data) {
        return requestTool.post('admin/saveAdminInfo', data)
    },
    setAdminPassword: function (data) {
        return requestTool.post('admin/setAdminPassword', data)
    },
    logout: function () {
        return requestTool.post('login/logout')
    }
}
export default adminApis
