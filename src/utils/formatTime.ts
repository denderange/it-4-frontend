export const formatTime = (date: Date) => {
  const localDate = new Date(date);
  return localDate.toLocaleString();
};
