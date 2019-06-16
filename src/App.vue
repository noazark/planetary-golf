<template>
  <div id="app">
    <canvas ref="canvas" width="500" height="300" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { orbit } from "./lib/orbit";

@Component({
  mounted() {
    orbit(this.$refs.canvas as HTMLCanvasElement);
  }
})
export default class App extends Vue {}
</script>

<style>
body {
  background: black;
}
</style>
