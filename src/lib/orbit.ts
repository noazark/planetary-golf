import * as util from "./util";
import * as levels from "./levels";
import { fixCanvas } from './canvas';

export function orbit(canvas: HTMLCanvasElement) {
  fixCanvas(canvas)
  const ctx = canvas.getContext("2d");

  let moves = levels.harmony();

  if (canvas && ctx) {
    const frames = util.render(moves);
    util.draw(ctx, frames);
  }
}
