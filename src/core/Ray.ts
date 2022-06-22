import Vector3 from '../utils/math/Vector3';
import { Point3 } from '../utils/types';

class Ray {
  origin: Point3;
  direction: Vector3;

  constructor(origin: Point3, direction: Vector3) {
    this.origin = origin;
    this.direction = direction;
  }

  cast(t: number): Point3 {
    return this.origin.add(this.direction.scale(t));
  }
}

export default Ray;
