import Collider from "./collider";
import GBody from "./body";
import { CanvasObject, Arc, Path } from './canvas';

async function waitForIt() {
  return new Promise(resolve => {
    requestAnimationFrame(() => {
      resolve();
    });
  });
}

type Frame = Array<CanvasObject>

class Buffer {
  private _buff: Array<any>;
  public length: number;
  public bufferedLength: number;

  constructor(public readonly maxLength: number) {
    this._buff = [];
    this.length = 0;
    this.bufferedLength = 0;
  }

  last() {
    return this._buff[this._buff.length - 1];
  }

  add(el: any): number {
    const length = this._buff.push(el);

    if (length > this.maxLength) {
      this._buff.shift();
    }

    this.length++;
    this.bufferedLength = this._buff.length;

    return this.length;
  }

  pairs() {
    if (this._buff.length >= 1) {
      return this._buff.slice(1).reduce((m, el, i) => {
        m.push([this._buff[i], el]);
        return m;
      }, []);
    }
  }
}

export function render(moves: Collider, maxFrames: number = Infinity) {
  let _moves = moves;
  let colliders = new Buffer(30);

  return {
    [Symbol.iterator]() {
      return {
        next() {
          _moves = Collider.next(_moves);
          colliders.add(_moves);

          if (colliders.length >= 1) {
            const bodies = _moves.bodies.map((body: GBody, i: number) => {
              return new Arc({
                c: body.pos,
                fillStyle: "rgba(255, 255, 255, .3)"
              });
            });

            const paths = colliders
              .pairs()
              .reduce(
                (frame: Frame, [_m0, _m2]: Array<Collider>) => {
                  const segments = _m2.bodies.map((body: GBody, i: number) => {
                    const magnitude = body.vec.getMagnitude();
                    const mag = magnitude / 10;
                    const p0 = _m0.bodies[i].pos;
                    const p1 = body.pos;

                    return new Path({
                      line: [p0, p1],
                      strokeStyle: `rgba(255, ${mag * 255}, 0, ${mag})`
                    });
                  });
                  return [...frame, ...segments];
                },
                []
              );

            return { value: [...bodies, ...paths], done: false };
          }

          if (colliders.length === maxFrames) return { value: [], done: true };
          else return { value: [], done: false };
        }
      };
    }
  };
}

export async function draw(
  ctx: CanvasRenderingContext2D,
  frames: Iterable<Frame>
) {
  for (let frame of frames) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    frame.forEach((seg: CanvasObject) => seg.render(ctx));

    await waitForIt();
  }
}
