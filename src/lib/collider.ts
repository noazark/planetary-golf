import GBody from "./body";

export const COEF_FRICTION = 0.005;
export const MIN_DISTANCE = 3;

export class OrbitalError extends Error {}

export default class Collider {
  constructor(public hero: GBody, public bodies: Array<GBody>) {
    this.hero = hero;
    this.bodies = bodies;
  }

  static next(collider: Collider) {
    let hero = collider.bodies.reduce((hero, body) => {
      // calculate gravitational pull and apply it to hero
      return hero.pull(body);
    }, collider.hero);

    let mag = hero.vec.getMagnitude() - COEF_FRICTION;

    // friction can't reverse motion, only slow it down
    if (mag < COEF_FRICTION) {
      mag = 0;
      throw new OrbitalError("Dude, you're not moving.");
    }

    hero.vec.setMagnitude(mag);

    hero = hero.next();

    return new Collider(hero, collider.bodies);
  }

  [Symbol.asyncIterator]() {
    return {
      _steps: 0,
      _collider: new Collider(this.hero, this.bodies),
      next() {
        try {
          this._steps++;
          this._collider = Collider.next(this._collider);

          return new Promise(resolve => {
            requestAnimationFrame(() => {
              resolve({
                value: this._collider,
                done: this._steps >= 1000
              });
            });
          });
        } catch (e) {
          if (e instanceof OrbitalError) {
            return Promise.resolve({ value: null, done: true });
          } else {
            return Promise.reject(e);
          }
        }
      }
    };
  }
}
