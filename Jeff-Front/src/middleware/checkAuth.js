export default function checkAuth(next, isAuthenticated) {
    if (isAuthenticated) {
        next('/')
    } else {
        next('/login');
    }
}
