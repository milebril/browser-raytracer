import { color4 } from "../utils/types";

class Renderer {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  imageData: ImageData;

  canvasWidth: number;
  canvasHeight: number;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
    this.canvasWidth = canvas.width;
    this.canvasHeight = canvas.height;
    this.imageData = this.context.getImageData(
      0,
      0,
      this.canvasWidth,
      this.canvasHeight
    );
  }

  clear() {
    this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  }

  render() {
    this.context.putImageData(this.imageData, 0, 0);
  }

  drawGradient() {
    this.clear();

    for (let j = this.canvasHeight - 1; j >= 0; j--) {
      for (let i = 0; i < this.canvasWidth; i++) {
        const r = i / this.canvasWidth;
        const g = j / this.canvasHeight;
        const b = 0.2;
        const ir = Math.floor(r * 256);
        const ig = Math.floor(g * 256);
        const ib = Math.floor(b * 256);
        this.drawPixel(i, j, [ir, ig, ib, 255]);
      }
    }
  }

  drawPixel(x: number, y: number, value: color4) {
    const offset = (y * this.canvasWidth + x) * 4;
    this.imageData.data[offset] = value[0];
    this.imageData.data[offset + 1] = value[1];
    this.imageData.data[offset + 2] = value[2];
    this.imageData.data[offset + 3] = value[3];
  }
}

export default Renderer;
