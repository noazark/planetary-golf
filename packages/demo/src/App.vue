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
      <input
        type="checkbox"
        v-model="renderConfig.showParticle"
        @change="renderFrame"
      />
      particle
    </label>
    <br />
    <label>
      <input
        type="checkbox"
        v-model="renderConfig.showVector"
        @change="renderFrame"
      />
      vector
    </label>
    <br />
    <label>
      <input type="checkbox" v-model="colliderConfig.enableCollisions" />
      collisions
    </label>
    <br />
    <label>
      <input
        type="range"
        min="0"
        step="0.0001"
        max="0.05"
        v-model="colliderConfig.COEF_FRICTION"
        @input="renderFrame"
      />
      friction: {{ colliderConfig.COEF_FRICTION }}
    </label>
    <br />
    <label>
      <input
        type="range"
        min="0"
        step="0.001"
        max="0.5"
        v-model="renderConfig.energyMultiplier"
        @input="renderFrame"
      />
      energy: {{ renderConfig.energyMultiplier }}
    </label>
    <br />
    <label>
      <input
        type="range"
        min="2"
        max="100"
        v-model="renderConfig.tailLength"
        @change="updateLevel"
      />
      tail length: {{ renderConfig.tailLength }}
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

function getLevel(name: string, ...args: any) {
  return (levels as { [index: string]: Function })[name](...args);
}

@Component({ name: "App" })
export default class App extends Vue {
  private _ctx: CanvasRenderingContext2D | null = null;
  public selectedLevel: string;
  private _frames: util.Renderer | null = null;
  private engine: Loop;
  public renderConfig: util.RenderConfig = {
    maxFrames: Infinity,
    tailLength: 30,
    energyMultiplier: 0.2,
    showVector: true,
    showParticle: true
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
    this._ctx = canvas.getContext("2d");

    this.updateLevel();
  }

  @Watch("selectedLevel")
  updateLevel() {
    const moves = getLevel(this.selectedLevel, undefined, this.colliderConfig);
    this._frames = new util.Renderer(moves, this.renderConfig);
    this.renderFrame();
  }

  start() {
    this.engine.start();
  }

  stop() {
    this.engine.stop();
  }

  renderFrame() {
    if (this._ctx && this._frames) {
      util.draw(this._ctx, this._frames.render());
    }
  }

  step() {
    if (this._frames) {
      const step = this._frames[Symbol.iterator]().next();
      if (!step.done) {
        const frame = step.value;
        this.renderFrame();
      } else {
        this.engine.stop();
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
