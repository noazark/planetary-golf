import Particle from "./particle";

interface ColliderConfig {
  COEF_FRICTION: number;
}

export default class Collider {
  constructor(
    public readonly bodies: Array<Particle>,
    public readonly config: ColliderConfig
  ) {}

  static next(collider: Collider) {
    let bodies = collider.bodies.map((hero: Particle, i: number) => {
      hero = collider.bodies.reduce((hero, body, j: number) => {
        if (i == j || hero.fixed) {
          return hero;
        } else {
          return hero.pull(body);
        }
      }, hero);

      if (hero.fixed) {
        return hero;
      }

      let mag = hero.vec.getMagnitude() - collider.config.COEF_FRICTION;

      if (mag < 0) {
        mag = 0;
      }

      hero = new Particle(
        hero.pos,
        hero.mass,
        hero.vec.setMagnitude(mag),
        hero.fixed
      );
      return hero.next();
    });

    return new Collider(bodies, collider.config);
  }
}
