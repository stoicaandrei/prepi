export function isCuid(str: string) {
  // CUID format: c[a-z0-9]{24}
  const cuidPattern = /^c[a-z0-9]{24}$/;
  return cuidPattern.test(str);
}
