import requestTool from './axios-tools'
const contentApis = {
    // 通知公告
    getNoticeListPage: function (data) {
        return requestTool.post('notice/getNoticeListPage', data)
    },
    saveNoticeAdd: function (data) {
        return requestTool.post('notice/saveNoticeAdd', data)
    },
    getNoticeRow: function (data) {
        return requestTool.post('notice/getNoticeRow', data)
    },
    saveNoticeEdit: function (data) {
        return requestTool.post('notice/saveNoticeEdit', data)
    },
    saveNoticeDel: function (data) {
        return requestTool.post('notice/saveNoticeDel', data)
    },
    // 栏目管理
    getColumnListPage: function (data) {
        return requestTool.post('column/getColumnListPage', data)
    },
    saveColumnAdd: function (data) {
        return requestTool.post('column/saveColumnAdd', data)
    },
    getColumnRow: function (data) {
        return requestTool.post('column/getColumnRow', data)
    },
    saveColumnEdit: function (data) {
        return requestTool.post('column/saveColumnEdit', data)
    },
    saveColumnDel: function (data) {
        return requestTool.post('column/saveColumnDel', data)
    },
    getAllTree: function (data) {
        return requestTool.post('column/getAllTree', data)
    },
    getUseTree: function (data) {
        return requestTool.post('column/getUseTree', data)
    },
    // 文章分类
    getArticleCategoryListPage: function (data) {
        return requestTool.post('article_category/getArticleCategoryListPage', data)
    },
    saveArticleCategoryAdd: function (data) {
        return requestTool.post('article_category/saveArticleCategoryAdd', data)
    },
    getArticleCategoryRow: function (data) {
        return requestTool.post('article_category/getArticleCategoryRow', data)
    },
    saveArticleCategoryEdit: function (data) {
        return requestTool.post('article_category/saveArticleCategoryEdit', data)
    },
    saveArticleCategoryDel: function (data) {
        return requestTool.post('article_category/saveArticleCategoryDel', data)
    },
    getCategoryAllTree: function (data) {
        return requestTool.post('article_category/getAllTree', data)
    },
    getCategoryUseTree: function (data) {
        return requestTool.post('article_category/getUseTree', data)
    },
    // 文章管理
    getArticleListPage: function (data) {
        return requestTool.post('article/getArticleListPage', data)
    },
    saveArticleAdd: function (data) {
        return requestTool.post('article/saveArticleAdd', data)
    },
    getArticleRow: function (data) {
        return requestTool.post('article/getArticleRow', data)
    },
    saveArticleEdit: function (data) {
        return requestTool.post('article/saveArticleEdit', data)
    },
    saveArticleDel: function (data) {
        return requestTool.post('article/saveArticleDel', data)
    },
    saveArticleAllDel: function (data) {
        return requestTool.post('article/saveArticleAllDel', data)
    },
    // 广告位置
    getAdTypeListPage: function (data) {
        return requestTool.post('ad_type/getAdTypeListPage', data)
    },
    saveAdTypeAdd: function (data) {
        return requestTool.post('ad_type/saveAdTypeAdd', data)
    },
    getAdTypeRow: function (data) {
        return requestTool.post('ad_type/getAdTypeRow', data)
    },
    saveAdTypeEdit: function (data) {
        return requestTool.post('ad_type/saveAdTypeEdit', data)
    },
    saveAdTypeDel: function (data) {
        return requestTool.post('ad_type/saveAdTypeDel', data)
    },
    getAdTypeAll: function (data) {
        return requestTool.post('ad_type/getAdTypeAll', data)
    },
    // 广告管理
    getAdListPage: function (data) {
        return requestTool.post('ad/getAdListPage', data)
    },
    saveAdAdd: function (data) {
        return requestTool.post('ad/saveAdAdd', data)
    },
    getAdRow: function (data) {
        return requestTool.post('ad/getAdRow', data)
    },
    saveAdEdit: function (data) {
        return requestTool.post('ad/saveAdEdit', data)
    },
    saveAdDel: function (data) {
        return requestTool.post('ad/saveAdDel', data)
    },
    saveAdAllDel: function (data) {
        return requestTool.post('ad/saveAdAllDel', data)
    },
    // seo关键词管理
    getSeoListPage: function (data) {
        return requestTool.post('seo/getSeoListPage', data)
    },
    saveSeoAdd: function (data) {
        return requestTool.post('seo/saveSeoAdd', data)
    },
    getSeoRow: function (data) {
        return requestTool.post('seo/getSeoRow', data)
    },
    saveSeoEdit: function (data) {
        return requestTool.post('seo/saveSeoEdit', data)
    },
    saveSeoDel: function (data) {
        return requestTool.post('seo/saveSeoDel', data)
    },
    // 友情链接
    getLinksListPage: function (data) {
        return requestTool.post('links/getLinksListPage', data)
    },
    saveLinksAdd: function (data) {
        return requestTool.post('links/saveLinksAdd', data)
    },
    getLinksRow: function (data) {
        return requestTool.post('links/getLinksRow', data)
    },
    saveLinksEdit: function (data) {
        return requestTool.post('links/saveLinksEdit', data)
    },
    saveLinksDel: function (data) {
        return requestTool.post('links/saveLinksDel', data)
    }
}
export default contentApis
