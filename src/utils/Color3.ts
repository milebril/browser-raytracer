import { Color4 } from './types';

class Color3 {
  x: number;
  y: number;
  z: number;

  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  clone() {
    return new Color3(this.x, this.y, this.z);
  }

  add(vec: Color3) {
    return new Color3(this.x + vec.x, this.y + vec.y, this.z + vec.z);
  }

  subtract(vec: Color3) {
    return new Color3(this.x - vec.x, this.y - vec.y, this.z - vec.z);
  }

  multiply(vec: Color3) {
    return new Color3(this.x * vec.x, this.y * vec.y, this.z * vec.z);
  }

  scale(n: number) {
    return new Color3(this.x * n, this.y * n, this.z * n);
  }

  divide(vec: Color3 | number) {
    if (vec instanceof Color3) {
      return new Color3(this.x / vec.x, this.y / vec.y, this.z / vec.z);
    } else return this.scale(1 / vec);
  }

  equals(vec: Color3): boolean {
    return this.x == vec.x && this.y == vec.y && this.z == vec.z;
  }

  dot(vec: Color3): number {
    return this.x * vec.x + this.y * vec.y + this.z * vec.z;
  }

  cross(vec: Color3): Color3 {
    return new Color3(
      this.y * vec.z - this.z * vec.y,
      this.z * vec.x - this.x * vec.z,
      this.x * vec.y - this.y * vec.x,
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

  angleTo(a: Color3): number {
    return Math.acos(this.dot(a) / (this.length() * a.length()));
  }

  toArray() {
    return [this.x, this.y, this.z];
  }

  toColor4(): Color4 {
    return [this.x, this.y, this.z, 255];
  }
}

export default Color3;
