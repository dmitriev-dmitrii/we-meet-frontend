import {localUserStore} from "@/store/localUserStore";
import {BUS_EVENTS} from "@/constants/constants.ts";
import {useEventBus} from "@/features/useEventBus.js";
import {useWebRtcStore} from "../../store/webRtcStore.ts";
import {useLocalUserStore} from "../../store/localUserStore.ts";
import {unref} from "vue";

const {remoteMediaStreams, peerConnections} = useWebRtcStore()
const {localUserStreams} =  useLocalUserStore()
export const useWebRtcMediaStreams = () => {

    const {dispatchEvent} = useEventBus()
    const setupMediaStreamToPeer = async ({remoteUserId}) => {

        if (localUserStore.userStreams?.active) {
            localUserStore.userStreams.getTracks().forEach(track => {
                peerConnections[remoteUserId].addTrack(track, unref(localUserStreams))
            });
        }

        peerConnections[remoteUserId].ontrack = function (e) {

            remoteMediaStreams[remoteUserId] = {
                ...remoteMediaStreams[remoteUserId],
                ...{[e.track.kind]: e}
            }

            dispatchEvent(BUS_EVENTS.UPDATE_REMOTE_USER_MEDIA_STREAM_TRACK, {remoteUserId})
        }

    }

    const deleteMediaStream = (remoteUserId) => {
        delete remoteMediaStreams[remoteUserId]
    }

    return {
        deleteMediaStream,
        setupMediaStreamToPeer,
    }
}