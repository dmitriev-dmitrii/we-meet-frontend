<template>

  <form @submit.prevent="onSubmitForm ">

    <label>
      meetPassword
      <input v-model="meetPassword">
    </label>

    <button type="submit"> join meet </button>

  </form>

</template>

<script>
import {defineComponent, ref, unref} from 'vue'
import {useCurrentMeetStore} from "@/store/meetStore.js";


export default defineComponent({
  name: "JoinMeetForm",
  setup() {

    const meetPassword = ref('')
    const isLoading = ref(false)
    const {joinMeet} = useCurrentMeetStore()
    const onSubmitForm = async () => {

      try {
        isLoading.value = true

        await joinMeet()

      } catch (e) {

        console.log(e)
      } finally {

        isLoading.value = false

      }
    }

    return {
      onSubmitForm,
      meetPassword
    }
  }
})
</script>

<style scoped>

</style>