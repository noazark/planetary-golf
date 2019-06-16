import * as util from "./util";
import * as levels from "./levels";

export function orbit(canvas: HTMLCanvasElement) {
  util.fixCanvas(canvas);
  const ctx = canvas.getContext("2d");

  let moves = levels.harmony();

  if (canvas && ctx) {
    const frames = util.render(moves);
    util.draw(ctx, frames);
  }
}
