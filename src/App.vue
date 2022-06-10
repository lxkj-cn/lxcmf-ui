<template>
    <router-view />
</template>
<script setup>
import { useStore } from 'vuex'
const store = useStore()
if (sessionStorage.getItem('store')) {
    store.replaceState(
        Object.assign({},
            store.state,
            JSON.parse(sessionStorage.getItem('store'))
        )
    )
}

// 监听，在页面刷新时将vuex里的信息保存到sessionStorage里
window.addEventListener('beforeunload', () => {
    sessionStorage.setItem('store', JSON.stringify(store.state))
})
</script>
<style lang="scss">
html,
body {
    margin: 0;
    padding: 0;
    background-color: #eee;
}

#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}

#nav {
    padding: 30px;

    a {
        font-weight: bold;
        color: #2c3e50;

        &.router-link-exact-active {
            color: #42b983;
        }
    }
}
</style>
