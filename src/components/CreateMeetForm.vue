<template>
  <form @submit.prevent='onSubmitForm' style="display: flex; flex-direction: column">

    <template v-if="!currentMeet.meetId" >
      <label>
        <input v-model="localUser.userName" type="text">
        name
      </label>

      <label v-if="!currentMeet.meetId">
        <input v-model="meetPassword" type="text">
        password
      </label>
      <button  type="submit"> create meet </button>
    </template>

    <template v-else>
      <button type="button" @click="copyMeetHref"> copyMeetHref </button>
      <button type="button" @click="toMeetView" > to meet page => </button>
    </template>

  </form>


</template>

<script>
import {defineComponent, ref, unref} from 'vue'
import {useLocalUserStore} from "@/store/localUserStore";
import {useCurrentMeetStore} from "@/store/meetStore";
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