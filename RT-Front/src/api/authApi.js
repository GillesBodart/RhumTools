import axios from "axios"

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL
axios.defaults.withCredentials = true;

const register = async (userRegister) => {
    return await axios.post(`/authentication/register`, {
        email: userRegister.email,
        password: userRegister.password,
        firstName: userRegister.firstName,
        lastName: userRegister.lastName
    })
}
const login = async (email, password) => {
    return await axios.post(`/authentication/login`, {email: email, password: password})
}

const logout = async () => {
    return await axios.post(`/authentication/logout`)
}

export default {
    login, register, logout
}
