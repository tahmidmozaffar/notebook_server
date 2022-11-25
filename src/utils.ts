export const split = (str: string, index: number) => {
  const result = [str.slice(0, index), str.slice(index)];

  return result;
}
