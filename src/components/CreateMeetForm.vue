<template>
  <form @submit.prevent='onSubmitForm' style="display: flex; flex-direction: column">

    CreateMeetForm

    <label>
      <input v-model="localUser.userName" type="text">
      name
    </label>

    <label>
      <input v-model="meetPassword" type="text">
      password
    </label>




    <div v-if="currentMeet.meetId">
      <button @click="copyMeetHref"> submit</button>
      <button @click="toMeetView" type="button"> to meet page => </button>
    </div>
    <div  v-else>
      <button  type="submit"> submit</button>
    </div>

  </form>


</template>

<script>
import {defineComponent, ref, unref} from 'vue'
import {useLocalUserStore} from "@/store/localUserStore.js";
import {useCurrentMeetStore} from "@/store/meetStore.js";
import {useRouter} from "vue-router";


export default defineComponent({
  name: "CreateMeetForm",
  setup() {
    const {localUser} = useLocalUserStore()
    const {
      createMeet,
      currentMeet
    } = useCurrentMeetStore()
    const router = useRouter()

    const meetPassword = ref('')
    const isLoading = ref(false)
    const onSubmitForm = async () => {

      try {
        isLoading.value = true

        await createMeet()

      } catch (e) {

        console.log(e)
      } finally {

        isLoading.value = false

      }
    }
    const copyMeetHref = async () => {
      console.log('copyMeetHref', window.location.href)
    }

    const toMeetView = async ()=> {

      const {meetId} = unref(  currentMeet )

      await router.push({
        name : 'MeetView',
        params: {
          meetId
        }
      })

    }

    return {
      toMeetView,
      currentMeet,
      onSubmitForm,
      copyMeetHref,
      meetPassword,
      localUser
    }
  }
})
</script>

<style scoped>

</style>