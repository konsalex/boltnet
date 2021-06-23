export function assertPromise(conidtion: boolean): asserts conidtion {
  if (!conidtion) {
    throw new Error('not excepting a promise');
  }
}
