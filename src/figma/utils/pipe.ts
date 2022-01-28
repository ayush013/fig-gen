export const pipe =
  (...functions: Function[]) =>
  (args: any) =>
    functions.reduce((arg, fn) => fn(arg), args);
