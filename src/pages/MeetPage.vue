<template>

  <AuthForm v-if="!userStore.isAuth" />

  <Meet />

  <div v-if="err">
    err {{ err }}
  </div>

</template>

<style>

</style>
<script setup lang="ts">
import {onMounted, ref, unref, useTemplateRef} from "vue";
import {onBeforeRouteLeave, useRoute, useRouter} from "vue-router";
import {useMeetStore} from "@/store/useMeetStore";
import AuthForm from "@/components/AuthForm.vue";

import Meet from "@/components/meet/Meet.vue";
import {useUserStore} from "@/store/useUserStore";

const userStore = useUserStore()
const meetStore = useMeetStore()

const route = useRoute()


const loading = ref(true)
const err = ref('')





onMounted(async ()=> {

  try {
    const { params } = unref(route)

    await meetStore.findMeetById( params.id as string )
    err.value = ''
  } catch (error) {

    err.value = String(error)

  }
finally {
    loading.value = false
  }

})


onBeforeRouteLeave( async ()=> {

  await userStore.sendLogoutRequest()
})


</script>

<style>
.my-stream{
  border: dodgerblue 2px solid;
  border-radius: 5px;
}
</style>