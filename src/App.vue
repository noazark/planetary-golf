<template>
  <div id="app">
    <canvas
      ref="canvas"
      width="500"
      height="300"
    />
  </div>
</template>

<script>
import {orbit} from './lib/orbit'

export default {
  mounted() {
    orbit(this.$refs.canvas)
  }
}
</script>