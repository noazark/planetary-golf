import Collider from "./collider";
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

export function drawBody(ctx: CanvasRenderingContext2D, body: GBody) {
  const x = body.pos.x;
  const y = body.pos.y;
  const color = "gray";
  const r = 4;

  // Draw the face
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

export async function drawHero(ctx: CanvasRenderingContext2D, moves: Collider) {
  let m_1: Collider;

  for await (let m of moves as AsyncIterable<Collider>) {
    m.bodies.forEach((body, i) => {
      ctx.beginPath();
      if (m_1) {
        ctx.moveTo(m_1.bodies[i].pos.x, m_1.bodies[i].pos.y);
      }
      ctx.lineTo(body.pos.x, body.pos.y);

      const magnitude = body.vec.getMagnitude();
      ctx.lineWidth = 1;
      ctx.strokeStyle = `rgb(${(magnitude / 10) * 255}, 0, 0)`;

      ctx.stroke();
      ctx.closePath();
    });
    m_1 = m;
  }
}
