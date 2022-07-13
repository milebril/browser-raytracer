import Color3 from '../../utils/Color3';
import Vector3 from '../../utils/math/Vector3';
import { Point3 } from '../../utils/types';
import Ray from '../Ray';
import Geometry, { HitRecord } from './Geometry';

class LineSegment extends Geometry {
  pointA: Point3;
  pointB: Point3;

  constructor(pointA: Point3, pointB: Point3) {
    super('LineSegment');
    this.pointA = pointA;
    this.pointB = pointB;
  }

  // p13 == p1-p3 = point - r.origin = PO
  // p21 = direction
  // p43 = ray.direction
  hit(ray: Ray): HitRecord | null {
    const PO = this.pointA.subtract(ray.origin);
    const direction = this.pointB.subtract(this.pointA);

    const d1343 = Vector3.dot(PO, ray.direction);
    const d4321 = Vector3.dot(ray.direction, direction);
    const d1321 = Vector3.dot(PO, direction);
    const d4343 = Vector3.dot(ray.direction, ray.direction);
    const d2121 = Vector3.dot(direction, direction);

    const denom = d2121 * d4343 - d4321 * d4321;
    if (Math.abs(denom) < 1e-10) {
      return null;
    }

    const numer = d1343 * d4321 - d1321 * d4343;

    const mua = numer / denom;
    const mub = (d1343 + d4321 * mua) / d4343;

    const resultSegmentPoint1 = new Vector3(0, 0, 0);
    const resultSegmentPoint2 = new Vector3(0, 0, 0);

    resultSegmentPoint1.x = this.pointA.x + mua * direction.x;
    resultSegmentPoint1.y = this.pointA.y + mua * direction.y;
    resultSegmentPoint1.z = this.pointA.z + mua * direction.z;
    resultSegmentPoint2.x = ray.origin.x + mub * ray.direction.x;
    resultSegmentPoint2.y = ray.origin.y + mub * ray.direction.y;
    resultSegmentPoint2.z = ray.origin.z + mub * ray.direction.z;

    if (
      resultSegmentPoint1.subtract(resultSegmentPoint2).length() < 5e-2 &&
      resultSegmentPoint1.x >= this.pointA.x &&
      resultSegmentPoint1.x <= this.pointB.x &&
      resultSegmentPoint1.y >= this.pointA.y &&
      resultSegmentPoint1.y <= this.pointB.y &&
      resultSegmentPoint1.z >= this.pointA.z &&
      resultSegmentPoint1.z <= this.pointB.z
    )
      // return 1;
      return null;
  }

  getColor(_ray: Ray): Color3 {
    return new Color3(0.4, 0.3, 0.5);
  }
}

export default LineSegment;
