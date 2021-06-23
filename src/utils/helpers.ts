/** We do not care about truly random string */
export const randomString = (n: number) =>
  Math.random().toString(36).substring(n);
