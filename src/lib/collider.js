import * as util from "./util";
import Vector from "./vector";

export const COEF_FRICTION = 0.005;
export const MIN_DISTANCE = 3;

export class OrbitalError extends Error {}

function pull(hero, body) {
  const theta = util.getAngleBetweenPoints(body, hero);
  const distance = util.getDistanceBetweenPoints(body, hero);

  // apply mass, diminishes over greater distance
  const magnitude = (body.mass * 1) / Math.pow(distance, 2);
  // supporting both attractors and deflectors
  const direction = theta - (body.attractor ? 0 : Math.PI);

  return Vector.fromEuclidean(magnitude, direction);
}

export default class Collider {
  constructor(hero, bodies) {
    this.hero = hero;
    this.bodies = bodies;
  }

  static next(collider) {
    let hero = collider.bodies.reduce((hero, body) => {
      // calculate gravitational pull and apply it to hero
      const vector = pull(hero, body);
      return hero.applyForce(vector);
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

  [Symbol.iterator]() {
    return {
      _steps: 0,
      _collider: this,
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
            return { done: true };
          } else {
            throw e;
          }
        }
      }
    };
  }
}
