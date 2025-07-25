import axios from "axios";

const USERS_API_URL = import.meta.env.VITE_WE_MEET_API_URL + '/api/users';

const userAuth = (payload) => {
    return axios.post(`${USERS_API_URL}/auth`, payload)
}

const getIceServers = () => {
    return axios.get(`${USERS_API_URL}/ice-servers`)
}

export const usersApi = {
    userAuth,
    getIceServers
}