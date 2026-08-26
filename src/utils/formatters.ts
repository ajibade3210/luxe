export const formatDate = (s: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(s));

export const formatStatusLabel = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
