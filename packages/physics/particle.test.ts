import { Point, Vector, Particle } from "./particle";

describe("Point", () => {
  test("#getAngle @ 45º", () => {
    const a = new Point(5, 5);
    const b = new Point(6, 6);

    expect(a.getAngle(b)).toEqual(Math.PI / 4);
  });

  test("#getAngle @ 90º", () => {
    const a = new Point(5, 5);
    const b = new Point(5, 6);

    expect(a.getAngle(b)).toEqual(Math.PI / 2);
  });

  test("#getAngle @ 180º", () => {
    const a = new Point(5, 5);
    const b = new Point(4, 5);

    expect(a.getAngle(b)).toEqual(Math.PI);
  });

  test("#getAngle @ -45º", () => {
    const a = new Point(5, 5);
    const b = new Point(6, 4);

    expect(a.getAngle(b)).toEqual(-Math.PI / 4);
  });

  test("#getDistance", () => {
    const a = new Point(5, 5);
    const b = new Point(6, 5);

    expect(a.getDistance(b)).toEqual(1);
  });

  test("#getDistance, distance is always positive", () => {
    const a = new Point(0, 0);
    const b = new Point(0, -1);

    expect(a.getDistance(b)).toEqual(1);
    expect(b.getDistance(a)).toEqual(1);
  });

  test("#getDistance", () => {
    const a = new Point(0, 0);
    const b = new Point(2, 3);

    const hypotenuse = Math.sqrt(Math.pow(2, 2) + Math.pow(3, 2));

    expect(a.getDistance(b)).toEqual(hypotenuse);
  });

  test("#getVector", () => {
    const a = new Point(3, 4);
    const b = new Point(7, 9);

    expect(a.getVector(b)).toEqual(new Vector(4, 5));
  });

  test("#translate", () => {
    const a = new Point(0, 0);
    const vec = new Vector(1, 4);

    expect(a.translate(vec)).toEqual(new Point(1, 4));
  });

  test("#toObject", () => {
    const a = new Point(4, 5);

    expect(a.toObject()).toEqual({ x: 4, y: 5 });
  });
});

describe("Vector", () => {
  test(".fromEuclidean", () => {
    const magnitude = Math.sqrt(Math.pow(5, 2) + Math.pow(5, 2));
    const direction = Math.PI / 4;
    const vec = Vector.fromEuclidean(magnitude, direction);

    expect(vec.x).toBeCloseTo(5, 14);
    expect(vec.y).toBeCloseTo(5, 14);
  });

  test("defaults", () => {
    expect(new Vector()).toEqual(new Vector(0, 0));
  });

  test("#getDirection", () => {
    const a = new Vector(4, 4);

    expect(a.getDirection()).toEqual(Math.PI / 4);
  });

  test("#setDirection", () => {
    const a = new Vector(1, 0);
    const vec = a.setDirection(Math.PI / 2);

    expect(vec.x).toBeCloseTo(0, 14);
    expect(vec.y).toBeCloseTo(1, 14);
  });

  test("#setDirection", () => {
    const a = new Vector(1, 1);
    const magnitude = Math.sqrt(Math.pow(1, 2) + Math.pow(1, 2));

    expect(a.setDirection(0)).toEqual(new Vector(magnitude, 0));
  });

  test("#getMagnitude", () => {
    const a = new Vector(5, 5);
    const magnitude = Math.sqrt(Math.pow(5, 2) + Math.pow(5, 2));

    expect(a.getMagnitude()).toEqual(magnitude);
  });

  test("#setMagnitude", () => {
    const a = new Vector(1, 0);

    expect(a.setMagnitude(3)).toEqual(new Vector(3, 0));
  });

  test("#setMagnitude", () => {
    const a = new Vector(1, 1);
    const magnitude = Math.sqrt(Math.pow(5, 2) + Math.pow(5, 2));
    const vec = a.setMagnitude(magnitude);

    expect(vec.x).toBeCloseTo(5, 14);
    expect(vec.y).toBeCloseTo(5, 14);
  });

  test("#setMagnitude", () => {
    const a = new Vector(0, 0);

    expect(a.setMagnitude(1)).toEqual(new Vector(1, 0));
  });

  test("#add", () => {
    const a = new Vector(1.5, 0);
    const b = new Vector(0.5, 1);

    expect(a.add(b)).toEqual(new Vector(2, 1));
  });

  test("#subtract", () => {
    const a = new Vector(2, 1);
    const b = new Vector(0.5, 1);

    expect(a.subtract(b)).toEqual(new Vector(1.5, 0));
  });

  test("#multiply", () => {
    const a = new Vector(2, 1);

    expect(a.multiply(3)).toEqual(new Vector(6, 3));
  });

  test("#divide", () => {
    const a = new Vector(6, 3);

    expect(a.divide(3)).toEqual(new Vector(2, 1));
  });

  test("#copy", () => {
    const a = new Vector(6, 3);
    const b = a.copy();

    expect(a).toEqual(b);
    expect(a).not.toBe(b);
  });

  test("#toString", () => {
    const a = new Vector(6, 3);

    expect(a.toString()).toEqual("Vector(x: 6, y: 3)");
  });

  test("#toArray", () => {
    const a = new Vector(6, 3);

    expect(a.toArray()).toEqual([6, 3]);
  });

  test("#toObject", () => {
    const a = new Vector(6, 3);

    expect(a.toObject()).toEqual({ x: 6, y: 3 });
  });
});

