import {usersApi} from "@/api/usersApi.ts";
import {BUS_EVENTS, DATA_CHANNELS_MESSAGE_TYPE} from "@/constants/constants.js";
import {useWebRtcDataChannels} from "@/features/web-rtc/useWebRtcDataChannels.ts";
import {useEventBus} from "@/features/useEventBus.js";
import {reactive, shallowRef, unref, watch} from "vue";

const {sendDataChanelMessage} = useWebRtcDataChannels()
const {dispatchEvent} = useEventBus()


const localUser = reactive({
    userId: '',
    userName: '',
})
const localUserStreams = shallowRef()

const localUserMediaState = reactive({
    audio: true,
    video: true,
})

watch(localUserMediaState , ({audio,video})=> {

        unref(localUserStreams).getAudioTracks().find(({readyState}) => {
            return readyState === 'live'
        }).enabled = audio

        unref(localUserStreams).getVideoTracks().find(({readyState}) => {
            return readyState === 'live'
        }).enabled = video


        // отправить всем участникам мита состояние медиа треков по дата каналу
        const payload = {
            type: DATA_CHANNELS_MESSAGE_TYPE.DATA_CHANEL_UPDATE_MEDIA_TRACK_STATE,
            data: {
                video,
                audio
            }
        }

        sendDataChanelMessage(payload)
})

export const useLocalUserStore = () => {
    const localUserAuth = async () => {

        const {data} = await usersApi.userAuth(unref(localUser))

        localUser.userId = data.userId
        localUser.userName = data.userName
    }

  const  initLocalMediaStream =  async () => {
        try {
            localUserStreams.value = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });

            localUserMediaState.audio =  unref(localUserStreams).getAudioTracks().some((item) => item.enabled)
            localUserMediaState.audio =  unref(localUserStreams).getVideoTracks().some((item) => item.enabled)

            //cb navigator.mediaDevices.ondevicechange TODO
            //TODO many media input device - select?

        } catch (e) {
            console.log('initLocalMediaStream err', e)
        }
        finally {

        }
    }



    return {
        initLocalMediaStream,
        localUserAuth,
        localUser,
        localUserStreams,
        localUserMediaState
    }
}


export const localUserStore = {

    userId: '',

    userName: '',

    userStreams: {},

    initLocalMediaStream: async () => {
        try {
            const {active} = localUserStore.userStreams = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });
            //cb navigator.mediaDevices.ondevicechange TODO
            //TODO many media input device - select?

        } catch (e) {
            console.log('initLocalMediaStream err', e)
        }
        finally {
            dispatchEvent( BUS_EVENTS. LOCAL_MEDIA_PERMISSIONS_UPDATED )
        }
    },
    sendMediaTrackLocalState: () => {
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
            return false
        }
    },

    get video() {
        try {
            return this.userStreams.getVideoTracks().some((item) => item.enabled)
        } catch (e) {

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

            return false
        }
    },

    auth: async () => {

        const {userName} = localUserStore

        const payload = {
            userName
        }

        const {data} = await usersApi.userAuth(payload)

        localUserStore.userName = data.userName
        localUserStore.userId = data.userId
    },


}


