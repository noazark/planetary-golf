import * as util from "./util";
import GBody from "./body";
import Point from "./point";
import Collider, { MIN_DISTANCE } from "./collider";
import Vector from "./vector";

const hero = new GBody(new Point(100, 10), 0, new Vector(2, 0));

const bodies: Array<GBody> = [
  new GBody(new Point(200, 30), 30, new Vector(0, 0)),
  new GBody(new Point(120, 110), 100, new Vector(0, 0)),
  new GBody(new Point(180, 90), 220, new Vector(0, 0))
];

export function orbit(canvas: HTMLCanvasElement) {
  util.fixCanvas(canvas);
  const ctx = canvas.getContext("2d");

  let moves = new Collider(hero, bodies);

  if (canvas && ctx) {
    bodies.forEach(body => {
      util.drawBody(ctx, body.pos.x, body.pos.y, MIN_DISTANCE, "gray");
    });
    util.drawHero(ctx, moves);
  }
}
