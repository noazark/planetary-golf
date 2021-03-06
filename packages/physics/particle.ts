/**
 * Primitive class for a geometric point.
 */
export class Point {
  constructor(
    /**
     * Point along the horizontal axis.
     */
    public readonly x: number,
    /**
     * Point along the vertical axis.
     */
    public readonly y: number
  ) {}

  /**
   * Returns a vector to another point.
   *
   * ```typescript
   * const a = new Point(3, 4)
   * const b = new Point(7, 9)
   *
   * a.getVector(b) // Vector(x: 4, y: 5)
   * ```
   */
  getVector(b: Point) {
    return new Vector(b.x - this.x, b.y - this.y);
  }

  /**
   * Returns the angle, in radians, to another point.
   *
   * ```typescript
   * const a = new Point(0, 0)
   * const b = new Point(1, 1)
   *
   * a.getAngle(b) // π * 0.25
   * ```
   *
   * @returns Angle (in radians)
   */
  getAngle(b: Point) {
    return this.getVector(b).getDirection();
  }

  /**
   * Returns the distance to another point.
   *
   * ```typescript
   * const a = new Point(0, 0)
   * const b = new Point(0, 12)
   *
   * a.getDistance(b) // 12
   * ```
   */
  getDistance(b: Point) {
    return this.getVector(b).getMagnitude();
  }

  /**
   * Translates the point along a given vector.
   *
   * @param vec - The force vector defining the translation.
   *
   * @returns Point after translation.
   */
  translate(vec: Vector) {
    const _x = this.x + vec.x;
    const _y = this.y + vec.y;
    return new Point(_x, _y);
  }

  toObject() {
    return { x: this.x, y: this.y };
  }
}

/**
 * Primitive class for a geometric vector.
 */
export class Vector {
  constructor(public readonly x: number = 0, public readonly y: number = 0) {}

  /**
   * Creates a vector from an Euclidean vector definition (magnitude and
   * direction).
   */
  static fromEuclidean(magnitude: number, direction: number) {
    const x = Math.cos(direction) * magnitude;
    const y = Math.sin(direction) * magnitude;
    return new Vector(x, y);
  }

  /**
   * Return the direction of the vector.
   */
  getDirection() {
    return Math.atan2(this.y, this.x);
  }

  /**
   * Returns a copy of the vector after a new direction has been set.
   *
   * @param direction - The new angle of the vector (in radians).
   */
  setDirection(direction: number) {
    var magnitude = this.getMagnitude();
    return Vector.fromEuclidean(magnitude, direction);
  }

  /**
   * Return the magnitude of the vector.
   */
  getMagnitude(): number {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }

  /**
   * Returns a copy of the vector after a new magnitude has been set.
   *
   * @param magnitude - The new magnitude of the vector.
   */
  setMagnitude(magnitude: number) {
    var direction = this.getDirection();
    return Vector.fromEuclidean(magnitude, direction);
  }

  /**
   * Returns the sum of the two vectors.
   *
   * @param b - The vector to be added.
   */
  add(b: Vector): Vector {
    return new Vector(this.x + b.x, this.y + b.y);
  }

  /**
   * Returns the difference of the two vectors.
   *
   * @param b - The vector to be subtracted.
   */
  subtract(b: Vector): Vector {
    return new Vector(this.x - b.x, this.y - b.y);
  }

  /**
   * Returns the multiplied vector.
   *
   * @param b - The scalar multiplier.
   */
  multiply(scalar: number): Vector {
    return new Vector(this.x * scalar, this.y * scalar);
  }

  /**
   * Returns the divided vector.
   *
   * @param b - The scalar divisor.
   */
  divide(scalar: number): Vector {
    return new Vector(this.x / scalar, this.y / scalar);
  }

  /**
   * Returns a new copy of the vector.
   */
  copy(): Vector {
    return new Vector(this.x, this.y);
  }

  /**
   * Returns the vector as a string.
   *
   * ```typescript
   * const vec = new Vector(3, 4)
   *
   * vec.toString() // "Vector(x: 3, y: 4)"
   * ```
   */
  toString(): string {
    return "Vector(x: " + this.x + ", y: " + this.y + ")";
  }

