import Color3 from '../../utils/Color3';
import Vector3 from '../../utils/math/Vector3';
import { ColorType, Point3 } from '../../utils/types';
import Ray from '../Ray';
import Geometry, { HitRecord } from './Geometry';

export class Sphere extends Geometry {
  center: Point3;
  radius: number;

  constructor(center: Point3, radius: number) {
    super('Sphere');
    this.center = center;
    this.radius = radius;
  }

  hit(ray: Ray): HitRecord | null {
    const oc = ray.origin.subtract(this.center);
    const a = Vector3.dot(ray.direction, ray.direction);
    const b = 2.0 * Vector3.dot(oc, ray.direction);
    const c = Vector3.dot(oc, oc) - this.radius * this.radius;
    const discriminant = b * b - 4 * a * c;
    if (discriminant < 0) {
      return null;
    }

    const hitRecord = new HitRecord();
    hitRecord.t = (-b - Math.sqrt(discriminant)) / (2 * a);
    hitRecord.intersectionPoint = ray.cast(hitRecord.t);
    hitRecord.setFaceNormal(
      ray,
      hitRecord.intersectionPoint.subtract(this.center).normalize(),
    );

    return hitRecord;
  }

  getColor(_ray: Ray, record: HitRecord, type = ColorType.DEFAULT): Color3 {
    if (type === ColorType.DEFAULT) {
      return new Color3(1, 0, 0);
    } else if (type === ColorType.NORMAL) {
      return new Color3(
        record.normal.x + 1,
        record.normal.y + 1,
        record.normal.z + 1,
      ).scale(0.5);
    }
  }
}
