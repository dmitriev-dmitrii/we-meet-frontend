<template>
<form @submit.prevent="onSubmitForm" style="display: flex;flex-direction: column">

  <label v-if="!meetId" hidden> password
    <input  v-model="meetPassword">
  </label>

  <UiButton :disabled="true" size="large" type="submit" v-if="!meetId" theme="">
    create meet
  </UiButton>

  <UiButton type="button" @click="copyMeetHref" v-if="meetId">
    copy meet link
  </UiButton>

  <UiButton type="button" @click="toMeet" v-if="meetId">
    to meet =>
  </UiButton>
</form>


</template>

<script>
import {defineComponent, ref, unref} from 'vue'
import {useMeetStore} from "@/store/meetStore.js";

import {useRouter} from "vue-router";
import UiButton from "@/components/ui/UiButton.vue";

export default defineComponent({
  name: "CreateMeetForm",
  components: {UiButton},
  setup() {
    const {createMeet}= useMeetStore()
    const router = useRouter()
    const meetPassword = ref('')
    const meetId = ref('')

    const copyMeetHref = async () => {
      console.log('copyMeetHref', window.location.href)
    }

    const toMeet = async ()=>{
      await router.push( { name:'MeetView' , params:{meetId:unref(meetId)} })
    }

    const onSubmitForm = async () => {

     const res  =  await createMeet({password:unref(meetPassword)})

     meetId.value = res.meetId

    }

    return {
      meetId,
      meetPassword,
      onSubmitForm,
      copyMeetHref,
      toMeet
    }
  }
})
</script>

<style scoped>

</style>