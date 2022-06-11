import Renderer from "./rendering/Renderer";

function component() {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  const renderer = new Renderer(canvas);

  renderer.drawGradient();
  renderer.render();
}

component();
