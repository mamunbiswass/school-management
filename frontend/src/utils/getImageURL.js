export const getImageURL = (path, API_URL) => {
  if (!path) return "/no-photo.jpg";
  if (path.startsWith("http")) return path;
  return `${API_URL}${path.startsWith("/") ? "" : "/"}${path}`;
};
