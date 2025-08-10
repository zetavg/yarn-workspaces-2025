import { describe, expect, test } from 'vitest';

import plusTwo from './plusTwo';

describe('plusTwo function', () => {
  test('adds two to positive integers correctly', () => {
    expect(plusTwo(1)).toBe(3);
    expect(plusTwo(5)).toBe(7);
    expect(plusTwo(10)).toBe(12);
    expect(plusTwo(100)).toBe(102);
  });

  test('adds two to negative numbers correctly', () => {
    expect(plusTwo(-1)).toBe(1);
    expect(plusTwo(-5)).toBe(-3);
    expect(plusTwo(-10)).toBe(-8);
  });

  test('adds two to zero correctly', () => {
    expect(plusTwo(0)).toBe(2);
  });

  test('adds two to decimal numbers correctly', () => {
    expect(plusTwo(1.5)).toBe(3.5);
    expect(plusTwo(-2.3)).toBeCloseTo(-0.3);
    expect(plusTwo(0.1)).toBeCloseTo(2.1);
  });

  test('handles large numbers correctly', () => {
    expect(plusTwo(1000000)).toBe(1000002);
    expect(plusTwo(Number.MAX_SAFE_INTEGER - 2)).toBe(Number.MAX_SAFE_INTEGER);
  });
});
