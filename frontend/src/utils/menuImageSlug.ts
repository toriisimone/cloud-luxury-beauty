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

  const seedList = [base, andVersion, basic].filter(Boolean);
  const out: string[] = [];
  const seen = new Set<string>();

  const add = (v: string) => {
    const vv = v.trim();
    if (!vv) return;
    if (seen.has(vv)) return;
    seen.add(vv);
    out.push(vv);
  };

  seedList.forEach((s) => {
    add(s);
    // Support filenames without hyphens: "best-sellers" -> "bestsellers"
    add(s.replace(/-/g, ''));

    // Support singular/plural mismatch: "mists" <-> "mist"
    if (s.endsWith('s')) {
      const singular = s.slice(0, -1);
      add(singular);
      add(singular.replace(/-/g, ''));
    } else {
      add(`${s}s`);
      add(`${s}s`.replace(/-/g, ''));
    }
  });

  return out;
}

