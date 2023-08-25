import authApi from "../api/authApi.js";
import userApi from "../api/userApi.js";

const logout = async ({commit}) => {
    await authApi.logout()
    commit("setAuthenticated", false)
}
const login = async ({commit, state, dispatch}, loginForm) => {
    await authApi.login(loginForm.email, loginForm.password)
        .then(async (res) => {
            if (res.status > 200) {
                commit("setAuthenticated", false)
            } else {
                commit("setAuthenticated", true)
            }
        })
        .catch((e) => {
            console.log(e)
        })
    if (state.isAuthenticated) {
        await dispatch("_fetchUserInfo")
    }

}
const _fetchUserInfo = async ({commit}) => {
    await userApi.fetchUserinfo()
        .then(({data}) => {
            commit("setUserInfo", data)
        })
}
export default {
    login, logout, _fetchUserInfo
}
