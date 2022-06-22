import Line from '../core/geometry/Line';
import { Sphere } from '../core/geometry/Sphere';
import Triangle from '../core/geometry/Triangle';
import Ray from '../core/Ray';
import Color3 from '../utils/Color3';
import Vector3 from '../utils/math/Vector3';
import { Color4, Point3 } from '../utils/types';

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

  sphere = new Sphere(new Vector3(1, 0, -2), 0.5);
  triangle = new Triangle(
    new Vector3(-1, -1, -2),
    new Vector3(1, -1, -2),
    new Vector3(0, 1, -2),
  );
  line = new Line(new Vector3(1, 0, -10), new Vector3(0, 1, 0));
  rayColor(r: Ray): Color3 {
    if (this.sphere.hit(r)) {
      return this.sphere.getColor();
    } else if (this.triangle.hit(r)) {
      return this.triangle.getColor(r);
    } else if (this.line.hit(r)) {
      return this.line.getColor(r);
    }

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
        const u = i / (this.canvasWidth - 1);
        const v = j / (this.canvasHeight - 1);
        const r = new Ray(
          this.origin,
          this.lowerLeftCorner
            .add(this.horizontal.scale(u))
            .add(this.vertical.scale(v))
            .subtract(this.origin),
        );

        const pixelColor = this.rayColor(r);
        this.drawPixel(
          i,
          Math.abs(j - this.canvasHeight),
          pixelColor.toColor4(),
        );
      }
      this.render();
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
    this.imageData.data[offset] = Math.floor(value[0] * 255);
    this.imageData.data[offset + 1] = Math.floor(value[1] * 255);
    this.imageData.data[offset + 2] = Math.floor(value[2] * 255);
    this.imageData.data[offset + 3] = value[3];
  }
}

export default Renderer;
