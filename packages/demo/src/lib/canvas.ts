import { Point } from "@planitary-golf/physics/particle";
import { CanvasObject } from "./canvas";

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

interface CircleConfig {
  c?: Point;
  r?: number;
  fillStyle?: string;
}

export class Circle implements CircleConfig {
  public readonly c: Point;
  public readonly r: number;
  public readonly fillStyle: string;

  constructor(config: CircleConfig) {
    this.c = config.c || new Point(0, 0);
    this.r = config.r || 0;
    this.fillStyle = config.fillStyle || "black";
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.c.x, this.c.y, this.r, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fillStyle = this.fillStyle;
    ctx.fill();
  }
}

export type CanvasObject = Path | Circle;

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
