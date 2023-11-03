import { format, parseISO } from "date-fns";

export const dateFormater = (
  date: Date | string,
  withHours?: boolean
): string => {
  let parsedDate;
  if (typeof date === "string") {
    parsedDate = parseISO(date);
  } else {
    parsedDate = date;
  }

  const formatedDate = format(
    parsedDate,
    withHours ? "yyyy-MM-dd HH:mm" : "yyyy-MM-dd"
  );
  return formatedDate;
};
