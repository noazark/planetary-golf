export default class Body {
  constructor({ pos, mass = 0 }) {
    if (pos == null) {
      pos = [0, 0];
    }

    this.pos = pos;
    this.mass = mass;
  }

  get attractor() {
    return this.mass > 0;
  }
}
