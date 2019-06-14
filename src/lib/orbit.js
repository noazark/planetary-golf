import * as util from "./util";
import Hero from "./hero";
import Body from "./body";
import Collider, { MIN_DISTANCE } from "./collider";
import Vector from "./vector";

const hero = new Hero({
  pos: [100, 10],
  vec: new Vector(2, 0)
});

const bodies = [
  new Body({
    pos: [200, 30],
    mass: 30
  }),
  new Body({
    pos: [120, 110],
    mass: 100
  }),
  new Body({
    pos: [180, 90],
    mass: 220
  })
];

export function orbit(canvas) {
  util.fixCanvas(canvas);
  const ctx = canvas.getContext("2d");

  let moves = new Collider(hero, bodies);

  bodies.forEach(body => {
    util.drawBody(ctx, body.pos[0], body.pos[1], MIN_DISTANCE, "gray");
  });
  util.drawHero(ctx, moves);
}
