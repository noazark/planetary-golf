import Point from "./point";

export default class GBody {
  constructor(public pos: Point, public mass: number) {
    this.pos = pos;
    this.mass = mass;
  }

  get attractor() {
    return this.mass > 0;
  }
}
