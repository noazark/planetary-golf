import GBody from "./body";
import Point from "./point";
import Collider from "./collider";
import Vector from "./vector";

interface ChaosConfig {
  height: number;
  spread: number;
}
export function chaos(config: ChaosConfig) {
  const length = config.height / config.spread;

  const bodies: Array<GBody> = [
    ...Array.from(
      { length },
      (_, i) => new GBody(new Point(0, i * config.spread), 0, new Vector(2, 0))
    ),

    new GBody(new Point(300, 100), 500, new Vector(0, 0), true),
    new GBody(new Point(280, 240), 100, new Vector(0, 0), true),
    new GBody(new Point(110, 274), 100, new Vector(0, 0), true),
    new GBody(new Point(300, 200), 100, new Vector(0, 0), true)
  ];

  return new Collider(bodies, { COEF_FRICTION: 0.005 });
}

interface AcceleratorConfig {}
export function accelerator(config?: AcceleratorConfig) {
  const bodies: Array<GBody> = [
    new GBody(new Point(0, 60), 0, new Vector(3, 0)),
    new GBody(new Point(0, 240), 0, new Vector(3, 0)),

    new GBody(new Point(300, 100), 500, new Vector(0, 0), true),
    new GBody(new Point(300, 200), 500, new Vector(0, 0), true)
  ];

  return new Collider(bodies, { COEF_FRICTION: 0.005 });
}

interface HarmonyConfig {}
export function harmony(config?: HarmonyConfig) {
  const bodies: Array<GBody> = [
    new GBody(new Point(200, 100), 800, new Vector(1, 0), false),
    new GBody(new Point(300, 200), 800, new Vector(-1, 0), false)
  ];

  return new Collider(bodies, { COEF_FRICTION: 0, maxIterations: 1000 });
}
