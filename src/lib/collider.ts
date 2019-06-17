import Particle from "./particle";
import Vector from "./vector";

interface ColliderConfig {
  COEF_FRICTION: number;
}

export default class Collider {
  constructor(
    public readonly particles: Array<Particle>,
    public readonly config: ColliderConfig
  ) {}

  // Calculate next collider
  next() {
    const { COEF_FRICTION } = this.config;

    let particles = this.particles.map((a: Particle, i: number) => {
      if (a.fixed) {
        return a;
      }

      a = this.particles.reduce((a, b, j: number) => {
        if (i == j || a.fixed) {
          return a;
        } else {
          return a.pull(b);
        }
      }, a);

      let mag = Math.max(0, a.vec.getMagnitude() - COEF_FRICTION);

      return a.setMagnitude(mag);
    });

    return new Collider(particles, this.config);
  }

  // move particles along their vectors
  move() {
    // just detecting and correcting, ultimately this should be more
    // sophisticated and have collision handling somewhere else
    let collider = Collider.mapCollisions(
      this,

      // right now we just set the particle to fixed
      // should handle this with some maths
      (a: Particle) => new Particle(a.pos, a.mass, new Vector(), true)
    );
    let particles = collider.particles.map((particle: Particle) =>
      particle.next()
    );
    return new Collider(particles, this.config);
  }

  static mapCollisions(collider: Collider, handler: Function) {
    let particles = collider.particles.map((a, i) => {
      const collisions = collider.particles.filter(
        (b, j) => i !== j && a.doesIntersect(b)
      );

      if (collisions.length > 0) {
        return handler(a, collisions);
      } else {
        return a;
      }
    });

    return new Collider(particles, collider.config);
  }
}
