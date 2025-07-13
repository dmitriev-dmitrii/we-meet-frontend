<template>

  <div v-if="isLoading">
    <h2 style="text-align: center"> Loading... </h2>
    <!--  todo  add loader  -->
  </div>

  <div v-if="!isLoading && !currentMeetId">
    <h2 style="text-align: center"> Cant Found Meet </h2>
<!--    todo push err page  -->
  </div>

  <div v-if="!isLoading && currentMeetId" class="meet-view">

    <MeetApp/>

    <div class="meet-view_about" v-if="!localUserIsConnectedToMeet">
      <h2>  Lets join this meet </h2>
<!--      <p> online users : 99 </p>-->
    </div>

    <JoinMeetForm v-if="!localUserIsConnectedToMeet"/>
  </div>

</template>

<script>

import LocalMedaStream from "@/components/meet-app/MediaStreams/LocalMedaStream.vue";
import {useLocalUserStore} from "@/store/localUserStore.js";
import {defineComponent, onMounted, ref, unref} from 'vue';
import JoinMeetForm from "@/components/JoinMeetForm.vue";
import MeetApp from "@/components/meet-app/MeetApp.vue";
import {useMeetStore} from "@/store/meetStore.js";
import {useRouteParams} from '@vueuse/router'
import {onBeforeRouteLeave} from "vue-router";
import {useWebSocket} from "@/features/useWebSocket.js";

export default defineComponent({
  name: "MeetView",
  components: {MeetApp, JoinMeetForm, LocalMedaStream},

  setup() {
    const {closeWebSocket} = useWebSocket()
    const {findMeetById, setCurrentMeet, currentMeetId} = useMeetStore()
    const {localUserIsConnectedToMeet, initLocalMediaStream} = useLocalUserStore()

    const isLoading = ref(true)

    const meetId = useRouteParams('meetId')

    onMounted(async () => {

      try {
        isLoading.value = true

        const res = await findMeetById(unref(meetId))
        await initLocalMediaStream()

        setCurrentMeet(res.meetId)

      } catch (e) {

      } finally {
        isLoading.value = false
      }

    })

    onBeforeRouteLeave(() => {
      setCurrentMeet('')
      closeWebSocket()

    })

    return {
      currentMeetId,
      localUserIsConnectedToMeet,
      isLoading
    }
  }
})
</script>

<style lang="scss" scoped>
.meet-view {
  display: flex;
  flex-direction: column;

  border-radius: $base-border-radius;
  overflow: hidden;
  border: .5px solid;

  &_about {
    text-align: center;
  }

}
</style>