import {meetApi} from "@/api/meetApi.js";
import {useWebRtcDataChannels} from "@/features/web-rtc/useWebRtcDataChannels.ts";
import {localUserStore, useLocalUserStore} from "@/store/localUserStore";

import {useWebRtcMediaStreams} from "@/features/web-rtc/useWebRtcMediaStreams.ts";

import {peerConnections} from "@/store/webRtcStore";
import {reactive, ref, unref} from "vue";
import {useWebRtcConnections} from "../features/web-rtc/useWebRtcConnections.ts";

const {sendMeOffer} = useWebRtcConnections()

const {
    closeDataChanel
} = useWebRtcDataChannels()

const {
    deleteMediaStream,
} = useWebRtcMediaStreams()

const {
    closePeerConnection
} = useWebRtcConnections()
const createMeet = async ({password}) => {
    try {
        await localUserStore.auth()

        const payload = {
            userName: localUserStore.userName,
            userId: localUserStore.userId,
            password
        }
        const {data} = await meetApi.createMeet(payload)
        meetStore.meetId = data.meetId
        meetStore.ownerUserId = data.ownerUserId
    } catch (e) {
        alert('createMeet err' + e.message)
        throw e
    }
}

const joinMeet = async () => {
    try {


        await localUserStore.auth()
        const {meetId} = meetStore
        const {userId} = localUserStore

        const {data} = await meetApi.joinMeetRequest({meetId, userId})

        await sendMeOffer()

        const currentUrl = new URL(window.location.href);
        const urlParams = new URLSearchParams(currentUrl.search);

        urlParams.set('meetId', meetId)
        currentUrl.search = urlParams.toString();
        window.history.replaceState(null, '', currentUrl)
    } catch (e) {
        alert('joinMeet err' + e.message)
        throw e
    }

}
const leaveMeet = () => {
    try {
        const currentUrl = new URL(window.location.href);
        const urlParams = new URLSearchParams(currentUrl.search);
        urlParams.delete('meetId');
        currentUrl.search = urlParams.toString();
        window.history.replaceState(null, '', currentUrl)

        meetStore.meetId = ''

        Object.keys(peerConnections).forEach((remoteUserId) => {
            removeUserFromMeet(remoteUserId)
        })

        // closeWebSocket()
    } catch (e) {
        alert('leaveMeet err' + e.message)
        throw e
    }
}

const removeUserFromMeet = (remoteUserId) => {

    deleteMediaStream(remoteUserId)
    closeDataChanel(remoteUserId)
    closePeerConnection(remoteUserId)
}
export const meetStore = {
    meetId: '',
    removeUserFromMeet,
    joinMeet,
    createMeet,
    leaveMeet,
}

const currentMeet = reactive({
    meetId: '',
    ownerUserId: ''
    //TODO readonly export
})

const meetUsers = ref({})

export const useCurrentMeetStore = () => {

    const {
        localUserAuth,
        localUser
    } = useLocalUserStore()

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

            const {data} = await meetApi.joinMeetRequest({meetId, userId , userName})


            await sendMeOffer()

        } catch (e) {
            alert('joinMeet err' + e.message)
            throw e
        }

    }

    return {
        joinMeet,
        findMeetById,
        currentMeet,
        createMeet,
        removeUserFromMeet,
    }
}