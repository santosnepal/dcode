export function getFormatDate(inputDate: string) {
  const date = new Date(inputDate);

  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;
}

export function convertStringToDateTimeFormat(date: string, time: string) {
  // Combine date and time strings into a single string
  const combinedDateTimeString = `${date}T${time}:00`;

  // Create a Date object from the combined string
  return new Date(combinedDateTimeString).toISOString();
}
