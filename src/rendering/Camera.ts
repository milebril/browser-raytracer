import Ray from '../core/Ray';
import Vector3 from '../utils/math/Vector3';
import { Point3 } from '../utils/types';

export default class Camera {
  private origin: Point3;
  private horizontal: Vector3;
  private vertical: Vector3;
  private lowerLeftCorner: Vector3;

  constructor() {
    const aspectRatio = 16 / 9;
    const viewport_height = 2.0;
    const viewport_width = aspectRatio * viewport_height;
    const focal_length = 1.0;

    this.origin = new Point3(0, 0, 0);
    this.horizontal = new Vector3(viewport_width, 0, 0);
    this.vertical = new Vector3(0, viewport_height, 0);
    this.lowerLeftCorner = this.origin
      .subtract(this.horizontal.divide(2))
      .subtract(this.vertical.divide(2))
      .subtract(new Vector3(0, 0, focal_length));
  }

  getRay(u: number, v: number): Ray {
    return new Ray(
      this.origin,
      this.lowerLeftCorner
        .add(this.horizontal.scale(u))
        .add(this.vertical.scale(v))
        .subtract(this.origin),
    );
  }
}
