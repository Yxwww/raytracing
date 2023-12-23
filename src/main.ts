import './style.css'
import {run} from './oneweekend/index'

const appRoot = document.querySelector<HTMLDivElement>('#app');
if (!appRoot) throw new Error('App root not found')

export function createApp(dom: HTMLDivElement) {
  const canvas = dom.querySelector<HTMLCanvasElement>('#canvas');
  if (!canvas) throw new Error('Canvas not found');
  return {
    init() {
      run(canvas);
    }
  }
}
const app = createApp(appRoot);
app.init();


