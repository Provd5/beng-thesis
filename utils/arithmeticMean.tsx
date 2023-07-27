export function arithmeticMeanOfScores(
  array: {
    score: number;
  }[]
) {
  {
    const sum = array.reduce((acc, num) => acc + num.score, 0);
    return array.length === 0 ? 0 : sum / array.length;
  }
}
