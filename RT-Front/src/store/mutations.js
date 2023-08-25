const setAuthenticated = (state, authStatus) => {
    state.isAuthenticated = authStatus
}
const setUserInfo = (state, userInfo) => {
    state.userProfiles = userInfo
}

export default {
    setAuthenticated, setUserInfo
}
