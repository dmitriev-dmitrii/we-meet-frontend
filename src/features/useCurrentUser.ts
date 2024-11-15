import {computed, nextTick, ref, unref} from "vue";
import adapter from 'webrtc-adapter';
import axios from "axios";
import {MEET_WEB_SOCKET_EVENTS} from "@/constatnts/meetWebSocket";


import {useWebSocket  } from "@/features/useWebSocket";


const {connectToWebSocket,currentWebSocketState,sendWebSocketMessage} = useWebSocket()

const   userName= ref(adapter.browserDetails.browser);
const   userId = ref('');

const userIsAuth = computed(()=> {
    return Boolean(unref(userId) && unref(userName) && unref(currentWebSocketState)=== WebSocket.OPEN )
})


const   isVideoOn = ref(true);
const   isAudioOn = ref(true);

const   userStream = ref( '');

export const useCurrentUser = () => {
    const initUserStream = async ()=> {
    try {

      const userLocalStream =  await window.navigator.mediaDevices.getUserMedia({ video:unref(isVideoOn) , audio: unref(isAudioOn) });
      const tracks =   userLocalStream.getTracks()
        console.log('tracks',tracks)
        // @ts-ignore
        userStream.value  =  userLocalStream
        
      }

        catch (e) {
            console.log('initUserStream',e)
       }

    }

    const userAuth = async ()=> {

        if (unref( userIsAuth)  ) {
            return
        }

        if (unref(currentWebSocketState) !== WebSocket.OPEN) {
            connectToWebSocket()
            await nextTick()
        }

        const url = import.meta.env.VITE_WE_MEET_API_URL + '/api/users/auth'

        const payload = {
            userName: unref(userName),
        }

        const { data} = await axios.post(url, payload,   {
            withCredentials: true
        })

        userId.value = data.userId
        userName.value = data.userName


        const message = {
            type:  MEET_WEB_SOCKET_EVENTS.USER_WEB_SOCKET_AUTH,
            userId : unref(userId),
        }

       await sendWebSocketMessage(message);

        return
    }

    return {
        isAudioOn,
        isVideoOn,
        userAuth,
        userIsAuth,
        initUserStream,
        userStream,
        userId,
        userName,
    }
}

// stopVideo.addEventListener("click", () => {
//   const enabled = myVideoStream.getVideoTracks()[0].enabled;
//   if (enabled) {
//     myVideoStream.getVideoTracks()[0].enabled = false;
//     html = `<i class="fas fa-video-slash"></i>`;
//     stopVideo.classList.toggle("background__red");
//     stopVideo.innerHTML = html;
//   } else {
//     myVideoStream.getVideoTracks()[0].enabled = true;
//     html = `<i class="fas fa-video"></i>`;
//     stopVideo.classList.toggle("background__red");
//     stopVideo.innerHTML = html;
//   }
// });