describe("Particle", () => {
  test("#add", () => {
    const a = new Particle();
    const vec = new Vector(4, 3);

    expect(a.add(vec)).toEqual(
      new Particle(new Point(0, 0), 0, new Vector(4, 3))
    );
  });

  test("#setMagnitude", () => {
    const a = new Particle();

    expect(a.setMagnitude(5)).toEqual(
      new Particle(new Point(0, 0), 0, new Vector(5, 0))
    );
  });

  test("#next", () => {
    const a = new Particle(new Point(0, 0), 0, new Vector(5, 0));

    expect(a.next()).toEqual(
      new Particle(new Point(5, 0), 0, new Vector(5, 0))
    );
  });

  test("#getAngle", () => {
    const a = new Particle();
    const b = new Particle(new Point(1, 1));

    expect(a.getAngle(b)).toEqual(Math.PI / 4);
  });

  test("#getDistance", () => {
    const a = new Particle();
    const b = new Particle(new Point(3, 4));

    expect(a.getDistance(b)).toEqual(5);
  });

  test("#pull", () => {
    const a = new Particle();
    const b = new Particle(new Point(10, 0), 50);

    expect(a.pull(b)).toEqual(
      new Particle(new Point(0, 0), 0, new Vector(0.5, 0))
    );
  });

  test("#pull deflecting body", () => {
    const a = new Particle();
    const b = new Particle(new Point(10, 0), -50);
    const c = a.pull(b);

    expect(c.vec.x).toBeCloseTo(-0.5, 14);
    expect(c.vec.y).toBeCloseTo(0, 14);
  });

  test("#doesIntersect along path", () => {
    const a = new Particle(new Point(0, 0), 0, new Vector(1, 1));
    const b = new Particle(new Point(0, 1), 0, new Vector(1, -1));

    expect(a.doesIntersect(b)).toEqual(true);
  });

  test("#doesIntersect at start", () => {
    const a = new Particle(new Point(0, 0), 0, new Vector(1, 0));
    const b = new Particle(new Point(0, 0), 0, new Vector(0, 1));

    expect(a.doesIntersect(b)).toEqual(true);
  });

  test("#doesIntersect at end", () => {
    const a = new Particle(new Point(0, 1), 0, new Vector(1, -1));
    const b = new Particle(new Point(0, 0), 0, new Vector(1, 0));

    expect(a.doesIntersect(b)).toEqual(true);
  });

  test("#doesIntersect parallel does not count as intersection", () => {
    const a = new Particle(new Point(1, 0), 0, new Vector(2, 0));
    const b = new Particle(new Point(0, 0), 0, new Vector(2, 0));

    expect(a.doesIntersect(b)).toEqual(false);
  });
});
