const getAudioUrl = (name: string) => new URL(`./audio/${name}`, import.meta.url).href
const getImageUrl = (name: string) => new URL(`./images/${name}`, import.meta.url).href

export const AUDIO = [
  {
    src: 'gululu.mp3',
    weight: 5
  },
  {
    src: 'gururu.mp3',
    weight: 5
  },
  {
    src: '转圈圈.mp3',
    weight: 5
  },
  {
    src: '转圈圈咯.mp3',
    weight: 5
  },
  {
    src: '要坏掉了.mp3',
    img: 1,
    weight: 1
  }
]

export const IMAGES: [string, string] = ['herta1.webp', 'herta2.webp']

export const progress: {
  raw: [number, number]
  percentage: number
} = reactive({
  raw: [0, AUDIO.length + IMAGES.length],
  percentage: computed(() => ((progress.raw[0] / progress.raw[1]) * 100) | 0)
})

export const getRandomAudio = () => {
  const weights: number[] = []
  AUDIO.forEach((item, index) => {
    weights.push(item.weight + (weights[index - 1] ?? 0))
  })
  const random = Math.random() * weights[weights.length - 1]
  return AUDIO[weights.findIndex((weight) => weight > random)]
}

const getObjectURL = (url: string) => {
  return new Promise<string>((resolve) => {
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        const blobUrl = URL.createObjectURL(blob)
        resolve(blobUrl)
      })
      .catch((error) => {
        console.error(error)
      })
      .finally(() => {
        progress.raw[0] += 1
      })
  })
}

const preload = () => {
  const promises = []

  for (const i in AUDIO) {
    AUDIO[i].src = getAudioUrl(AUDIO[i].src)
    promises.push(getObjectURL(AUDIO[i].src).then((result) => (AUDIO[i].src = result)))
  }
  for (const i in IMAGES) {
    IMAGES[i] = getImageUrl(IMAGES[i])
    promises.push(getObjectURL(IMAGES[i]).then((result) => (IMAGES[i] = result)))
  }

  Promise.all(promises).finally(() =>
    setTimeout(() => {
      progress.raw[0] += 1
    }, 500)
  )
}
preload()
