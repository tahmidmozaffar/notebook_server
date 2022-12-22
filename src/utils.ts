export const split = (str: string, index: number) => {
  const result = [str.slice(0, index), str.slice(index)];

  return result;
};

export const toUpperFirstChar = (name: string) => {
  return name[0].toUpperCase() + name.slice(1);
};
