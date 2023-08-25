import axios from "axios"

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL
axios.defaults.withCredentials = true;

const fetchUserinfo = async () => {
    return await axios.get(`/users/me`)
}
const fetchUserById = async (userId) => {
    return await axios.get(`/users/${userId}`)
}
const fetchAllUsers = async () => {
    return await axios.get(`/users`)
}
const fetchStat = async (userId) => {
    return await axios.get(`/users/${userId}/statistics`)
}
const makeGuess = async (userList) => {
    return await axios.post(`/users/profiler/guess`, {users: userList})
}

export default {
    fetchUserById, fetchAllUsers, fetchStat, makeGuess, fetchUserinfo
}
