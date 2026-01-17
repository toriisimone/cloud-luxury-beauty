export function menuImageSlug(input: string): string {
  // Make filenames predictable for non-technical uploads.
  // Goal: "Serums & Treatments" -> "serums-treatments"
  // - Lowercase
  // - Turn "&" into space
  // - Remove the word "and"
  // - Remove non-alphanumeric
  // - Collapse whitespace to "-"
  const cleaned = input
    .toLowerCase()
    .replace(/&/g, ' ')
    .replace(/\band\b/g, ' ')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/[\s_-]+/g, ' ')
    .trim();

  return cleaned.replace(/\s+/g, '-');
}

export function menuImageSlugVariants(input: string): string[] {
  const base = menuImageSlug(input);
  const basic = input
    .toLowerCase()
    .replace(/\s+/g, '-')
    .trim();

  const andVersion = input
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/[\s_-]+/g, ' ')
    .trim()
    .replace(/\s+/g, '-');

  // Unique, stable order
  return Array.from(new Set([base, andVersion, basic].filter(Boolean)));
}

