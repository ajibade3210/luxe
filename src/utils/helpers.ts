/**
 * Generic Utility Helpers
 */

export const delay = (ms = 150) => new Promise<void>(resolve => setTimeout(resolve, ms));

export const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};

export const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-");
