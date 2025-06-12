import {usersApi} from "@/api/usersApi.js";
import {ref} from "vue";


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


const  iceServers = ref([])

export const useWebRtcStore = ()=>{

    const fetchIceServers = async () => {
        try {

            if (iceServers.value.length ) {
                return
            }

            const {data} = await usersApi.getIceServers()

            iceServers.value = data

        } catch (err) {
            console.log('fetchIceServers err ' , err)
        }
    }


    return {
        fetchIceServers,
        iceServers
    }
}