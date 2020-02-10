<template>
  <div @click="clickHello()">
    {{hello}}
  </div>
</template>

<script>
import card from '@/components/card'

export default {
  data () {
    return {
      hello: 'Hello mpvue'
    }
  },

  components: {
    card
  },

  methods: {
    clickHello () {
      console.log('Hello mpvue')
    }
  },

  created () {
    // let app = getApp()
  }
}
</script>

<style scoped>

</style>
