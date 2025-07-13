<template>
<div class="meet-layout">
  <slot></slot>
</div>
</template>

<script>
import {defineComponent} from 'vue'

export default defineComponent({
  name: "MeetLayout",
  setup() {

    return {

    }
  }
})
</script>

<style scoped lang="scss">

.meet-layout {
  width: 100%;
  min-height: 100vh;
  min-width: 100vw;
}

</style>