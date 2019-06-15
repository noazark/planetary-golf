import Point from "./point";
import Vector from "./vector";
import * as util from "./util";

export default class GBody {
  constructor(public pos: Point, public mass: number, public vec: Vector) {
    this.pos = pos;
    this.mass = mass;
  }

  get attractor() {
    return this.mass > 0;
  }

  applyForce(v: Vector) {
    const _vec = this.vec.add(v);
    return new GBody(this.pos, this.mass, _vec);
  }

  next() {
    const _x = this.pos.x + this.vec.x;
    const _y = this.pos.y + this.vec.y;
    return new GBody(new Point(_x, _y), this.mass, this.vec);
  }

  getAngle(body: GBody) {
    return util.getAngleBetweenPoints(body, this)
  }

  getDistance(body: GBody) {
    return util.getDistanceBetweenPoints(body, this)
  }

  pull(body: GBody) {
    const theta = this.getAngle(body);
    const distance = this.getDistance(body);

    // apply mass, diminishes over greater distance
    const magnitude = (body.mass * 1) / Math.pow(distance, 2);
    // supporting both attractors and deflectors
    const direction = theta - (body.attractor ? 0 : Math.PI);

    const vec = Vector.fromEuclidean(magnitude, direction);

    return this.applyForce(vec)
  }
}
