import GBody from "./body";

export class OrbitalError extends Error {}

interface ColliderConfig {
  COEF_FRICTION: number;
  maxIterations?: number;
}

export default class Collider {
  constructor(public bodies: Array<GBody>, public config: ColliderConfig) {
    this.bodies = bodies;
    this.config = config;
  }

  static next(collider: Collider) {
    let bodies = collider.bodies.map((hero: GBody, i: number) => {
      hero = collider.bodies.reduce((hero, body, j: number) => {
        // calculate gravitational pull and apply it to hero
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

      // friction can't reverse motion, only slow it down
      if (mag < collider.config.COEF_FRICTION) {
        mag = 0;

        throw new OrbitalError("Dude, you're not moving.");
      }
      hero.vec.setMagnitude(mag);
      return hero.next();
    });

    return new Collider(bodies, collider.config);
  }

  clone() {
    return new Collider(this.bodies, this.config);
  }

  [Symbol.iterator]() {
    const config = this.config;

    return {
      _collider: this.clone(),
      _iterations: 0,
      next() {
        try {
          this._collider = Collider.next(this._collider);
          this._iterations++;

          return {
            value: this._collider,
            done: this._iterations === config.maxIterations
          };
        } catch (e) {
          if (e instanceof OrbitalError) {
            return { value: null, done: true };
          } else {
            throw e;
          }
        }
      }
    };
  }
}
