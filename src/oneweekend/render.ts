import {Vector3, Ray} from 'three';
const RATIO = 16/9;
const CANVAS_WIDTH = 256;
const CANVAS_HEIGHT = Math.floor(256/RATIO);

// const vec = new Vector3();
// const ray = new Ray()
// const pos = ray.at(4, target)
export async function run(canvas: HTMLCanvasElement) {
  const width = CANVAS_WIDTH;
  const height = CANVAS_HEIGHT
  canvas.width = width;
  canvas.height = height;
  canvas.style.width = width + 'px'
  canvas.style.height = height + 'px'
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('2d context not found');

  console.log(`Creating canvas of ${width},${height}`)

  for (let j = 0; j < height; j++) {
    for (let i = 0; i < width; i++) {
      const rn = i / (width - 1)
      const gn = j / (height - 1)
      const bn = 0;

      const r = 255.999 * rn;
      const g = 255.999 * gn;
      const b = 255.999 * bn;


      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 1)`;
      ctx.fillRect(i, j, 1, 1);
    }
  }
}

