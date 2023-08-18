import { convertTimeToDays } from "./convertTimeToDays";

export const calculateReadingTime = (
  beganReading: Date | null,
  endedReading: Date
): number => {
  if (beganReading !== null && endedReading > beganReading) {
    const calculatedTime = endedReading.getTime() - beganReading.getTime();
    return calculatedTime > 0 ? convertTimeToDays(calculatedTime) : 0;
  } else return 0;
};
