export function fixCanvas(canvas) {
  const _width = canvas.width;
  const _height = canvas.height;
  canvas.width = _width * 2;
  canvas.height = _height * 2;
  canvas.style.width = `${_width}px`;
  canvas.style.height = `${_height}px`;
  canvas.getContext("2d").scale(2, 2);
}

export function drawBody(ctx, x, y, r = 2, color = "black") {
  // Draw the face
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

export async function drawHero(ctx, moves) {
  let m_1;

  for await (let m of moves) {
    ctx.beginPath();
    if (m_1) {
      ctx.moveTo(m_1.hero.pos[0], m_1.hero.pos[1]);
    }
    ctx.lineTo(m.hero.pos[0], m.hero.pos[1]);

    const magnitude = m.hero.vec.getMagnitude();
    ctx.lineWidth = 1;
    ctx.strokeStyle = `rgb(${(magnitude / 10) * 255}, 0, 0)`;

    ctx.stroke();
    ctx.closePath();

    m_1 = m;
  }
}

export function getAngleBetweenPoints(a, b) {
  const delta_x = a.pos[0] - b.pos[0];
  const delta_y = a.pos[1] - b.pos[1];
  return Math.atan2(delta_y, delta_x);
}

export function getDistanceBetweenPoints(a, b) {
  const delta_x = Math.pow(b.pos[0] - a.pos[0], 2);
  const delta_y = Math.pow(b.pos[1] - a.pos[1], 2);
  return Math.sqrt(delta_x + delta_y);
}
