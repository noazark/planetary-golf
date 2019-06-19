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
    <label>
      <input type="checkbox" v-model="renderConfig.showVector" />
      vector
    </label>
    <br />
    <label>
      <input
        type="checkbox"
        v-model="colliderConfig.enableCollisions"
      />
      collisions
    </label>
    <br />
    <label>
      <input
        type="range"
        min="0"
        step="0.001"
        max="0.5"
        v-model="renderConfig.energyMultiplier"
        @change="updateLevel"
      />
      energy
    </label>
    <br />
    <label>
      <input
        type="range"
        min="0"
        max="100"
        v-model="renderConfig.tailLength"
        @change="updateLevel"
      />
      tail length
    </label>

    <br />

    <canvas ref="canvas" width="500" height="300" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { fixCanvas } from "./lib/canvas";
import * as levels from "./lib/levels";
import * as util from "./lib/util";
import Collider, { ColliderConfig } from "@planitary-golf/physics/collider";
import { Loop } from "./lib/loop";
import { Frame } from "./lib/util";

function getLevel(name: string, ...args) {
  return (levels as { [index: string]: Function })[name](...args);
}

@Component({ name: "App" })
export default class App extends Vue {
  public selectedLevel: string;
  public frames: Iterable<Frame> | null = null;
  public engine: Loop;
  public renderConfig: util.RenderConfig = {
    maxFrames: Infinity,
    tailLength: 30,
    energyMultiplier: 0.2,
    showVector: false,
    showParticle: false
  };
  public colliderConfig: ColliderConfig = {
    COEF_FRICTION: 0,
    enableCollisions: true
  };

  $refs!: {
    canvas: HTMLCanvasElement;
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
    const canvas = this.$refs.canvas;

    fixCanvas(canvas);

    this.updateLevel();
  }

  @Watch("selectedLevel")
  updateLevel() {
    const moves = getLevel(this.selectedLevel, undefined, this.colliderConfig);
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
    const canvas = this.$refs.canvas;
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
  color: #efefef;
}

input[type="range"] {
  -webkit-appearance: none;
  vertical-align: middle;
  background: transparent;
}
input[type="range"]:focus {
  outline: none;
}
input[type="range"]::-webkit-slider-runnable-track {
  width: 100%;
  height: 7.3px;
  cursor: pointer;
  box-shadow: 0px 0px 0px rgba(0, 0, 0, 0), 0px 0px 0px rgba(13, 13, 13, 0);
  background: #2e2e2e;
  border-radius: 0px;
  border: 0px solid rgba(0, 0, 0, 0);
}
input[type="range"]::-webkit-slider-thumb {
  box-shadow: 0px 0px 0px rgba(0, 0, 62, 0.67), 0px 0px 0px rgba(0, 0, 88, 0.67);
  border: 0.4px solid rgba(0, 0, 0, 0.99);
  height: 18px;
  width: 9px;
  border-radius: 0px;
  background: #ffffff;
  cursor: pointer;
  -webkit-appearance: none;
  margin-top: -5.35px;
}
input[type="range"]:focus::-webkit-slider-runnable-track {
  background: #aeaeae;
}
input[type="range"]::-moz-range-track {
  width: 100%;
  height: 7.3px;
  cursor: pointer;
  box-shadow: 0px 0px 0px rgba(0, 0, 0, 0), 0px 0px 0px rgba(13, 13, 13, 0);
  background: #2e2e2e;
  border-radius: 0px;
  border: 0px solid rgba(0, 0, 0, 0);
}
input[type="range"]::-moz-range-thumb {
  box-shadow: 0px 0px 0px rgba(0, 0, 62, 0.67), 0px 0px 0px rgba(0, 0, 88, 0.67);
  border: 0.4px solid rgba(0, 0, 0, 0.99);
  height: 18px;
  width: 9px;
  border-radius: 0px;
  background: #ffffff;
  cursor: pointer;
}
input[type="range"]::-ms-track {
  width: 100%;
  height: 7.3px;
  cursor: pointer;
  background: transparent;
  border-color: transparent;
  color: transparent;
}
input[type="range"]::-ms-fill-lower {
  background: #000000;
  border: 0px solid rgba(0, 0, 0, 0);
  border-radius: 0px;
  box-shadow: 0px 0px 0px rgba(0, 0, 0, 0), 0px 0px 0px rgba(13, 13, 13, 0);
}
input[type="range"]::-ms-fill-upper {
  background: #2e2e2e;
  border: 0px solid rgba(0, 0, 0, 0);
  border-radius: 0px;
  box-shadow: 0px 0px 0px rgba(0, 0, 0, 0), 0px 0px 0px rgba(13, 13, 13, 0);
}
input[type="range"]::-ms-thumb {
  box-shadow: 0px 0px 0px rgba(0, 0, 62, 0.67), 0px 0px 0px rgba(0, 0, 88, 0.67);
  border: 0.4px solid rgba(0, 0, 0, 0.99);
  height: 18px;
  width: 9px;
  border-radius: 0px;
  background: #ffffff;
  cursor: pointer;
  height: 7.3px;
}
input[type="range"]:focus::-ms-fill-lower {
  background: #2e2e2e;
}
input[type="range"]:focus::-ms-fill-upper {
  background: #aeaeae;
}
</style>