  /**
   * Returns the vector as an array pair, `[x, y]`.
   *
   * ```typescript
   * const vec = new Vector(3, 4)
   *
   * vec.toArray() // [3, 4]
   * ```
   */
  toArray(): Array<number> {
    return [this.x, this.y];
  }

  /**
   * Returns the vector as an object, `{x, y}`.
   *
   * ```typescript
   * const vec = new Vector(3, 4)
   *
   * vec.toObject() // {x: 3, y: 4}
   * ```
   */
  toObject(): Object {
    return { x: this.x, y: this.y };
  }
}

/**
 * Primitive class for a particle.
 */
export class Particle {
  constructor(
    /**
     * Position of the particle in space.
     */
    public readonly pos: Point = new Point(0, 0),
    /**
     * Mass of the particle.
     */
    public readonly mass: number = 0,
    /**
     * Force vector of the particle.
     */
    public readonly vec: Vector = new Vector(0, 0),
    /**
     * A boolean of whether the particle is fixed in space.
     */
    public readonly fixed: boolean = false
  ) {}

  /**
   * Add's a new force vector onto the particle.
   *
   * @param v - A vector to add to the particle's force.
   */
  add(v: Vector) {
    const _vec = this.vec.add(v);
    return new Particle(this.pos, this.mass, _vec, this.fixed);
  }

  /**
   * Returns a copy of the particle after a new magnitude has been set on it's
   * vector.
   *
   * @param magnitude - The new magnitude of the vector.
   */
  setMagnitude(magnitude: number) {
    const _vec = this.vec.setMagnitude(magnitude);
    return new Particle(this.pos, this.mass, _vec, this.fixed);
  }

  /**
   * Returns a new particle who's position has been translated by the current
   * force vector.
   */
  next(dt: number) {
    return new Particle(
      this.pos.translate(this.vec.multiply(dt)),
      this.mass,
      this.vec,
      this.fixed
    );
  }

  /**
   * Returns the angle, in radians, to another particle.
   *
   * @param body - The foreign body to calculate the angle (in radians) to.
   */
  getAngle(body: Particle) {
    return this.pos.getAngle(body.pos);
  }

  /**
   * Returns the distance to another particle.
   *
   * @param body - The foreign body to calculate the distance to.
   */
  getDistance(body: Particle) {
    return this.pos.getDistance(body.pos);
  }

  /**
   * Detects an intersection between one's own and another particle's path.
   *
   * @param body - The foreign body to detect intersection on.
   */
  doesIntersect(body: Particle) {
    const { x: a, y: b } = this.pos;
    const c = a + this.vec.x;
    const d = b + this.vec.y;

    const { x: p, y: q } = body.pos;
    const r = p + body.vec.x;
    const s = q + body.vec.y;

    if (
      (this.pos.x === body.pos.x && this.pos.y === body.pos.y) ||
      (c === r && d === s)
    ) {
      return true;
    }

    const det = (c - a) * (s - q) - (r - p) * (d - b);
    if (det === 0) {
      // lines are parallel, no intersection
      return false;
    } else {
      const lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
      const gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
      return 0 < lambda && lambda < 1 && (0 < gamma && gamma < 1);
    }
  }

  /**
   * Fake gravitational pull engine.
   *
   * This isn't the real world folks. Particles can still be attracted w/ zero
   * mass. Time is irrelevant in the matrix.
   *
   * > F = G * m1 * m2 / d^2
   *
   * @param body
   */
  getForceMagnitude(body: Particle) {
    const m2 = body.mass;
    const distance = this.getDistance(body);
    const force = m2 / distance ** 2;

    return force;
  }

  getForceDirection(body: Particle) {
    const theta = this.getAngle(body);

    // supporting both attractors and deflectors
    return theta - (body.mass < 0 ? 2 * Math.PI : 0);
  }

  /**
   * Calculates the force to be applied through the attraction of another
   * foreign body. Returns a new copy of this particle, with the new force
   * vector.
   *
   * @param body - The foreign body (attractor) doing the pulling.
   */
  pull(body: Particle, dt: number) {
    const magnitude = this.getForceMagnitude(body);
    const direction = this.getForceDirection(body);

    const vec = Vector.fromEuclidean(magnitude, direction);

    return this.add(vec.multiply(dt));
  }
}
