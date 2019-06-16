<template>
  <div id="app">
    <canvas ref="canvas" width="500" height="300" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { fixCanvas } from "./lib/canvas";
import * as levels from "./lib/levels";
import * as util from "./lib/util";

@Component({
  mounted() {
    const canvas = this.$refs.canvas as HTMLCanvasElement;

    fixCanvas(canvas);
    const ctx = canvas.getContext("2d");

    let moves = levels.harmony();

    if (canvas && ctx) {
      const frames = util.render(moves);
      util.draw(ctx, frames);
    }
  }
})
export default class App extends Vue {}
</script>

<style>
body {
  background: black;
}
</style>
