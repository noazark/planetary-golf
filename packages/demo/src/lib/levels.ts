import { Particle, Point, Vector } from "@planitary-golf/physics/particle";
import Collider from "@planitary-golf/physics/collider";

interface ChaosConfig {
  height: number;
  spread: number;
}
export function chaos(config: ChaosConfig = { height: 300, spread: 5 }) {
  const length = config.height / config.spread;

  const particles: Array<Particle> = [
    ...Array.from(
      { length },
      (_, i) =>
        new Particle(new Point(0, i * config.spread), 1, new Vector(2, 0))
    ),

    new Particle(new Point(300, 100), 500, new Vector(0, 0), true),
    new Particle(new Point(280, 240), 100, new Vector(0, 0), true),
    new Particle(new Point(110, 274), 100, new Vector(0, 0), true),
    new Particle(new Point(300, 200), 100, new Vector(0, 0), true)
  ];

  return new Collider(particles, { COEF_FRICTION: 0.022 });
}

interface AcceleratorConfig {}
export function accelerator(config?: AcceleratorConfig) {
  const particles: Array<Particle> = [
    new Particle(new Point(0, 60), 0, new Vector(3, 0)),
    new Particle(new Point(0, 240), 0, new Vector(3, 0)),

    new Particle(new Point(300, 100), 500, new Vector(0, 0), true),
    new Particle(new Point(300, 200), 500, new Vector(0, 0), true)
  ];

  return new Collider(particles, { COEF_FRICTION: 0 });
}

interface LeapFrogConfig {}
export function leapFrog(config?: LeapFrogConfig) {
  const particles: Array<Particle> = [
    new Particle(new Point(0, 130), 100, new Vector(1, 0)),
    new Particle(new Point(0, 170), 30, new Vector(0, 0))
  ];

  return new Collider(particles, { COEF_FRICTION: 0 });
}

interface HarmonyConfig {}
export function harmony(config?: HarmonyConfig) {
  const particles: Array<Particle> = [
    new Particle(new Point(200, 100), 800, new Vector(1, 0), false),
    new Particle(new Point(300, 200), 800, new Vector(-1, 0), false)
  ];

  return new Collider(particles, { COEF_FRICTION: 0 });
}

interface CollisionConfig {}
export function collision(config?: CollisionConfig) {
  const particles: Array<Particle> = [
    new Particle(new Point(0, 130), 30, new Vector(3, 0)),
    new Particle(new Point(0, 170), 30, new Vector(3, 0))
  ];

  return new Collider(particles, { COEF_FRICTION: 0 });
}
