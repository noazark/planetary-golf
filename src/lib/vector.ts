export default class Vector {
  constructor(public x: number = 0, public y: number = 0) {
    this.x = x;
    this.y = y;
  }

  static fromEuclidean(magnitude: number, direction: number) {
    const vector = new Vector();
    vector.setMagnitude(magnitude);
    vector.setDirection(direction);
    return vector;
  }

  getDirection() {
    return Math.atan2(this.y, this.x);
  }

  setDirection(direction: number) {
    var magnitude = this.getMagnitude();
    this.x = Math.cos(direction) * magnitude;
    this.y = Math.sin(direction) * magnitude;
  }

  getMagnitude(): number {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }

  setMagnitude(magnitude: number) {
    var direction = this.getDirection();
    this.x = Math.cos(direction) * magnitude;
    this.y = Math.sin(direction) * magnitude;
  }

  add(v2: Vector): Vector {
    return new Vector(this.x + v2.x, this.y + v2.y);
  }

  subtract(v2: Vector): Vector {
    return new Vector(this.x - v2.x, this.y - v2.y);
  }

  multiply(scalar: number): Vector {
    return new Vector(this.x * scalar, this.y * scalar);
  }

  divide(scalar: number): Vector {
    return new Vector(this.x / scalar, this.y / scalar);
  }

  copy(): Vector {
    return new Vector(this.x, this.y);
  }

  toString(): string {
    return "x: " + this.x + ", y: " + this.y;
  }

  toArray(): Array<number> {
    return [this.x, this.y];
  }

  toObject(): Object {
    return { x: this.x, y: this.y };
  }
}
