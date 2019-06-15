import Collider from "./collider";
import Hero from "./hero";
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

export function drawBody(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number = 2,
  color: string = "black"
) {
  // Draw the face
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

export async function drawHero(ctx: CanvasRenderingContext2D, moves: Collider) {
  let m_1;

  for await (let m of moves as AsyncIterable<Collider>) {
    ctx.beginPath();
    if (m_1) {
      ctx.moveTo(m_1.hero.pos.x, m_1.hero.pos.y);
    }
    ctx.lineTo(m.hero.pos.x, m.hero.pos.y);

    const magnitude = m.hero.vec.getMagnitude();
    ctx.lineWidth = 1;
    ctx.strokeStyle = `rgb(${(magnitude / 10) * 255}, 0, 0)`;

    ctx.stroke();
    ctx.closePath();

    m_1 = m;
  }
}

export function getAngleBetweenPoints(a: Hero | GBody, b: Hero | GBody) {
  const delta_x = a.pos.x - b.pos.x;
  const delta_y = a.pos.y - b.pos.y;
  return Math.atan2(delta_y, delta_x);
}

export function getDistanceBetweenPoints(a: Hero | GBody, b: Hero | GBody) {
  const delta_x = Math.pow(b.pos.x - a.pos.x, 2);
  const delta_y = Math.pow(b.pos.y - a.pos.y, 2);
  return Math.sqrt(delta_x + delta_y);
}
