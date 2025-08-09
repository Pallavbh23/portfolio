// Utility to join class names safely
// This file supplies the `cn` helper used across components.
export function cn(...classes: Array<string | number | false | null | undefined>) {
  const result = classes
    .flatMap((c) => (typeof c === 'string' || typeof c === 'number' ? String(c).split(' ') : c ? [String(c)] : []))
    .filter(Boolean)
    .join(' ');
  return result;
}

// Debug: verify module loaded
if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line no-console
  console.debug('[cn] utility loaded');
}
