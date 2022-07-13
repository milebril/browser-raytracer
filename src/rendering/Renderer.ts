import Geometry, { HitRecord } from '../core/geometry/Geometry';
import Line from '../core/geometry/Line';
import LineSegment from '../core/geometry/LineSegment';
import { Sphere } from '../core/geometry/Sphere';
import Triangle from '../core/geometry/Triangle';
import Ray from '../core/Ray';
import Color3 from '../utils/Color3';
import Vector3 from '../utils/math/Vector3';
import { Color4, ColorType, Point3 } from '../utils/types';

class Renderer {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  imageData: ImageData;

  canvasWidth: number;
  canvasHeight: number;

  // Camera Params
  origin: Point3;
  horizontal: Vector3;
  vertical: Vector3;
  lowerLeftCorner: Vector3;

  // Params
  samplesPerPixel = 5;

  constructor(canvas: HTMLCanvasElement, aspectRatio: number) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    this.canvasWidth = canvas.width;
    this.canvasHeight = canvas.height;
    this.imageData = this.context.getImageData(
      0,
      0,
      this.canvasWidth,
      this.canvasHeight,
    );

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

  clear() {
    this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  }

  sphere = new Sphere(new Vector3(0, 0, -2), 0.5);
  triangle = new Triangle(
    new Vector3(-1, -1, -1.3), // Left Point
    new Vector3(1, -1, -1.3), // Right Point
    new Vector3(0, 1, -2), // Top point
  );

  line = new Line(new Vector3(1, 0, -10), new Vector3(0, 1, 0));
  lineSegment = new LineSegment(new Vector3(2, 0, -10), new Vector3(3, 2, -10));

  sceneObjects: Geometry[] = [];

  populateScene(): void {
    this.sceneObjects.push(this.sphere);
    this.sceneObjects.push(new Sphere(new Vector3(0, -101, -5), 100));

    // this.sceneObjects.push(this.triangle);
    // this.sceneObjects.push(this.line);
    // this.sceneObjects.push(this.lineSegment);
  }

  rayColor(r: Ray): Color3 {
    // Loop over all the objects in the scene to find the intersection point
    let closestObject: Geometry;
    let closestObjectHR: HitRecord;

    for (const object of this.sceneObjects) {
      // Check if the ray intersects with the object
      const hitRecord = object.hit(r);

      if (
        hitRecord &&
        hitRecord.t > 0 &&
        (!closestObjectHR || hitRecord.t < closestObjectHR?.t)
      ) {
        closestObject = object;
        closestObjectHR = hitRecord.clone();

        // DEBUG
        if (r.direction.z === -1) {
          // debugger;
        }
      }
    }

    // Return the color at the spot that is hit
    if (closestObject && closestObjectHR) {
      return closestObject.getColor(r, closestObjectHR, ColorType.NORMAL);
    }

    // Background color
    const unitDirection = r.direction.normalize();
    const t = 0.5 * (unitDirection.y + 1.0);
    return new Color3(1.0, 1.0, 1.0)
      .scale(1 - t)
      .add(new Color3(0.5, 0.7, 1.0).scale(t));
  }

  async drawScreen() {
    this.clear();

    for (let j = this.canvasHeight - 1; j >= 0; --j) {
      // for (let j = 0; j < this.canvasHeight; j++) {
      for (let i = 0; i < this.canvasWidth; ++i) {
        let totalPixelColor = new Color3(0, 0, 0);
        for (let spp = 0; spp < this.samplesPerPixel; spp++) {
          const u = (i + Math.random()) / (this.canvasWidth - 1);
          const v = (j + Math.random()) / (this.canvasHeight - 1);
          const r = new Ray(
            this.origin,
            this.lowerLeftCorner
              .add(this.horizontal.scale(u))
              .add(this.vertical.scale(v))
              .subtract(this.origin),
          );

          // DEBUG: Stop at the center pixel
          // if (i === this.canvasWidth / 2 && j === this.canvasHeight / 2) {
          //   debugger;
          // }

          // Generate the color -- Main work that a ray does
          totalPixelColor = totalPixelColor.add(this.rayColor(r));
        }

        // console.log(totalPixelColor);
        // Draws the pixel in the image to the screen
        this.drawPixel(
          i,
          Math.abs(j - this.canvasHeight),
          totalPixelColor.toColor4(),
          this.samplesPerPixel,
        );
      }
    }
  }

  render() {
    this.context.putImageData(this.imageData, 0, 0);
  }

  drawGradient() {
    this.clear();

    for (let j = this.canvasHeight - 1; j >= 0; --j) {
      for (let i = 0; i < this.canvasWidth; ++i) {
        const r = i / this.canvasWidth;
        const g = j / this.canvasHeight;
        const b = 0.2;
        const ir = r;
        const ig = g;
        const ib = b;
        this.drawPixel(
          i,
          Math.abs(j - this.canvasHeight),
          [ir, ig, ib, 255],
          1,
        );
      }
    }
  }

  drawPixel(x: number, y: number, value: Color4, spp: number) {
    const offset = (y * this.canvasWidth + x) * 4;
    this.imageData.data[offset] = Math.floor(
      this.clamp(value[0] / spp, 0, 0.999) * 255,
    );
    this.imageData.data[offset + 1] = Math.floor(
      this.clamp(value[1] / spp, 0, 0.999) * 255,
    );
    this.imageData.data[offset + 2] = Math.floor(
      this.clamp(value[2] / spp, 0, 0.999) * 255,
    );
    this.imageData.data[offset + 3] = value[3];
  }

  clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }
}

export default Renderer;
