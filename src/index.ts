import Renderer from './rendering/Renderer';

function component() {
  const aspectRatio = 16 / 9.0;
  const imageWidth = 800;
  const imageHeight = Math.floor(imageWidth / aspectRatio);
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  canvas.width = imageWidth;
  canvas.height = imageHeight;

  const renderer = new Renderer(canvas, aspectRatio);

  console.time('Render Time');
  // renderer.drawGradient();
  renderer.drawScreen();
  renderer.render();
  console.timeEnd('Render Time');
}

component();
