class Vector3 {
  x: number;
  y: number;
  z: number;

  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  clone() {
    return new Vector3(this.x, this.y, this.z);
  }

  add(vec: Vector3) {
    return new Vector3(this.x + vec.x, this.y + vec.y, this.z + vec.z);
  }

  subtract(vec: Vector3) {
    return new Vector3(this.x - vec.x, this.y - vec.y, this.z - vec.z);
  }

  multiply(vec: Vector3) {
    return new Vector3(this.x * vec.x, this.y * vec.y, this.z * vec.z);
  }

  scale(n: number) {
    return new Vector3(this.x * n, this.y * n, this.z * n);
  }

  divide(vec: Vector3 | number) {
    if (vec instanceof Vector3) {
      return new Vector3(this.x / vec.x, this.y / vec.y, this.z / vec.z);
    } else return this.scale(1 / vec);
  }

  equals(vec: Vector3): boolean {
    return this.x == vec.x && this.y == vec.y && this.z == vec.z;
  }

  dot(vec: Vector3): number {
    return this.x * vec.x + this.y * vec.y + this.z * vec.z;
  }

  static dot(vec1: Vector3, vec2: Vector3): number {
    return vec1.x * vec2.x + vec1.y * vec2.y + vec1.z * vec2.z;
  }

  cross(vec: Vector3): Vector3 {
    return new Vector3(
      this.y * vec.z - this.z * vec.y,
      this.z * vec.x - this.x * vec.z,
      this.x * vec.y - this.y * vec.x,
    );
  }

  static cross(vec1: Vector3, vec2: Vector3): Vector3 {
    return new Vector3(
      vec1.y * vec2.z - vec1.z * vec2.y,
      vec1.z * vec2.x - vec1.x * vec2.z,
      vec1.x * vec2.y - vec1.y * vec2.x,
    );
  }

  length() {
    return Math.sqrt(this.dot(this));
  }

  lengthSquared() {
    return this.dot(this);
  }

  normalize() {
    return this.divide(this.length());
  }

  angleTo(a: Vector3): number {
    return Math.acos(this.dot(a) / (this.length() * a.length()));
  }

  toArray() {
    return [this.x, this.y, this.z];
  }

  static random(): Vector3 {
    return new Vector3(Math.random(), Math.random(), Math.random());
  }

  static randomBetween(min: number, max: number): Vector3 {
    return new Vector3(
      Math.random() * (max - min) + min,
      Math.random() * (max - min) + min,
      Math.random() * (max - min) + min,
    );
  }

  static randomInUnitSphere(): Vector3 {
    let vec: Vector3;

    while (vec == undefined) {
      const tmp = Vector3.randomBetween(-1, 1);
      if (tmp.lengthSquared() >= 1) continue;
      vec = tmp;
    }

    return vec;
  }

  static randomUnitVector(): Vector3 {
    return this.randomInUnitSphere().normalize();
  }
}

export default Vector3;
