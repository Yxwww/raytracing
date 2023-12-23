console.log('main.js')
const image_width = 256;
const image_height = 256;
const contents = [
  `P3`,
  `${image_width} ${image_height}`,
  `255`,
];

export async function run(canvas: HTMLCanvasElement) {

  for (let j = 0; j < image_height; j++) {
    for (let i = 0; i < image_width; i++) {
      const rn = i / (image_width - 1)
      const gn = j / (image_height - 1)
      const bn = 0;

      const r = 255.999 * rn;
      const g = 255.999 * gn;
      const b = 255.999 * bn;

      contents.push(`${r} ${g} ${b}`);
    }
  }
}

