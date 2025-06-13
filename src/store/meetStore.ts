import {meetApi} from "@/api/meetApi.js";
import {useLocalUserStore} from "@/store/localUserStore";
import {reactive, ref, unref} from "vue";
import {useWebRtcConnections} from "../features/web-rtc/useWebRtcConnections.ts";
import {useWebRtcStore} from "./webRtcStore";
import {createGlobalState} from "@vueuse/core";
import {useWebRtcDataChannels} from "../features/web-rtc/useWebRtcDataChannels.ts";
import {useWebRtcMediaStreams} from "../features/web-rtc/useWebRtcMediaStreams.ts";
import {useWebSocket} from "../features/web-rtc/useWebSocket.ts";

export const useCurrentMeetStore = createGlobalState(() => {

    const {fetchIceServers} = useWebRtcStore()
    const {sendMeOffer, closePeerConnection} = useWebRtcConnections()
    const {closeDataChanel} = useWebRtcDataChannels()
    const {deleteMediaStream} = useWebRtcMediaStreams()
    const {connectToWebSocket} = useWebSocket()

    const {
        localUserAuth,
        localUser
    } = useLocalUserStore()

    const currentMeet = reactive({
        meetId: '',
        ownerUserId: ''
        //TODO readonly export
    })

    const meetUsers = ref({})
    const createMeet = async () => {
        try {

            await localUserAuth()

            const payload = {
                ...unref(localUser),
            }

            const {data} = await meetApi.createMeet(payload)
            currentMeet.meetId = data.meetId
            currentMeet.ownerUserId = data.ownerUserId

        } catch (e) {
            alert('createMeet err' + e.message)
            throw e
        }
    }
    const findMeetById = async ({meetId}) => {
        try {

            const {data} = await meetApi.getMeetById({meetId})
            currentMeet.meetId = data.meetId
            currentMeet.ownerUserId = data.ownerUserId

        } catch (e) {
            alert('findMeetById err' + e.message)
            throw e
        }
    }

    const joinMeet = async () => {
        try {

            await localUserAuth()

            const {meetId} = unref(currentMeet)
            const {userId, userName} = unref(localUser)

            const {data} = await meetApi.joinMeetRequest({meetId, userId, userName})

            await fetchIceServers()
            await connectToWebSocket({meetId, userId})
            await sendMeOffer()

        } catch (e) {
            alert('joinMeet err' + e.message)
            throw e
        }

    }


    const removeUserFromMeet = (remoteUserId) => {

        deleteMediaStream(remoteUserId)
        closeDataChanel(remoteUserId)
        closePeerConnection(remoteUserId)
    }

    return {
        joinMeet,
        findMeetById,
        currentMeet,
        createMeet,
        removeUserFromMeet,
    }
})