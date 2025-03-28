import {meetApi} from "@/api/meetApi.js";
import {useWebRtcDataChannels} from "@/features/web-rtc/useWebRtcDataChannels.js";
import {localUserStore} from "@/store/localUserStore.js";
import {useWebSocket} from "@/features/useWebSocket.js";
import {useWebRtcMediaStreams} from "@/features/web-rtc/useWebRtcMediaStreams.js";
import {useWebRtcConnections} from "@/features/web-rtc/useWebRtcConnections.js";
import {peerConnections} from "@/store/webRtcStore.js";

const {sendMeOffer} = useWebRtcConnections()

const {closeWebSocket, connectToWebSocket} = useWebSocket()

const {
    deleteDataChanel
} = useWebRtcDataChannels()

const {
    deleteMediaStream,
} = useWebRtcMediaStreams()

const {
    deletePeerConnection
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
    }
}

const joinMeet = async () => {
    try {


        await localUserStore.auth()
        const {meetId} = meetStore
        const {userId} = localUserStore

        const {data} = await meetApi.joinMeetRequest({meetId, userId})

        await connectToWebSocket()
        await sendMeOffer()

        const currentUrl = new URL(window.location.href);
        const urlParams = new URLSearchParams(currentUrl.search);

        urlParams.set('meetId', meetId)
        currentUrl.search = urlParams.toString();
        window.history.replaceState(null, '', currentUrl)
    } catch (e) {
        alert('joinMeet err' + e.message)
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

        closeWebSocket()
    } catch (e) {
        alert('leaveMeet err' + e.message)
    }
}

const removeUserFromMeet = (remoteUserId) => {

    deleteMediaStream(remoteUserId)
    deleteDataChanel(remoteUserId)
    deletePeerConnection(remoteUserId)
}
export const meetStore = {
    meetId: '',
    removeUserFromMeet,
    joinMeet,
    createMeet,
    leaveMeet,
}


