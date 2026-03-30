import { describe, it, expect } from 'vitest';
import { getInitials } from './formatting';

describe('getInitials (Unit Test)', () => {
  it('returns first letters of each word, capitalized', () => {
    expect(getInitials('Margaret Johnson')).toBe('MJ');
  });

  it('handles single name', () => {
    expect(getInitials('Madonna')).toBe('M');
  });

  it('limits to 2 characters', () => {
    expect(getInitials('John Paul Smith')).toBe('JP');
  });

  it('returns empty string for empty input', () => {
    expect(getInitials('')).toBe('');
  });

  it('returns empty string for null/undefined', () => {
    expect(getInitials(null)).toBe('');
    expect(getInitials(undefined)).toBe('');
  });
});
