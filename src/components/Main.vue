<template>
  <div
    id="main"
    @click.stop="onClick"
  >
    <Transition name="count">
      <div
        v-show="progress.raw[0] > progress.raw[1]"
        class="count"
      >
        {{ count }}
      </div>
    </Transition>
    <div
      class="bg herta"
      :class="{ 'semi-transparent': progress.raw[0] >= progress.raw[1] }"
    >
      <img
        :src="IMAGES[0]"
        class="gif"
      />
    </div>
    <div
      class="herta"
      v-for="item in hertaList"
      :style="{ animation: item[1].animation }"
      :key="item[0]"
    >
      <img
        :src="IMAGES[item[1].img ?? 0]"
        class="gif"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getRandomAudio, IMAGES, progress } from '@/assets/files'

interface Herta {
  audio: HTMLAudioElement
  animation: string
  img?: number
}

const count = ref(Number(localStorage.getItem('herta-count')) || 0)

const hertaList = ref(new Map<number, Herta>())

const onClick = () => {
  const key = Date.now()
  let audio = new Audio()
  const random = getRandomAudio()
  audio.src = random.src
  audio.oncanplay = () => {
    let time = audio.duration * 1000
    const herta: Herta = {
      audio,
      animation: `herta-${Math.random() > 0.5 ? 'left' : 'right'} ${time - 200}ms linear forwards`
    }
    if (random.img !== undefined) {
      herta.img = random.img
    }
    hertaList.value.set(key, herta)
    audio.play()
    count.value += 1
    localStorage.setItem('herta-count', String(count.value))
  }
  audio.onended = () => {
    hertaList.value.delete(key)
  }
}
</script>

<style lang="stylus" scoped>
#main
  position fixed
  cursor pointer
  inset 0

  .count
    position absolute
    top 5px
    right 5px
    color #ddd

  .bg
    transition opacity 1s
    transition-delay 0.5s

  .herta
    position absolute
    display flex
    justify-content center
    align-items flex-end
    pointer-events none
    inset 0

    .gif
      max-width 100%
      max-height 100%
      width 100%
      height 100%
      object-fit contain

  .semi-transparent
    opacity 0.33

.count-enter-active
  transition 0.5s

.count-enter-from
  transform translateY(-100%)
</style>

<style lang="stylus">
@keyframes herta-left
  from
    transform translate3d(0, 0, 0)

  to
    transform translate3d(-100%, 0, 0)

@keyframes herta-right
  from
    transform translate3d(0, 0, 0)

  to
    transform translate3d(100%, 0, 0)
</style>
