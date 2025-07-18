import {useWebRtcStore} from "@/store/webRtcStore.js";
import {useLocalUserStore} from "@/store/localUserStore.js";
import {useEventBus} from "@vueuse/core";
import {WEB_RTC_EVENT_BUS_INSTANCE, WEB_RTC_EVENT_BUS_TYPES} from "@/constants/event-bus.js";
import {unref} from "vue";

const {
    peerConnections,
    mediaStreams
} = useWebRtcStore()

const {
    localUserMediaStreams
} = useLocalUserStore()

export const useWebRtcMediaStreams = () => {
    const webRtcEventBus = useEventBus(WEB_RTC_EVENT_BUS_INSTANCE)
    const setupMediaStreamToPeer = async ({userId, userName}) => {

        const localMediaStream = unref(localUserMediaStreams)

        if (localMediaStream instanceof MediaStream) {
            localMediaStream.getTracks().forEach(track => {
                peerConnections[userId].addTrack(track, localMediaStream)
            });

        }

        peerConnections[userId].ontrack = function (e) {

            mediaStreams[userId] = {
                ...mediaStreams[userId],
                ...{[e.track.kind]: e}
            }

            webRtcEventBus.emit({
                type: WEB_RTC_EVENT_BUS_TYPES.PEER_REMOTE_USER_ON_TRACK,
                fromUser: {userId, userName},
                data: {
                    mediaTrackKind: e.track.kind
                }
            })
        }
    }

    const deleteMediaStream = (userId) => {
        delete mediaStreams[userId]
    }

    return {
        deleteMediaStream,
        setupMediaStreamToPeer,
    }
}