import Geometry, { HitRecord } from '../core/geometry/Geometry';
import Line from '../core/geometry/Line';
import LineSegment from '../core/geometry/LineSegment';
import { Sphere } from '../core/geometry/Sphere';
import Triangle from '../core/geometry/Triangle';
import Ray from '../core/Ray';
import Color3 from '../utils/Color3';
import Vector3 from '../utils/math/Vector3';
import { Color4 } from '../utils/types';
import Camera from './Camera';

const params = {
  spp: 10,
  colorNormals: true,
  maxDepth: 30,
};

class Renderer {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  imageData: ImageData;

  canvasWidth: number;
  canvasHeight: number;

  // Camera Params
  camera: Camera;

  constructor(canvas: HTMLCanvasElement) {
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

    this.camera = new Camera();
  }

  clear() {
    this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  }

  sphere = new Sphere(new Vector3(0, 0, -1), 0.5);
  triangle = new Triangle(
    new Vector3(-1, -1, -1.3), // Left Point
    new Vector3(1, -1, -1.3), // Right Point
    new Vector3(0, 1, -2), // Top point
  );

  // line = new Line(new Vector3(1, 0, -10), new Vector3(0, 1, 0));
  // lineSegment = new LineSegment(new Vector3(2, 0, -10), new Vector3(3, 2, -10));

  sceneObjects: Geometry[] = [];

  populateScene(): void {
    this.sceneObjects.push(this.sphere);
    this.sceneObjects.push(new Sphere(new Vector3(0, -100.5, -5), 100));

    // this.sceneObjects.push(this.triangle);
    // this.sceneObjects.push(this.line);
    // this.sceneObjects.push(this.lineSegment);
  }

  rayColor(r: Ray, depth: number): Color3 {
    // Loop over all the objects in the scene to find the intersection point
    let closestObject: Geometry;
    let closestObjectHR: HitRecord;

    if (depth <= 0) return new Color3(0, 0, 0);

    for (const object of this.sceneObjects) {
      // Check if the ray intersects with the object
      const hitRecord = object.hit(r);

      if (
        hitRecord &&
        hitRecord.t > 0.001 &&
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
      // return closestObject.getColor(
      //   r,
      //   closestObjectHR,
      //   params.colorNormals ? ColorType.NORMAL : ColorType.DEFAULT,
      // );
      const target = closestObjectHR.intersectionPoint
        .add(closestObjectHR.normal)
        .add(Vector3.randomUnitVector());
      return this.rayColor(
        new Ray(
          closestObjectHR.intersectionPoint,
          target.subtract(closestObjectHR.intersectionPoint).normalize(),
        ),
        --depth,
      ).scale(0.5);
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
      for (let i = 0; i < this.canvasWidth; ++i) {
        let totalPixelColor = new Color3(0, 0, 0);
        for (let spp = 0; spp < params.spp; spp++) {
          const u = (i + Math.random()) / (this.canvasWidth - 1);
          const v = (j + Math.random()) / (this.canvasHeight - 1);
          const r = this.camera.getRay(u, v);

          // DEBUG: Stop at the center pixel
          // if (i === this.canvasWidth / 2 && j === this.canvasHeight / 2) {
          //   debugger;
          // }

          // Generate the color -- Main work that a ray does
          totalPixelColor = totalPixelColor.add(
            this.rayColor(r, params.maxDepth),
          );
        }

        // console.log(totalPixelColor);
        // Draws the pixel in the image to the screen
        this.drawPixel(
          i,
          Math.abs(j - this.canvasHeight),
          totalPixelColor.toColor4(),
        );
      }
      // this.render();
      // await new Promise((r) => setTimeout(r, 10));
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
        this.drawPixel(i, Math.abs(j - this.canvasHeight), [ir, ig, ib, 255]);
      }
    }
  }

  drawPixel(x: number, y: number, value: Color4) {
    const offset = (y * this.canvasWidth + x) * 4;
    this.imageData.data[offset] = Math.floor(
      this.clamp(Math.sqrt(value[0] / params.spp), 0, 0.999) * 255,
    );
    this.imageData.data[offset + 1] = Math.floor(
      this.clamp(Math.sqrt(value[1] / params.spp), 0, 0.999) * 255,
    );
    this.imageData.data[offset + 2] = Math.floor(
      this.clamp(Math.sqrt(value[2] / params.spp), 0, 0.999) * 255,
    );
    this.imageData.data[offset + 3] = value[3];
  }

  clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }
}

export default Renderer;
