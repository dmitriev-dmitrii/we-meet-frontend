import {usersApi} from "@/api/usersApi.js";


export const peerConnections = {};
export const dataChannels = {};
export const mediaStreams = {};

const fetchIceServers = async () => {
    try {
        const {data} = await usersApi.getIceServers()

        webRtcStore.iceServers = data

    } catch (err) {
        console.log('upd err ' , err)
    }
}

export const webRtcStore = {
    peerConnections,
    dataChannels,
    mediaStreams,
    iceServers: [],
    fetchIceServers,
}
window.webRtcStore = webRtcStore
console.log('webRtcStore', webRtcStore)