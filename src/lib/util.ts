import Collider from "./collider";
import Point from "./point";
import GBody from "./body";

export function fixCanvas(canvas: HTMLCanvasElement) {
  const _width = canvas.width;
  const _height = canvas.height;
  canvas.width = _width * 2;
  canvas.height = _height * 2;
  canvas.style.width = `${_width}px`;
  canvas.style.height = `${_height}px`;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.scale(2, 2);
  }
}

export function drawArc(ctx: CanvasRenderingContext2D, seg: Arc) {
  ctx.beginPath();
  ctx.arc(seg.c.x, seg.c.y, 4, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.fillStyle = seg.fillStyle;
  ctx.fill();
}

export function drawPath(ctx: CanvasRenderingContext2D, seg: Path) {
  ctx.beginPath();
  ctx.moveTo(seg.line[0].x, seg.line[0].y);
  ctx.lineTo(seg.line[1].x, seg.line[1].y);

  ctx.lineWidth = 1;
  ctx.strokeStyle = seg.strokeStyle;

  ctx.stroke();
  ctx.closePath();
}

async function waitForIt() {
  return new Promise(resolve => {
    requestAnimationFrame(() => {
      resolve();
    });
  });
}

interface PathConfig {
  line: Array<Point>;
  strokeStyle: string;
}

class Path implements PathConfig {
  public readonly line: Array<Point>;
  public readonly strokeStyle: string;

  constructor(config: PathConfig) {
    this.line = config.line;
    this.strokeStyle = config.strokeStyle;
  }
}

interface ArcConfig {
  c: Point;
  fillStyle: string;
}

class Arc implements ArcConfig {
  public readonly c: Point;
  public readonly fillStyle: string;

  constructor(config: ArcConfig) {
    this.c = config.c;
    this.fillStyle = config.fillStyle;
  }
}

type FrameSegment = Path | Arc;

interface Frame {
  [index: number]: FrameSegment;
  push(el: FrameSegment): void;
  forEach(callback: Function): void;
}

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
                (frame: Array<FrameSegment>, [_m0, _m2]: Array<Collider>) => {
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

const _draw: { [index: string]: Function } = {
  Arc: (ctx: CanvasRenderingContext2D, seg: Arc) => drawArc(ctx, seg),
  Path: (ctx: CanvasRenderingContext2D, seg: Path) => drawPath(ctx, seg)
};

export async function draw(
  ctx: CanvasRenderingContext2D,
  frames: Iterable<Frame>
) {
  for (let frame of frames) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    frame.forEach((seg: FrameSegment) => _draw[seg.constructor.name](ctx, seg));

    await waitForIt();
  }
}
