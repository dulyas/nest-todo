export default (query: string) => {
  if (query === "up" || query === "down" || query === "disabled")
    return String(query);
  return "disabled";
};
