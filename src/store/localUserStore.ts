import {usersApi} from "@/api/usersApi.ts";
import {useWebRtcDataChannels} from "@/features/web-rtc/useWebRtcDataChannels.ts";
import {reactive, shallowRef, unref, watch} from "vue";
import {DATA_CHANNELS_MESSAGE_TYPE} from "../constants/constants-web-rtc.ts";
import {createGlobalState} from "@vueuse/core";
export const  useLocalUserStore = createGlobalState(() => {

    const {sendDataChanelMessage} = useWebRtcDataChannels();

    const localUser = reactive({
        userId: '',
        userName: '',
    })

    const localUserStreams = shallowRef({})

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
});


export const localUserStore = {

    userId: '',

    userName: '',

    userStreams: {},

}


