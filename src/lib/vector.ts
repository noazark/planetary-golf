export default class Vector {
  constructor(public readonly x: number = 0, public readonly y: number = 0) {}

  static fromEuclidean(magnitude: number, direction: number) {
    const x = Math.cos(direction) * magnitude;
    const y = Math.sin(direction) * magnitude;
    return new Vector(x, y);
  }

  getDirection() {
    return Math.atan2(this.y, this.x);
  }

  setDirection(direction: number) {
    var magnitude = this.getMagnitude();
    return Vector.fromEuclidean(magnitude, direction)
  }

  getMagnitude(): number {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }

  setMagnitude(magnitude: number) {
    var direction = this.getDirection();
    return Vector.fromEuclidean(magnitude, direction)
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
