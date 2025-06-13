<template>
  <RouterLink to="/">   <div>

    <img src="/vite.svg" class="logo" alt="Vite logo" />

  </div> </RouterLink>

  <RouterView />
</template>

<script  lang="ts">
import {defineComponent, onMounted, unref} from "vue";
import {useWebSocket} from './features/web-rtc/useWebSocket.ts'
import {useWebRtcConnections} from "./features/web-rtc/useWebRtcConnections.ts";
import {WEB_SOCKET_EVENTS} from "./constants/constants-web-socket.ts";

export default defineComponent({
  name: "App",
  components: {

  },
  setup() {

    const {setupOnWsMessageCallbacks} = useWebSocket()

    const {
      createPeerOffer,
      confirmPeerOffer ,
      setupPeerAnswer,
      updatePeerIceCandidate,
    } = useWebRtcConnections()

    setupOnWsMessageCallbacks({
    [WEB_SOCKET_EVENTS.RTC_SEND_ME_OFFER]: [createPeerOffer],
    [WEB_SOCKET_EVENTS.RTC_OFFER]: confirmPeerOffer,
    [WEB_SOCKET_EVENTS.RTC_ANSWER]: setupPeerAnswer,
    [WEB_SOCKET_EVENTS.RTC_ICE_CANDIDATE]: updatePeerIceCandidate,

    // [WEB_SOCKET_EVENTS.WS_CONNECTION]: updateWsOnlineClients,
    // [WEB_SOCKET_EVENTS.WS_CLOSE]: [ updateWsOnlineClients ,removeUserOncloseWs],
})

    return {

    }
  }
})
</script>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
