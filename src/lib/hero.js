export default class Hero {
  constructor({ pos, vec }) {
    this.pos = pos;
    this.vec = vec;
  }

  applyForce(v) {
    return new Hero({
      pos: this.pos,
      vec: this.vec.add(v)
    });
  }

  next() {
    return new Hero({
      pos: [this.pos[0] + this.vec.x, this.pos[1] + this.vec.y],
      vec: this.vec
    });
  }
}
