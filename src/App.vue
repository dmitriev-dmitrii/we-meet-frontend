<template>

  <component :is="currentLayout">

    <RouterView/>

  </component>

</template>

<script>
import {computed, defineComponent, unref} from "vue";
import {useWebSocket} from "@/features/useWebSocket.js";
import {useWebRtcConnections} from "@/features/web-rtc/useWebRtcConnections.js";
import {useMeetStore} from "@/store/meetStore.js";
import {WEB_SOCKET_EVENTS} from "@/constants/web-socket.js";
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import MeetLayout from "@/layouts/MeetLayout.vue";
import {useRoute} from "vue-router";
import {useLocalUserStore} from "@/store/localUserStore.js";

export default defineComponent({
  name: "App",

  components: {
    DefaultLayout,
    MeetLayout
  },
  setup() {
    const {setupOnWsMessageCallbacks} = useWebSocket()
    const {updateMeetUser, removeUserFromMeet} = useMeetStore()
    const {localUserIsConnectedToMeet} = useLocalUserStore()
    const {
      createPeerOffer,
      confirmPeerOffer,
      setupPeerAnswer,
      updatePeerIceCandidate,
    } = useWebRtcConnections()

    const onUserMeetConnected = (payload) => {
      // payload.data.meetUsers.forEach(updateMeetUser)
    }
    const onUserMeetDisconnected = ({fromUser}) => {
      removeUserFromMeet(fromUser.userId)
    }

    setupOnWsMessageCallbacks({
      [WEB_SOCKET_EVENTS.RTC_SEND_ME_OFFER]: createPeerOffer,
      [WEB_SOCKET_EVENTS.RTC_OFFER]: confirmPeerOffer,
      [WEB_SOCKET_EVENTS.RTC_ANSWER]: setupPeerAnswer,
      [WEB_SOCKET_EVENTS.RTC_ICE_CANDIDATE]: updatePeerIceCandidate,

      [WEB_SOCKET_EVENTS.WS_CONNECTION]: [onUserMeetConnected],
      [WEB_SOCKET_EVENTS.WS_CLOSE]: [onUserMeetDisconnected],
    })

    const currentLayout = computed(() => {
      return unref(localUserIsConnectedToMeet) ? MeetLayout : DefaultLayout
    });

    return {
      currentLayout
    }
  }
})
</script>


<style lang="scss" scoped>


/*.logo {*/
/*  height: 2em;*/
/*  padding: 1.5em;*/
/*  will-change: filter;*/
/*  transition: filter 300ms;*/
/*}*/

/*.logo:hover {*/
/*  filter: drop-shadow(0 0 2em #646cffaa);*/
/*}*/

/*.logo.vue:hover {*/
/*  filter: drop-shadow(0 0 2em #42b883aa);*/
//}
</style>
