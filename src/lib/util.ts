import Collider from "./collider";
import Particle from "./particle";
import { CanvasObject, Arc, Path } from "./canvas";
import { Buffer } from "./buffer";

export type Frame = Array<CanvasObject>;

interface RenderConfig {
  maxFrames: number;
  tailLength: number;
  energyMultiplier: number;
}
export function render(
  moves: Collider,
  config: RenderConfig = {
    maxFrames: Infinity,
    tailLength: 30,
    energyMultiplier: 0.1
  }
) {
  let _moves = moves;
  let colliders = new Buffer(config.tailLength);

  return {
    [Symbol.iterator]() {
      return {
        next() {
          _moves = _moves.next();
          colliders.add(_moves);

          if (colliders.length >= config.maxFrames) {
            return { value: [], done: true };
          }

          if (colliders.length >= 1) {
            const particles = _moves.particles.map(
              (body: Particle, i: number) => {
                return new Arc({
                  c: body.pos,
                  fillStyle: "rgba(255, 255, 255, .3)"
                });
              }
            );

            const vectors = _moves.particles.map(
              (body: Particle, i: number) => {
                return new Path({
                  line: [body.pos, body.pos.translate(body.vec.multiply(10))],
                  strokeStyle: "rgba(0, 255, 0, 1)"
                });
              }
            );

            const paths = colliders
              .pairs()
              .reduce((frame: Frame, [_m0, _m2]: Array<Collider>) => {
                const segments = _m2.particles.map(
                  (body: Particle, i: number) => {
                    const magnitude = body.vec.getMagnitude();
                    const mag = magnitude * config.energyMultiplier;
                    const p0 = _m0.particles[i].pos;
                    const p1 = body.pos;

                    return new Path({
                      line: [p0, p1],
                      strokeStyle: `rgba(255, ${mag * 255}, 0, ${mag})`
                    });
                  }
                );
                return [...frame, ...segments];
              }, []);

            return { value: [...particles, ...paths, ...vectors], done: false };
          } else {
            return { value: [], done: false };
          }
        }
      };
    }
  };
}

export function draw(ctx: CanvasRenderingContext2D, frame: Frame) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  frame.forEach((seg: CanvasObject) => seg.render(ctx));
}
