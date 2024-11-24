<template>
  <Transition name="loading">
    <div
      id="loading"
      v-if="!(progress.raw[0] > progress.raw[1])"
    >
      <div class="bg"></div>
    </div>
  </Transition>
</template>

<script lang="ts" setup>
import { progress } from '@/assets/files'

const width = computed(() => `translateY(-${progress.percentage}%)`)
</script>

<style lang="stylus" scoped>
#loading
  position fixed
  z-index 10
  display flex
  justify-content center
  align-items flex-end
  inset 0

  .bg
    position absolute
    top 0
    right 0
    width 100%
    height 100%
    background-color rgba(0, 0, 0, 0.7)
    transition 0.5s linear
    transform v-bind(width)
</style>
