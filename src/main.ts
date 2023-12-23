import './style.css'
import {run} from './oneweekend/index'

export function createApp(dom: HTMLElement) {
  const canvas = dom.querySelector<HTMLCanvasElement>('#canvas');
  if (!canvas) throw new Error('Canvas not found');
  return {
    init() {
      run(canvas);
    }
  }
}
