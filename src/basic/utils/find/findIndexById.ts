export const findIndexById = (array: any[], productId: string) => {
  return array.findIndex((item: any) => item.id === productId);
};
