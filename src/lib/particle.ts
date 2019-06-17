import Point from "./point";
import Vector from "./vector";

export default class Particle {
  constructor(
    public readonly pos: Point,
    public readonly mass: number,
    public readonly vec: Vector,
    public readonly fixed: boolean = false
  ) {}

  applyForce(v: Vector) {
    const _vec = this.vec.add(v);
    return new Particle(this.pos, this.mass, _vec, this.fixed);
  }

  next() {
    const _x = this.pos.x + this.vec.x;
    const _y = this.pos.y + this.vec.y;
    return new Particle(new Point(_x, _y), this.mass, this.vec, this.fixed);
  }

  getAngle(body: Particle) {
    return this.pos.getAngle(body.pos);
  }

  getDistance(body: Particle) {
    return this.pos.getDistance(body.pos);
  }

  pull(body: Particle) {
    const theta = this.getAngle(body);
    const distance = this.getDistance(body);

    // apply mass, diminishes over greater distance
    const magnitude = (body.mass * 1) / Math.pow(distance, 2);
    // supporting both attractors and deflectors
    const direction = theta - (body.fixed ? 2 * Math.PI : 0);

    const vec = Vector.fromEuclidean(magnitude, direction);

    return this.applyForce(vec);
  }
}