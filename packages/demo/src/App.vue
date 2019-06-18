<template>
  <div id="app">
    <select
      :value="selectedLevel"
      @change="selectedLevel = $event.target.value"
    >
      <option :value="name" v-for="name in levels" :key="name">{{
        name
      }}</option>
    </select>

    <template v-if="!isRunning">
      <button @click="start">start</button>
      <button @click="step">step</button>
    </template>
    <template v-else>
      <button @click="stop">stop</button>
    </template>
    <button @click="updateLevel">reset</button>

    <br />

    <canvas ref="canvas" width="500" height="300" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { fixCanvas } from "./lib/canvas";
import * as levels from "./lib/levels";
import * as util from "./lib/util";
import Collider from "@planitary-golf/physics/collider";
import { Loop } from "./lib/loop";
import { Frame } from "./lib/util";

function getLevel(name: string) {
  return (levels as { [index: string]: Function })[name]();
}

@Component({ name: "App" })
export default class App extends Vue {
  public selectedLevel: string;
  public frames: Iterable<Frame> | null = null;
  public engine: Loop;
  private renderConfig = {
    maxFrames: Infinity,
    tailLength: 30,
    energyMultiplier: 0.2
  };

  constructor() {
    super();

    this.selectedLevel = Object.keys(levels)[0];
    this.engine = new Loop(() => this.step());
    this.engine.stop();
  }

  get levels() {
    return Object.keys(levels);
  }

  get isRunning() {
    return this.engine.running;
  }

  mounted() {
    const canvas = this.$refs.canvas as HTMLCanvasElement;

    fixCanvas(canvas);

    this.updateLevel();
  }

  @Watch("selectedLevel")
  updateLevel() {
    const moves = getLevel(this.selectedLevel);
    this.frames = util.render(moves, this.renderConfig);
    this.step();
  }

  start() {
    this.engine.start();
  }

  stop() {
    this.engine.stop();
  }

  step() {
    const canvas = this.$refs.canvas as HTMLCanvasElement;
    if (canvas) {
      const ctx = canvas.getContext("2d");

      if (this.frames && ctx) {
        const step = this.frames[Symbol.iterator]().next();
        if (!step.done) {
          const frame = step.value;
          util.draw(ctx, frame);
        } else {
          this.engine.stop();
        }
      }
    }
  }
}
</script>

<style>
body {
  background: black;
}
</style>
