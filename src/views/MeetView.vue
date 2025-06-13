<template>
  <div style="display: flex;justify-content: center;flex-direction: column;">
    <MeetApp/>
    <JoinMeetForm/>
  </div>

</template>

<script>
import {defineComponent, onMounted, unref} from 'vue'
import {useRoute, useRouter} from "vue-router";
import {useCurrentMeetStore} from "@/store/meetStore";
import JoinMeetForm from "@/components/JoinMeetForm.vue";
import MeetApp from "@/components/MeetApp/MeetApp.vue";
import {useWebRtcStore} from "@/store/webRtcStore.js";

export default defineComponent({
  name: "Meet",
  components: {
    MeetApp,
    JoinMeetForm
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const {fetchIceServers} = useWebRtcStore()

    const {
      currentMeet,
      findMeetById,
    } = useCurrentMeetStore()


    onMounted(async () => {

      try {

        if (currentMeet.meetId) {
          return
        }

        const {params} = unref(route)
        const {meetId} = params
        await findMeetById({meetId})

      } catch (e) {
        await router.push({name: 'ErrorView'})
      } finally {
        await fetchIceServers()
      }


    })

    return {
      currentMeet
    }
  }
})
</script>

<style scoped>

</style>