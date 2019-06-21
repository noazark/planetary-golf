import { Particle, Point, Vector } from "@planitary-golf/physics/particle";
import Collider, { ColliderConfig } from "@planitary-golf/physics/collider";

interface EighttConfig {
}
export function eight(
  config: EighttConfig = {},
  colliderConfig: ColliderConfig = {
    COEF_FRICTION: 0,
    enableCollisions: true
  }
) {
  const particles: Array<Particle> = [
    new Particle(new Point(250, 150), 0, new Vector(1, 1)),
    new Particle(new Point(200, 150), 100, new Vector(0, 0), true),
    new Particle(new Point(300, 150), 100, new Vector(0, 0), true)
  ];

  return new Collider(particles, colliderConfig);
}

interface ChaosConfig {
  height: number;
  spread: number;
}
export function chaos(
  config: ChaosConfig = { height: 300, spread: 5 },
  colliderConfig: ColliderConfig = {
    COEF_FRICTION: 0.022,
    enableCollisions: true
  }
) {
  const length = config.height / config.spread;

  const particles: Array<Particle> = [
    ...Array.from(
      { length },
      (_, i) =>
        new Particle(new Point(0, i * config.spread), 0, new Vector(2, 0))
    ),

    new Particle(new Point(300, 100), 500, new Vector(0, 0), true),
    new Particle(new Point(300, 200), 100, new Vector(0, 0), true),
    new Particle(new Point(280, 240), 100, new Vector(0, 0), true),
    new Particle(new Point(110, 274), -100, new Vector(0, 0), true)
  ];

  return new Collider(particles, colliderConfig);
}

interface AcceleratorConfig {}
export function accelerator(
  config?: AcceleratorConfig,
  colliderConfig: ColliderConfig = {
    COEF_FRICTION: 0,
    enableCollisions: true
  }
) {
  const particles: Array<Particle> = [
    new Particle(new Point(0, 60), 0, new Vector(3, 0)),
    new Particle(new Point(0, 240), 0, new Vector(3, 0)),

    new Particle(new Point(300, 100), 500, new Vector(0, 0), true),
    new Particle(new Point(300, 200), 500, new Vector(0, 0), true)
  ];

  return new Collider(particles, colliderConfig);
}

interface LeapFrogConfig {}
export function leapFrog(
  config?: LeapFrogConfig,
  colliderConfig: ColliderConfig = {
    COEF_FRICTION: 0,
    enableCollisions: true
  }
) {
  const particles: Array<Particle> = [
    new Particle(new Point(0, 130), 100, new Vector(1, 0)),
    new Particle(new Point(0, 170), 30, new Vector(0, 0))
  ];

  return new Collider(particles, colliderConfig);
}

interface HarmonyConfig {}
export function harmony(
  config?: HarmonyConfig,
  colliderConfig: ColliderConfig = {
    COEF_FRICTION: 0,
    enableCollisions: true
  }
) {
  const particles: Array<Particle> = [
    new Particle(new Point(200, 100), 800, new Vector(1, 0), false),
    new Particle(new Point(300, 200), 800, new Vector(-1, 0), false)
  ];

  return new Collider(particles, colliderConfig);
}

interface CollisionConfig {}
export function collision(
  config?: CollisionConfig,
  colliderConfig: ColliderConfig = {
    COEF_FRICTION: 0,
    enableCollisions: true
  }
) {
  const particles: Array<Particle> = [
    new Particle(new Point(0, 130), 30, new Vector(3, 0)),
    new Particle(new Point(0, 170), 30, new Vector(3, 0))
  ];

  return new Collider(particles, colliderConfig);
}

interface WallConfig {
  height: number;
  width: number;
  spread: number;
}
export function wall(
  config: WallConfig = { height: 300, width: 500, spread: 100 },
  colliderConfig: ColliderConfig = {
    COEF_FRICTION: 0.022,
    enableCollisions: true
  }
) {
  const length = config.height / config.spread;

  const particles: Array<Particle> = [
    ...Array.from(
      { length },
      (_, i) =>
        new Particle(new Point(0, i * config.spread), 72, new Vector(2, 0))
    ),
    ...Array.from(
      { length },
      (_, i) =>
        new Particle(
          new Point(config.width, i * config.spread),
          72,
          new Vector(-2, 0)
        )
    )
  ];

  return new Collider(particles, colliderConfig);
}

interface RandomFieldConfig {
  height: number;
  width: number;
  n: number;
}
export function randomField(
  config: RandomFieldConfig = { height: 300, width: 500, n: 100 },
  colliderConfig: ColliderConfig = {
    COEF_FRICTION: 0.05,
    enableCollisions: true
  }
) {
  const particles: Array<Particle> = [
    ...Array.from(
      { length: config.n },
      (_, i) =>
        new Particle(
          new Point(
            Math.random() * config.width,
            Math.random() * config.height
          ),
          Math.random() * 1
          // new Vector(2, 0)
        )
    )
  ];

  return new Collider(particles, colliderConfig);
}

interface RadiateConfig {
  height: number;
  width: number;
  n: number;
}
export function radiate(
  config: RadiateConfig = { height: 300, width: 500, n: 6 },
  colliderConfig: ColliderConfig = {
    COEF_FRICTION: 0,
    enableCollisions: true
  }
) {
  const centerPoint = new Point(config.width / 2, config.height / 2);
  const particles: Array<Particle> = [
    ...Array.from({ length: config.n }, (_, i) => {
      const vec = Vector.fromEuclidean(100, 2 * Math.PI * (i / config.n));
      const particle = new Particle(
        centerPoint.translate(vec),
        0,
        vec
          .setDirection(vec.getDirection() + 30 * (Math.PI / 180))
          .setMagnitude(-2)
      );

      return particle;
    }),

    ...Array.from({ length: config.n }, (_, i) => {
      const vec = Vector.fromEuclidean(100, 2 * Math.PI * (i / config.n) - 1);
      const particle = new Particle(
        centerPoint.translate(vec),
        0,
        vec
          .setDirection(vec.getDirection() + 20 * (Math.PI / 180))
          .setMagnitude(-1)
      );

      return particle;
    }),

    new Particle(centerPoint, 80)
  ];

  return new Collider(particles, colliderConfig);
}

interface OrbitConfig {
  height: number;
  width: number;
  spacing: number;
  margin: number;
}
export function orbit(
  config: OrbitConfig = {
    height: 300,
    width: 500,
    spacing: 3,
    margin: 20
  },
  colliderConfig: ColliderConfig = {
    COEF_FRICTION: 0,
    enableCollisions: false
  }
) {
  const a = new Point(config.width / 4, config.height / 2);
  const b = new Point((config.width * 3) / 4, config.height / 2);

  const A = new Particle(a, 200, new Vector(), true);

  const length = (a.getDistance(b) - config.margin * 2) / config.spacing + 1;

  const particles: Array<Particle> = [
    ...Array.from({ length }, (_, i) => {
      const pp = a.translate(new Vector(config.spacing * i + config.margin, 0));
      const p = new Particle(pp);

      return p.add(new Vector(0, (-80 * 1) / p.getDistance(A)));
    }),

    A
  ];

  return new Collider(particles, colliderConfig);
}
