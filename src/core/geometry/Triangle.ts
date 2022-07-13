import Color3 from '../../utils/Color3';
import Vector3 from '../../utils/math/Vector3';
import { ColorType, Point3 } from '../../utils/types';
import Ray from '../Ray';
import Geometry, { HitRecord } from './Geometry';

class Triangle extends Geometry {
  private a: Point3;
  private b: Point3;
  private c: Point3;

  constructor(a: Point3, b: Point3, c: Point3) {
    super('Triangle');
    this.a = a;
    this.b = b;
    this.c = c;
  }

  hit(ray: Ray): HitRecord | null {
    // Efficient Implementation
    const E1 = this.b.subtract(this.a);
    const E2 = this.c.subtract(this.a);
    const N = Vector3.cross(E1, E2);

    const determinant = -Vector3.dot(ray.direction, N);
    const invertedDeterminant = 1 / determinant;
    const AO = ray.origin.subtract(this.a);
    const DAO = Vector3.cross(AO, ray.direction);
    const u = Vector3.dot(E2, DAO) * invertedDeterminant;
    const v = -Vector3.dot(E1, DAO) * invertedDeterminant;
    const t = Vector3.dot(AO, N) * invertedDeterminant;

    if (
      determinant >= 1e-6 &&
      t >= 0.0 &&
      u >= 0.0 &&
      v >= 0.0 &&
      u + v <= 1.0
    ) {
      const hitRecord = new HitRecord();
      hitRecord.t = t;
      hitRecord.intersectionPoint = ray.cast(hitRecord.t);
      hitRecord.setFaceNormal(ray, N.normalize());
      return hitRecord;
    } else {
      return null;
    }

    // Intersection point: R.Origin + t * R.Dir
    // The barycentric coordinates of the intersection in the triangle are u, v, 1-u-v
  }

  getColor(_ray: Ray, hitRecord: HitRecord, type = ColorType.DEFAULT): Color3 {
    if (type === ColorType.DEFAULT) {
      return new Color3(1, 0.4, 0.6);
    } else if (type === ColorType.NORMAL) {
      // console.log(hitRecord.normal.x, hitRecord.normal.y, hitRecord.normal.z);
      return new Color3(
        hitRecord.normal.x + 1,
        hitRecord.normal.y + 1,
        hitRecord.normal.z + 1,
      ).scale(0.5);
    }
  }
}

export default Triangle;
