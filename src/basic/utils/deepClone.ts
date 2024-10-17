export const deepClone = (array: any[]) => {
  return JSON.parse(JSON.stringify(array));
};
