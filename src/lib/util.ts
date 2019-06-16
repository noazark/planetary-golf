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

interface Path {
  type: string;
  line: Array<Point>;
  strokeStyle: string;
}

interface Arc {
  type: string;
  c: Point;
  fillStyle: string;
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

  constructor(public maxLength: number) {
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

// turn this into an iterator that returns frames
export function calculateFrames(moves: Collider, maxFrames: number = 1000) {
  let colliders = new Buffer(10);
  let frames: Array<Frame> = [];

  for (let m1 of moves) {
    if (!m1) continue;

    colliders.add(m1);

    if (colliders.length >= 1) {
      const bodies = m1.bodies.map((body: GBody, i: number) => {
        return {
          type: "Arc",
          c: body.pos,
          fillStyle: "rgba(0, 0, 0, .1)"
        };
      });

      const paths = colliders
        .pairs()
        .reduce((frame: Array<FrameSegment>, [_m0, _m2]: Array<Collider>) => {
          const segments = _m2.bodies.map((body: GBody, i: number) => {
            const magnitude = body.vec.getMagnitude();
            const magByte = (magnitude / 10) * 255;
            const p0 = _m0.bodies[i].pos;
            const p1 = body.pos;

            return {
              type: "Path",
              line: [p0, p1],
              strokeStyle: `rgb(${magByte}, 0, 0)`
            };
          });
          return [...frame, ...segments];
        }, []);

      frames = [...frames, [...bodies, ...paths]];
    }

    if (colliders.length === maxFrames) break;
  }

  return frames;
}

export async function render(
  ctx: CanvasRenderingContext2D,
  frames: Array<Frame>
) {
  for (let i = 0; i < frames.length; i++) {
    const currentFrame = frames[i];

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    const draw = {
      Arc: (ctx: CanvasRenderingContext2D, seg: Arc) => drawArc(ctx, seg),
      Path: (ctx: CanvasRenderingContext2D, seg: Path) => drawPath(ctx, seg)
    };
    currentFrame.forEach((seg: FrameSegment) => draw[seg.type](ctx, seg));

    await waitForIt();
  }
}
