export const fuse = (...fns) => {
  fns.forEach((fn) => {
    try {
      fn();
    } catch (err) {
      console.error(`Function name: "${fn.name}": \n`, err);
    }
  });
};
