// taken from https://github.com/mattdesl/raf-loop/blob/master/index.js
// modified to remove external dependencies

class Event {
  private _callbacks: Array<Function>;

  constructor(public name: string) {
    this._callbacks = [];
  }

  get callbacks() {
    return this._callbacks;
  }

  registerCallback(callback: Function) {
    this._callbacks.push(callback);
  }
}

class Reactor {
  private _events: { [index: string]: Event };

  constructor() {
    this._events = {};
  }

  registerEvent(eventName: string) {
    const event = new Event(eventName);
    this._events[eventName] = event;
  }

  dispatchEvent(eventName: string, ...eventArgs: any) {
    this._events[eventName].callbacks.forEach(function(callback) {
      callback(...eventArgs);
    });
  }

  addEventListener(eventName: string, callback: Function) {
    this._events[eventName].registerCallback(callback);
  }
}

export class Loop {
  public running: boolean;
  public last: number;
  private _reactor: Reactor;
  private _frame: number;

  constructor(callback?: Function) {
    this._reactor = new Reactor();
    this._reactor.registerEvent("tick");

    this.running = false;
    this.last = Date.now();
    this._frame = 0;

    if (callback) {
      this.addEventListener("tick", callback);
    }

    this.start();
  }

  dispatchEvent(eventName: string, ...eventArgs: any) {
    this._reactor.dispatchEvent(eventName, ...eventArgs);
  }

  addEventListener(eventName: string, callback: Function) {
    this._reactor.addEventListener(eventName, callback);
  }

  start() {
    if (this.running) {
      return;
    }
    this.running = true;
    this.last = Date.now();
    this._frame = requestAnimationFrame(() => this.tick());
    return this;
  }

  stop() {
    this.running = false;
    if (this._frame !== 0) {
      cancelAnimationFrame(this._frame);
    }
    this._frame = 0;
    return this;
  }

  tick() {
    this._frame = requestAnimationFrame(() => this.tick());
    const time = Date.now();
    const dt = time - this.last;
    this.dispatchEvent("tick", dt);
    this.last = time;
  }
}
