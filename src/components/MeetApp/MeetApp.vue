<template>

  <LocalMedaStream/>

</template>

<script lang="ts">
import {defineComponent} from 'vue'
import LocalMedaStream from "./LocalMedaStream.vue";

export default defineComponent({
  name: "MeetApp",
  components: {LocalMedaStream},
  setup() {

    return {}
  }
})
</script>

<style scoped>

</style>