import Point from "./point";
import Vector from "./vector";

export default class Hero {
  constructor(public pos: Point, public vec: Vector) {
    this.pos = pos;
    this.vec = vec;
  }

  applyForce(v: Vector) {
    return new Hero(this.pos, this.vec.add(v));
  }

  next() {
    const _x = this.pos.x + this.vec.x;
    const _y = this.pos.y + this.vec.y;
    return new Hero(new Point(_x, _y), this.vec);
  }
}
