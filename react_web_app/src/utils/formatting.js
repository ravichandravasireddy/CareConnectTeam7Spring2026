/**
 * Get initials from a name (e.g. "John Doe" -> "JD")
 * @param {string} name - Full name
 * @returns {string} Up to 2 uppercase initials
 */
export function getInitials(name) {
  if (!name || typeof name !== 'string') return '';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}
