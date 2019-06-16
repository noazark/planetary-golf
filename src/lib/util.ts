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

export function drawBody(ctx: CanvasRenderingContext2D, seg: FrameSegment) {
  ctx.beginPath();
  ctx.arc(seg.line[1].x, seg.line[1].y, 4, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.fillStyle = seg.fillStyle;
  ctx.fill();
}

export function drawPath(ctx: CanvasRenderingContext2D, seg: FrameSegment) {
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

interface FrameSegment {
  line: Array<Point>;
  strokeStyle: string;
  fillStyle: string;
}

interface Frame {
  [index: number]: FrameSegment;
  push(el: FrameSegment): void;
  forEach(callback: Function): void;
}

// turn this into an iterator that returns frames
// instead of passing a frame buffer back to render, calculate the frame buffer
// here and flatten it as frame segements
export function calculateFrames(moves: Collider, maxFrames: number = 1000) {
  let colliders: Array<Collider> = [];
  let frames: Array<Frame> = [];
  let i = 0;

  for (let m1 of moves) {
    if (!m1) continue;
    else if (i >= 1) {
      let m0 = colliders[i - 1];

      const frame = m1.bodies.map((body: GBody, i: number) => {
        const magnitude = body.vec.getMagnitude();
        const magByte = (magnitude / 10) * 255;
        const p0 = m0.bodies[i].pos;
        const p1 = body.pos;

        return {
          line: [p0, p1],
          strokeStyle: `rgb(${magByte}, 0, 0)`,
          fillStyle: `rgba(0, 0, 0, .1)`
        };
      });

      frames.push(frame);
    }

    colliders.push(m1);
    i++;

    if (i === maxFrames) break;
  }

  return frames;
}

export async function render(
  ctx: CanvasRenderingContext2D,
  frames: Array<Frame>
) {
  for (let i = 0; i < frames.length; i++) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    const currentFrame = frames[i];
    const frameBuffer = frames.slice(Math.max(0, i - 10), i);

    currentFrame.forEach((seg: FrameSegment) => drawBody(ctx, seg));

    frameBuffer.forEach((f: Frame) => {
      f.forEach((seg: FrameSegment) => drawPath(ctx, seg));
    });

    await waitForIt();
  }
}
