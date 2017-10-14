export class Line {
  private _x1: number;
  private _x2: number;
  private _y1: number;
  private _y2: number;

  constructor(x1, x2, y1, y2) {
    this._x1 = x1;
    this._x2 = x2;
    this._y1 = y1;
    this._y2 = y2;
  }

  get x1(): number {
    return this._x1;
  }

  set x1(value: number) {
    this._x1 = value;
  }

  get x2(): number {
    return this._x2;
  }

  set x2(value: number) {
    this._x2 = value;
  }

  get y1(): number {
    return this._y1;
  }

  set y1(value: number) {
    this._y1 = value;
  }

  get y2(): number {
    return this._y2;
  }

  set y2(value: number) {
    this._y2 = value;
  }
}
