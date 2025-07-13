<template>

  <div class="default-layout">
    <div style="text-align: center" class="header" :class="{ mounted : isMounted }">
      <router-link to="/" style="margin: 0 auto">
        <h1 style="display: inline-flex; justify-content: center; align-items: center;">
          We Meet

          <img src="/vite.svg" class="logo" alt="Vite logo"/>

        </h1>
      </router-link>
    </div>


    <div>

    </div>

    <slot></slot>

  </div>
</template>

<script>
import {computed, defineComponent, onMounted, ref} from 'vue'

export default defineComponent({
  name: "DefaultLayout",
  setup() {
    const isMounted = ref(false)
    //
    // onMounted( setTimeout(()=>{
    //   isMounted.value = true
    // }, 300))

    return {
      isMounted
    }
  }
})
</script>

<style scoped lang="scss">

.default-layout {
  max-width: 600px;
  margin: 0 auto;
}

//.header {
//  font-size: 6rem;
//  letter-spacing: -10rem;
//  transition: letter-spacing 0.5s 0.5s ease, opacity 0.3s 0.5s linear, font-size 0.3s 1.3s;
//  opacity: 0;
//}
//
//.header.mounted {
//  font-size: 2rem;
//  letter-spacing: 0;
//  opacity: 1;
//}


</style>