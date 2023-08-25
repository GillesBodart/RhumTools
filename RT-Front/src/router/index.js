import Router from 'vue-router'
import checkAuth from '../middleware/checkAuth.js'

const isAuthenticated = true
const router = new Router({
    routes: [],
    mode: 'history'
})
router.beforeEach((to, from, next) => {
    checkAuth(next, isAuthenticated)
});
