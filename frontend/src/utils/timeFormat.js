// utils/timeFormat.js
export const formatTime = (timeStr) => {
  if (!timeStr) return "";
  const [hour, minute] = timeStr.split(":");
  let h = parseInt(hour, 10);
  const m = minute;
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12; // 0 হলে 12 হবে
  return `${h}:${m} ${ampm}`;
};
