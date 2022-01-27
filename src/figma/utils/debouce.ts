export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): T => {
  let timer: ReturnType<typeof setTimeout>;
  return function (...args: any[]) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      // @ts-ignore
      func.apply(this, args);
    }, wait);
  } as T;
};
