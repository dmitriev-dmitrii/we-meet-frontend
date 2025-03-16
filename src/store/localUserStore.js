import {usersApi} from "@/api/usersApi.js";
import {DATA_CHANNELS_MESSAGE_TYPE} from "@/constants/constants.js";
import {useWebRtcDataChannels} from "@/features/web-rtc/useWebRtcDataChannels.js";

const {sendDataChanelMessage} = useWebRtcDataChannels()

export const localUserStore = {

    userId : '',

    userName : '',

    userStreams : {

    },

    initLocalMediaStream : async () => {

        localUserStore.userStreams = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        //cb navigator.mediaDevices.ondevicechange TODO
        //TODO many media input device - select?

        return localUserStore.userStreams
    },
    sendMediaTrackLocalState :  () => {
    // отправить участникам мита состояние медиа треков
        const payload = {
            type: DATA_CHANNELS_MESSAGE_TYPE.DATA_CHANEL_UPDATE_MEDIA_TRACK_STATE,
            data: {
                video: localUserStore.video,
                audio: localUserStore.audio
            }
        }

        sendDataChanelMessage(payload)
    },

    get audio() {
        try {
            return this.userStreams.getAudioTracks().some((item) => item.enabled)
        } catch (e) {
            console.log('audio get err', e)
            return false
        }
    },

    set audio(value) {
        try {
            this.userStreams.getAudioTracks().find(({readyState}) => {
                return readyState === 'live'
            }).enabled = !!value
            this.sendMediaTrackLocalState()
            return value
        } catch (e) {
            console.log('audio set err', e)
            return false
        }
    },

    get video() {
        try {
            return this.userStreams.getVideoTracks().some((item) => item.enabled)
        } catch (e) {
            console.log('video get err', e)
            return false
        }
    },

    set video(value) {
        try {
            this.userStreams.getVideoTracks().find(({readyState}) => {
                return readyState === 'live'
            }).enabled = value
            this.sendMediaTrackLocalState()
            return value
        } catch (e) {
            console.log('video set err', e)
            return false
        }
    },

    auth : async ()=> {

        const {userName} = localUserStore

        const payload = {
            userName
        }

        const {data} =   await usersApi.userAuth(payload)

        localUserStore.userName = data.userName
        localUserStore.userId = data.userId
    },
}


