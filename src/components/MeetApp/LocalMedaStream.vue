<template>
  <div style="display: flex;flex-direction: column">

    <video autoplay muted ref="videoTagElement"></video>

    <label>
      audio
      <input v-model="localUserMediaState.audio" type="checkbox">
    </label>
    <label>
      video
      <input v-model="localUserMediaState.video"  type="checkbox">
    </label>


  </div>
</template>

<script>
import {defineComponent, onMounted, unref, useTemplateRef, watch} from 'vue'
import {localUserStore, useLocalUserStore} from "@/store/localUserStore";

export default defineComponent({
  name: "LocalMedaStream",
  setup() {
    const videoTagElement = useTemplateRef('videoTagElement')

    const {
      initLocalMediaStream,
      localUserStreams,
      localUserMediaState
    } = useLocalUserStore();

    watch(localUserStreams, () => {
      videoTagElement.value.srcObject = unref(localUserStreams)
    })




    onMounted(async () => {

      await initLocalMediaStream()

      if (import.meta.env.DEV) {
        localUserStore.audio = false
      }

    })

    return {
      localUserMediaState
    }
  }
})
</script>

<style scoped>

</style>