export function raf(callback: () => void) {
  let rafId: number | undefined;

  const frameFn = () => {
    callback()
    rafId = requestAnimationFrame(frameFn);
  }

  frameFn();

  return () => {
    if (rafId !== undefined) {
      cancelAnimationFrame(rafId)
    }
  }
}


export function wait(frames = 0) {
  return new Promise<void>((res)=>{
    let count = 0 
    const cancel = raf(() => {
      if (count === frames) {
        cancel()
        res();
        return;
      }
      count ++ ;
    })
  })
}
