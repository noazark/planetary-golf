import Point from "./point";
import { CanvasObject } from './canvas';

interface PathConfig {
  line: Array<Point>;
  strokeStyle: string;
}

export class Path implements PathConfig {
  public readonly line: Array<Point>;
  public readonly strokeStyle: string;

  constructor(config: PathConfig) {
    this.line = config.line;
    this.strokeStyle = config.strokeStyle;
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.moveTo(this.line[0].x, this.line[0].y);
    ctx.lineTo(this.line[1].x, this.line[1].y);

    ctx.lineWidth = 1;
    ctx.strokeStyle = this.strokeStyle;

    ctx.stroke();
    ctx.closePath();
  }
}

interface ArcConfig {
  c: Point;
  fillStyle: string;
}

export class Arc implements ArcConfig {
  public readonly c: Point;
  public readonly fillStyle: string;

  constructor(config: ArcConfig) {
    this.c = config.c;
    this.fillStyle = config.fillStyle;
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.c.x, this.c.y, 4, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fillStyle = this.fillStyle;
    ctx.fill();
  }
}

export type CanvasObject = Path | Arc;

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