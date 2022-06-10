import { createStore } from 'vuex'

export default createStore({
    state: {
        token: '',
        limit: 10,
        asynRouter: []
    },
    mutations: {
        INSERT_TOKEN: function (state, token) {
            state.token = token
        },
        SET_ROUTER: function (state, router) {
            state.asynRouter = router
        },
        SET_LIMIT: function (state, num) {
            state.limit = num
        },
        GET_ROUTER: function (state) {
            return state.asynRouter
        }
    },
    actions: {
        setToken (context, token) {
            context.commit('INSERT_TOKEN', token)
        },
        setLimit (context, num) {
            context.commit('SET_LIMIT', num)
        },
        setRouter (context, router) {
            context.commit('SET_ROUTER', router)
        },
        getRouter (context) {
            context.commit('GET_ROUTER')
        }
    },
    modules: {
    }
})
