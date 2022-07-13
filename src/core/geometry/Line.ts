import Color3 from '../../utils/Color3';
import Vector3 from '../../utils/math/Vector3';
import { Point3 } from '../../utils/types';
import Ray from '../Ray';
import Geometry, { HitRecord } from './Geometry';

class Line extends Geometry {
  point: Point3;
  direction: Vector3;

  constructor(point: Point3, direction: Vector3) {
    super('Line');
    this.point = point;
    this.direction = direction;
  }

  // p13 == p1-p3 = point - r.origin = PO
  // p21 = direction
  // p43 = ray.direction
  hit(ray: Ray): HitRecord | null {
    const PO = this.point.subtract(ray.origin);

    const d1343 = Vector3.dot(PO, ray.direction);
    const d4321 = Vector3.dot(ray.direction, this.direction);
    const d1321 = Vector3.dot(PO, this.direction);
    const d4343 = Vector3.dot(ray.direction, ray.direction);
    const d2121 = Vector3.dot(this.direction, this.direction);

    const denom = d2121 * d4343 - d4321 * d4321;
    if (Math.abs(denom) < 1e-10) {
      return null;
    }

    const numer = d1343 * d4321 - d1321 * d4343;

    const mua = numer / denom;
    const mub = (d1343 + d4321 * mua) / d4343;

    const resultSegmentPoint1 = new Vector3(0, 0, 0);
    const resultSegmentPoint2 = new Vector3(0, 0, 0);

    resultSegmentPoint1.x = this.point.x + mua * this.direction.x;
    resultSegmentPoint1.y = this.point.y + mua * this.direction.y;
    resultSegmentPoint1.z = this.point.z + mua * this.direction.z;
    resultSegmentPoint2.x = ray.origin.x + mub * ray.direction.x;
    resultSegmentPoint2.y = ray.origin.y + mub * ray.direction.y;
    resultSegmentPoint2.z = ray.origin.z + mub * ray.direction.z;

    if (resultSegmentPoint1.subtract(resultSegmentPoint2).length() < 1e-2) {
      return null;
      // return 1;
    } else {
      return null;
    }
  }

  getColor(_ray: Ray): Color3 {
    return new Color3(0.3, 0.9, 0.5);
  }
}

export default Line;
