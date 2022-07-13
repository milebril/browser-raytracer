import Color3 from '../../utils/Color3';
import Vector3 from '../../utils/math/Vector3';
import { ColorType, Point3 } from '../../utils/types';
import Ray from '../Ray';

export class HitRecord {
  intersectionPoint: Point3;
  normal: Vector3;
  t: number;

  setFaceNormal(ray: Ray, outwardNormal: Vector3): void {
    const frontFace = Vector3.dot(ray.direction, outwardNormal) < 0;
    this.normal = frontFace ? outwardNormal : outwardNormal.scale(-1);
  }

  clone(): HitRecord {
    const clonedHR = new HitRecord();
    clonedHR.intersectionPoint = this.intersectionPoint.clone();
    clonedHR.normal = this.normal.clone();
    clonedHR.t = this.t;
    return clonedHR;
  }
}

abstract class Geometry {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  abstract hit(_ray: Ray): HitRecord | null;
  abstract getColor(_ray: Ray, _dist: HitRecord, _type?: ColorType): Color3;
}

export default Geometry;
