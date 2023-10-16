import { format } from "date-fns";

export const dateFormater = (date: Date, withHours?: boolean): string => {
  {
    const formatedDate = format(
      date,
      withHours ? "yyyy-MM-dd HH:mm" : "yyyy-MM-dd"
    );
    return formatedDate;
  }
};
