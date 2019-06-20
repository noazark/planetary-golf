import { Particle, Vector } from "./particle";
import { splice } from "./util";

export interface ColliderConfig {
  /**
   * Coefficient of friction.
   */
  COEF_FRICTION: number;
  enableCollisions: boolean;
}

export default class Collider {
  constructor(
    public readonly particles: Array<Particle>,
    public readonly config: ColliderConfig = {
      COEF_FRICTION: 0,
      enableCollisions: true
    }
  ) {}

  next(dt: number = 1) {
    let particles = this.particles.map((a: Particle, i: number) => {
      // Return fixed particles immediately. They don't move.
      if (a.fixed) {
        return a;
      }

      // Iterate through all particles and apply force to the current particle.
      const other: Array<Particle> = splice(this.particles, i, 1);
      a = other.reduce((a, b) => a.pull(b, dt), a);

      // Calculate and apply resistance due to friction.
      const mag = Math.max(0, a.vec.getMagnitude() - this.config.COEF_FRICTION);
      a = a.setMagnitude(mag);

      return a;
    });

    if (this.config.enableCollisions) {
      // just detecting and correcting, ultimately this should be more
      // sophisticated and have collision handling somewhere else
      let collider = Collider.mapCollisions(
        new Collider(particles, this.config),

        // right now we just set the particle to fixed
        // should handle this with some maths
        (a: Particle) => new Particle(a.pos, 0, new Vector(), true)
      );

      particles = collider.particles;
    }

    particles = particles.map((p: Particle) => p.next(dt));

    return new Collider(particles, this.config);
  }

  /**
   * Iterates through current collider state and calls `handler` function
   * for each particle in a collision.
   *
   * @param collider Current state of particle collider, after forces are
   *                 applied.
   * @param handler A map function to call on each particle in collision.
   */
  static mapCollisions(collider: Collider, handler: Function) {
    let particles = collider.particles.map((a, i) => {
      const other = splice(collider.particles, i, 1);
      const collisions = other.filter(b => a.doesIntersect(b));

      if (collisions.length > 0) {
        return handler(a, collisions);
      } else {
        return a;
      }
    });

    return new Collider(particles, collider.config);
  }
}
