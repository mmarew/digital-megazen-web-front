export default function currentDates() {
  let date = new Date();
  let year = date.getFullYear(),
    month = date.getMonth() + 1,
    day = date.getDate();
  if (month < 10) {
    month = "0" + month;
  }
  if (day < 10) {
    day = "0" + day;
  }
  let currentDate = year + "-" + month + "-" + day;
  return currentDate;
}
export function DateFormatter(dateTimeString, timeZone) {
  if (!dateTimeString) return "----";
  let date = new Date(dateTimeString);
  let Year = date.getFullYear();
  let Month = date.getMonth();
  let Day = date.getDate();

  let formattedDate =
    Year +
    "-" +
    (Month + 1).toString().padStart(2, "0") +
    "-" +
    Day.toString().padStart(2, "0");

  if (new Date(formattedDate) <= new Date("2000-01-01")) {
    formattedDate = " - - - ";
  }
  return formattedDate;
}
