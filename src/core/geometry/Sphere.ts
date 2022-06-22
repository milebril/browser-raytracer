import Color3 from '../../utils/Color3';
import Vector3 from '../../utils/math/Vector3';
import { Point3 } from '../../utils/types';
import Ray from '../Ray';
import Geometry from './Geometry';

export class Sphere extends Geometry {
  center: Point3;
  radius: number;

  constructor(center: Point3, radius: number) {
    super('Sphere');
    this.center = center;
    this.radius = radius;
  }

  hit(ray: Ray): boolean {
    const oc = ray.origin.subtract(this.center);
    const a = Vector3.dot(ray.direction, ray.direction);
    const b = 2.0 * Vector3.dot(oc, ray.direction);
    const c = Vector3.dot(oc, oc) - this.radius * this.radius;
    const discriminant = b * b - 4 * a * c;
    return discriminant > 0;
  }

  getColor(_ray: Ray = null): Color3 {
    return new Color3(1, 0, 0);
  }
}
