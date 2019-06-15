export default class Point {
  constructor(public x: number, public y: number) {
    this.x = x;
    this.y = y;
  }

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
}
