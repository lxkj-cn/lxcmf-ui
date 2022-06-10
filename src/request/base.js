import requestTool from './axios-tools'
const baseApis = {
    login: function (data) {
        return requestTool.post('login/login', data)
    },
    getSystemInfo: function () {
        return requestTool.post('login/getSystemInfo')
    },
    getRouterMenu: function () {
        return requestTool.post('login/getRouterMenu')
    },
    getLeftMenu: function (data) {
        return requestTool.post('login/getLeftMenu', data)
    },
    getLoginBg: function () {
        return requestTool.post('login/getLoginBg')
    },
    getPowerButton: function (data) {
        return requestTool.post('login/getPowerButton', data)
    },
    // 系统配置相关接口
    getConfigListPage: function (data) {
        return requestTool.post('config/getConfigListPage', data)
    },
    saveConfigAdd: function (data) {
        return requestTool.post('config/saveConfigAdd', data)
    },
    getConfigRow: function (data) {
        return requestTool.post('config/getConfigRow', data)
    },
    saveConfigEdit: function (data) {
        return requestTool.post('config/saveConfigEdit', data)
    },
    saveConfigDel: function (data) {
        return requestTool.post('config/saveConfigDel', data)
    },
    getCategoryConfig: function (data) {
        return requestTool.post('config/getCategoryConfig', data)
    },
    saveCategoryConfig: function (data) {
        return requestTool.post('config/saveCategoryConfig', data)
    },
    getTagConfig: function (data) {
        return requestTool.post('login/getTagConfig', data)
    },
    // 数据字典相关接口
    getDictionaryListPage: function (data) {
        return requestTool.post('dictionary/getDictionaryListPage', data)
    },
    saveDictionaryAdd: function (data) {
        return requestTool.post('dictionary/saveDictionaryAdd', data)
    },
    getDictionaryRow: function (data) {
        return requestTool.post('dictionary/getDictionaryRow', data)
    },
    saveDictionaryEdit: function (data) {
        return requestTool.post('dictionary/saveDictionaryEdit', data)
    },
    saveDictionaryDel: function (data) {
        return requestTool.post('dictionary/saveDictionaryDel', data)
    },
    getTagDictionary: function (data) {
        return requestTool.post('dictionary/getTagDictionary', data)
    },
    getAllTree: function (data) {
        return requestTool.post('dictionary/getAllTree', data)
    },
    getUseTree: function (data) {
        return requestTool.post('dictionary/getUseTree', data)
    },
    getDictionaryValueListPage: function (data) {
        return requestTool.post('dictionaryValue/getDictionaryValueListPage', data)
    },
    saveDictionaryValueAdd: function (data) {
        return requestTool.post('dictionaryValue/saveDictionaryValueAdd', data)
    },
    getDictionaryValueRow: function (data) {
        return requestTool.post('dictionaryValue/getDictionaryValueRow', data)
    },
    saveDictionaryValueEdit: function (data) {
        return requestTool.post('dictionaryValue/saveDictionaryValueEdit', data)
    },
    saveDictionaryValueDel: function (data) {
        return requestTool.post('dictionaryValue/saveDictionaryValueDel', data)
    },
    setResourceStatus: function (data) {
        return requestTool.post('resource/setResourceStatus', data)
    },
    // 清除缓存
    cleanCache: function (data) {
        return requestTool.post('login/cleanCache', data)
    }

}
export default baseApis
