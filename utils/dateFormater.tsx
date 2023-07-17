import { format } from "date-fns";

export function dateFormater(date: Date, withHours?: boolean) {
  {
    const formatedDate = format(
      date,
      withHours ? "yyyy-MM-dd HH:mm" : "yyyy-MM-dd"
    );
    return formatedDate;
  }
}
