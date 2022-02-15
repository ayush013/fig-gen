export const pipe =
  (functions: Function[], ...additionalArgs: any[]) =>
  (args: any) =>
    functions.reduce((arg, fn) => fn(arg, ...additionalArgs), args);
