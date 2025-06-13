import {usersApi} from "@/api/usersApi.ts";
import {reactive, ref} from "vue";
import {createGlobalState} from "@vueuse/core";

export const useWebRtcStore = createGlobalState(() => {

    const peerConnections = reactive({});
    const dataChannels =  reactive({});
    const remoteMediaStreams =  reactive({});

    const iceServers = ref([])
    const fetchIceServers = async () => {
        try {

            if (iceServers.value.length) {
                return iceServers.value
            }

            const {data} = await usersApi.getIceServers()

            iceServers.value = data

            return data

        } catch (err) {
            console.log('fetchIceServers err ', err)
        }
    }


    return {
        peerConnections,
        dataChannels,
        remoteMediaStreams,
        fetchIceServers,
        iceServers
    }
})