<template>
  <button class="ui-button" :class="classes" :disabled="disabled">

    <div v-if="loading"> l  </div>
    <slot v-else></slot>
  </button>
  {{size}}
</template>

<script>
import {computed, defineComponent} from 'vue'

const BUTTON_SIZES = ['small', 'normal', 'large']

export default defineComponent({
  name: "UiButton",
  props: {
    size: {
      default: 'normal',
      validator: (value, props) => BUTTON_SIZES.includes(value),
    },
    theme: {
      default: ''
    },
    loading: {
      default: false
    },
    disabled: {
      default: false
    }
  },
  setup(props) {

    const classes = computed(() => {

      return {
        loading: props.loading,
        theme: props.theme,
        size: props.size
      }

    })
    return {
      classes
    }
  }
})
</script>

<style scoped>
@reference "tailwindcss";

.ui-button {

  @apply
  flex
  justify-center
  items-center

  rounded-lg
  border
  border-transparent

  bg-blue-600
  text-white

  hover:bg-blue-700

  focus:outline-hidden
  focus:bg-blue-700

  disabled:opacity-50
  disabled:pointer-events-none

}

.loading {
  @apply
  opacity-90
  pointer-events-none
}

.small {
  @apply
  py-2
  px-3
}

.normal {
  @apply
  py-3
  px-4
}

.large {
  @apply
  py-3
  px-4
  p-4 sm:p-5
}

</style>