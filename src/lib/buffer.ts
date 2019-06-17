export class Buffer {
  private _buff: Array<any>;
  public length: number;
  public bufferedLength: number;

  constructor(public readonly maxLength: number) {
    this._buff = [];
    this.length = 0;
    this.bufferedLength = 0;
  }

  last() {
    return this._buff[this._buff.length - 1];
  }

  add(el: any): number {
    const length = this._buff.push(el);

    if (length > this.maxLength) {
      this._buff.shift();
    }

    this.length++;
    this.bufferedLength = this._buff.length;

    return this.length;
  }

  pairs() {
    if (this._buff.length >= 1) {
      return this._buff.slice(1).reduce((m, el, i) => {
        m.push([this._buff[i], el]);
        return m;
      }, []);
    }
  }
}
