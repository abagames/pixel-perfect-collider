export default class Vector {
  x = 0;
  y = 0;

  constructor(x: number | Vector = 0, y: number = null) {
    this.set(x, y);
  }

  set(x: number | Vector, y: number = null) {
    if (x instanceof Vector) {
      this.x = x.x;
      this.y = x.y;
      return;
    }
    this.x = x;
    this.y = y == null ? x : y;
  }

  add(v: Vector) {
    this.x += v.x;
    this.y += v.y;
  }

  sub(v: Vector) {
    this.x -= v.x;
    this.y -= v.y;
  }
}
