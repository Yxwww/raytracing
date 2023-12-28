import { Vector3, Ray, Color } from 'three';
const RATIO = 16 / 9;
const CANVAS_HEIGHT = 300;
const CANVAS_WIDTH = Math.floor(CANVAS_HEIGHT * RATIO);


function computeRayColor(ray: Ray) {
  const normalizedDirection = ray.direction.clone().normalize();
  const a = 0.5 * (normalizedDirection.y + 1);
  return new Color(1.0, 1.0, 1.0).multiplyScalar(1-a).add(new Color(0.5, 0.7, 1.0).multiplyScalar(a))
}
export async function run(canvas: HTMLCanvasElement) {
  const width = CANVAS_WIDTH;
  const height = CANVAS_HEIGHT

  const { ctx } = prepCanvas(canvas, width, height);

  for (let j = 0; j < height; j++) {
    for (let i = 0; i < width; i++) {
      const pixel_center = pixel00_loc.clone().add(pixel_delta_u.clone().multiplyScalar(i)).add(pixel_delta_v.clone().multiplyScalar(j))
      const ray_direction = pixel_center.sub(camera_center);
      const ray = new Ray(camera_center.clone(), ray_direction);
      const pixelColor = computeRayColor(ray);

      // const rn = i / (width - 1)
      // const gn = j / (height - 1)
      // const bn = 0;

      const {r: rn, g: gn, b: bn} = pixelColor;
      const r = 255.999 * rn;
      const g = 255.999 * gn;
      const b = 255.999 * bn;


      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 1)`;
      ctx.fillRect(i, j, 1, 1);
    }
  }
}


const focal_length = 1;
const viewport_height = 2;
const viewport_width = 2 * RATIO;
const camera_center = new Vector3(0, 0, 0);
const viewport_u = new Vector3(viewport_width, 0, 0)
const viewport_v = new Vector3(0, -viewport_height, 0)

const pixel_delta_u = viewport_u.clone().divideScalar(CANVAS_WIDTH);
const pixel_delta_v = viewport_v.clone().divideScalar(CANVAS_HEIGHT);
const viewport_upper_left = camera_center.clone().sub(new Vector3(0, 0, focal_length)).sub(viewport_u.divideScalar(2)).sub(viewport_v.divideScalar(2))
const pixel00_loc = viewport_upper_left.clone().add(pixel_delta_u.clone().add(pixel_delta_v).multiplyScalar(0.5));

function setupViewPort(width: number, height: number) {


}

function prepCanvas(canvas: HTMLCanvasElement, width: number, height: number) {
  canvas.width = width;
  canvas.height = height;
  canvas.style.width = width + 'px'
  canvas.style.height = height + 'px'
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('2d context not found');
  console.log(`Creating canvas of ${width},${height}`)
  return {
    ctx,
  }
}

