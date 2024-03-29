import { Vector3, Ray, Color, Sphere } from 'three';
const RATIO = 16 / 9;
const CANVAS_HEIGHT = 300;
const CANVAS_WIDTH = Math.floor(CANVAS_HEIGHT * RATIO);

function createhitrecord({p, normal, t}: {p: Vector3, normal: Vector3, t: number}) { 
  return {
    p, normal, t,
  }
}
function createSphere({ center, radius }: {
  center: Vector3,
  radius: number
}) {
  const sphere = new Sphere(center, radius)
  return {
    hit(ray: Ray, [ray_tmin, ray_tmax]: [number, number] ) {
      const oc = ray.origin.clone().sub(sphere.center);
      const a = ray.direction.clone().lengthSq()
      const half_b = oc.dot(ray.direction);
      const c = oc.lengthSq() - sphere.radius * sphere.radius;
      const discriminant = half_b * half_b - a * c;
      if (discriminant < 0) {
        return false
      }
      const sqrtd = Math.sqrt(discriminant)
      
      // find the nearest root athat lines in the range
      let root = (-half_b - sqrtd) / a;
      if (root <= ray_tmin || ray_tmax <= root) {
        root = (-half_b + sqrtd) / a
        if (root<=ray_tmin || ray_tmax <=root) {
          return false
        }
      }

      const t = root;
      const point = ray.at(root, new Vector3());
      const normal = point.sub(sphere.center).divideScalar(sphere.radius)
      return createhitrecord({t, p: point, normal})
    }
  }
}

function hitSphere(r: Ray, sphere: Sphere) {
  const oc = r.origin.clone().sub(sphere.center);
  const a = r.direction.clone().lengthSq()
  const half_b = oc.dot(r.direction);
  const c = oc.lengthSq() - sphere.radius * sphere.radius;
  const discriminant = half_b * half_b - a * c;
  if (discriminant < 0) {
    return -1
  } else {
    return (-half_b - Math.sqrt(discriminant)) / a
  }
  // const oc = r.origin.clone().sub(sphere.center);
  // const a = r.direction.clone().dot(r.direction)
  // const b = 2 * oc.clone().dot(r.direction);
  // const c = oc.clone().dot(oc) - sphere.radius*sphere.radius;
  // const discriminant = b * b - 4 * a * c;
  // if (discriminant < 0) {
  //   return -1.0;
  // }
  // return (-b - Math.sqrt(discriminant) ) / (2.0*a);
}

// function intersectSphere(ray: Ray, sphere: Sphere) {
//   const result = ray.intersectsSphere(sphere)
//   // const intersection = ray.intersectSphere(sphere, new Vector3())
//   // console.log('intersectSphere', {ray, sphere, result, intersection})
//   // debugger
//   return result
// }


const spherePos = new Vector3(0, 0, -1);
const sphere = new Sphere(spherePos.clone(), 0.5);
const sph = createSphere({center: spherePos.clone(), radius: 0.5},)
function computeRayColor(ray: Ray) {
  // NOTE: hitSphere approach
  const record = sph.hit(ray, [0, 2])
  if (record) {
    const { normal} = record;
    const {x, y, z} = normal;
    return new Color(x + 1, y + 1, z + 1).multiplyScalar(0.5)
  }

  // const t = hitSphere(ray, sphere);
  // if (t > 0) {
  //   const { x, y, z } = ray.at(t, new Vector3()).sub(spherePos).normalize()
  //   return new Color(x + 1, y + 1, z + 1).multiplyScalar(0.5)
  // }

  // TODO: see how to get threejs intersectSphere works
  // if (intersectSphere(ray, sphere)) {
  //   const intersectionPos = ray.intersectSphere(sphere, new Vector3());
  //   if (intersectionPos) {
  //     const {x, y, z} = intersectionPos.sub(spherePos.clone()).normalize();
  //     return new Color(x+1, y+1, z+1).multiplyScalar(0.5)
  //   }
  //   throw new Error('should never reach')
  // }

  const normalizedDirection = ray.direction.clone().normalize();
  const a = 0.5 * (normalizedDirection.y + 1);
  return new Color(1.0, 1.0, 1.0).multiplyScalar(1 - a).add(new Color(0.5, 0.7, 1.0).multiplyScalar(a))
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
      // console.log('camera', { ray_direction, i, j })
      const pixelColor = computeRayColor(ray);

      // const rn = i / (width - 1)
      // const gn = j / (height - 1)
      // const bn = 0;

      const { r: rn, g: gn, b: bn } = pixelColor;
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

console.log('camera coordinate\n', { pixel_delta_v, pixel_delta_u, pixel00_loc, viewport_width, viewport_height })


// function setupViewPort(width: number, height: number) {
//
//
// }

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

