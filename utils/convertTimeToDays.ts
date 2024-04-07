export const convertTimeToDays = (time: number): number => {
  return time > 0 ? parseInt((time / (1000 * 3600 * 24)).toFixed(0)) : 0;
};
