export default function pipe(...callbacks: CallableFunction[]) {
  return function flow(firstArg?: any) {
    return callbacks.reduce((arg, callback) => {
      return callback(arg);
    }, firstArg);
  };
}
