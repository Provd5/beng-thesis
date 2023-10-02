export function arithmeticMeanOfScores(
  array: {
    score: number;
  }[]
): number {
  const sum = array.reduce((acc, num) => acc + num.score, 0);
  return array.length === 0 ? 0 : parseFloat((sum / array.length).toFixed(1));
}
