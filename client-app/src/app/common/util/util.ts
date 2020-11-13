export const combineDateAndTime = (date: Date, time: Date) => {
  const timeString = time.getHours() + ":" + time.getMinutes() + ":00";

  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const dateString = `${day}/${month}/${year}`;

  return new Date(dateString + ' ' + timeString);
}