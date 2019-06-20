import Collider from "@planitary-golf/physics/collider";
import { Particle } from "@planitary-golf/physics/particle";
import { CanvasObject, Circle, Path } from "./canvas";

/**
 * Returns each element in the array (or array-like) with it's adjacent pair.
 *
 * Example: Array pairs
 *
 * ```typescript
 * pairs(['a', 'b', 'c']) // [['a', 'b'], ['b', 'c']]
 * ```
 *
 * Example: Buffer pairs
 *
 * ```typescript
 *
 * const buffer = new Buffer()
 *
 * buffer.add(1)
 * buffer.add(2)
 * buffer.add(3)
 * buffer.add(4)
 *
 * pairs(buffer.toArray()) // [[1, 2], [2, 3], [3, 4]]
 * ```
 */
function pairs(array: Array<any>): Array<Array<any>> {
  return array.slice(1).reduce((m: Array<any>, el: any, i: number) => {
    m.push([array[i], el]);
    return m;
  }, []);
}

/**
 * Buffer
 *
 * Keeps a limited number of items in memory
 */
export class Buffer {
  /**
   * Total number of elements added to buffer. Cannot be larger than the
   * [[maxLength]].
   */
  public length: number;
  /**
   * Number of elements currently in buffer. This includes elements that may no
   * longer be buffered.
   */
  public bufferedLength: number;
  private _buff: Array<any>;

  constructor(
    /**
     * Maximum length of the buffer.
     */
    public readonly maxLength: number
  ) {
    this.length = 0;
    this.bufferedLength = 0;
    this._buff = [];
  }

  /**
   * Returns the last element in the buffer.
   */
  last() {
    return this._buff[this._buff.length - 1];
  }

  /**
   * Add an element to the buffer. In the case a buffer is full,
   * the first element in the buffer will be evicted.
   *
   * @param el - Element to be added.
   */
  add(el: any): number {
    const length = this._buff.push(el);

    if (length > this.maxLength) {
      this._buff.shift();
    }

    this.length++;
    this.bufferedLength = this._buff.length;

    return this.length;
  }

  /**
   * Converts the buffer to an array.
   */
  toArray(): Array<any> {
    return [...this._buff];
  }
}

export class Frame extends Array<CanvasObject> {}

export interface RenderConfig {
  maxFrames: number;
  tailLength: number;
  energyMultiplier: number;
  showVector: boolean;
  showParticle: boolean;
}
export class Renderer {
  private colliders: Buffer;

  constructor(public moves: Collider, public config: RenderConfig) {
    this.colliders = new Buffer(config.tailLength);
  }

  render() {
    let objects: Array<CanvasObject> = [];

    if (this.config.showParticle) {
      objects = [
        ...objects,
        ...this.moves.particles.map((body: Particle, i: number) => {
          return new Circle({
            c: body.pos,
            r: Math.max(1, Math.abs(body.mass / 4)),
            fillStyle: "rgba(255, 255, 255, .3)"
          });
        })
      ];
    }

    objects = [
      ...objects,
      ...pairs(this.colliders.toArray()).reduce(
        (frame: Frame, [_m0, _m2]: Array<Collider>) => {
          const segments = _m2.particles.map((body: Particle, i: number) => {
            const magnitude = body.vec.getMagnitude();
            const mag = Math.min(magnitude * this.config.energyMultiplier, 1);
            const p0 = _m0.particles[i].pos;
            const p1 = body.pos;

            return new Path({
              line: [p0, p1],
              strokeStyle: `hsl(${360 - mag * 360}, 100%, 50%)`
            });
          });
          return [...frame, ...segments];
        },
        []
      )
    ];

    if (this.config.showVector) {
      objects = [
        ...objects,
        ...this.moves.particles.map((body: Particle, i: number) => {
          return new Path({
            line: [body.pos, body.pos.translate(body.vec.multiply(10))],
            strokeStyle: "rgba(255, 255, 255, 1)"
          });
        })
      ];
    }

    return objects;
  }

  [Symbol.iterator]() {
    return {
      next: (dt: number) => {
        this.moves = this.moves.next(dt);
        this.colliders.add(this.moves);

        if (this.colliders.length >= this.config.maxFrames) {
          return { value: [], done: true };
        }

        if (this.colliders.length >= 1) {
          return { value: this, done: false };
        } else {
          return { value: [], done: false };
        }
      }
    };
  }
}

export function draw(ctx: CanvasRenderingContext2D, frame: Frame) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  frame.forEach((seg: CanvasObject) => seg.render(ctx));
}
