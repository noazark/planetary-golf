import Vector from "./vector";

export default class Point {
  constructor(public readonly x: number, public readonly y: number) {}

  getAngle(b: Point) {
    const delta_x = b.x - this.x;
    const delta_y = b.y - this.y;
    return Math.atan2(delta_y, delta_x);
  }

  getDistance(b: Point) {
    const delta_x = Math.pow(b.x - this.x, 2);
    const delta_y = Math.pow(b.y - this.y, 2);
    return Math.sqrt(delta_x + delta_y);
  }

  translate(vec: Vector) {
    const _x = this.x + vec.x;
    const _y = this.y + vec.y;
    return new Point(_x, _y);
  }
}
