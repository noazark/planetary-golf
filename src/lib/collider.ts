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

  next() {
    const { COEF_FRICTION } = this.config;
    let particles;

    //
    // calculate forces
    //
    particles = this.particles.map((a: Particle, i: number) => {
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

    //
    // detect collisions
    //

    // just detecting and correcting, ultimately this should be more
    // sophisticated
    particles = particles.map((a, i) => {
      const collision = this.particles.some(
        (b, j) => i !== j && a.doesIntersect(b)
      );

      if (collision) {
        // right now we just set the particle to fixed
        // should handle this with some maths
        return new Particle(a.pos, a.mass, new Vector(), true);
      } else {
        return a;
      }
    });

    //
    // calculate new particle positions
    //
    particles = particles.map(particle => particle.next());

    return new Collider(particles, this.config);
  }
}
