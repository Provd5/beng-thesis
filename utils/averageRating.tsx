export const averageRating = (
  array: {
    rate: number;
  }[]
): number => {
  const sum = array.reduce((acc, num) => acc + num.rate, 0);
  return array.length === 0 ? 0 : parseFloat((sum / array.length).toFixed(1));
};
