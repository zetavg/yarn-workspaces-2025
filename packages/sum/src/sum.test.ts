import { describe, expect, test } from 'vitest';

import sum from './sum';

describe('sum function', () => {
  test('adds positive integers correctly', () => {
    expect(sum(1, 2)).toBe(3);
    expect(sum(5, 10)).toBe(15);
    expect(sum(100, 200)).toBe(300);
  });

  test('adds negative numbers correctly', () => {
    expect(sum(-1, -2)).toBe(-3);
    expect(sum(-5, 3)).toBe(-2);
    expect(sum(5, -3)).toBe(2);
  });

  test('handles zero correctly', () => {
    expect(sum(0, 0)).toBe(0);
    expect(sum(0, 5)).toBe(5);
    expect(sum(10, 0)).toBe(10);
  });

  test('adds decimal numbers correctly', () => {
    expect(sum(1.5, 2.5)).toBe(4);
    expect(sum(0.1, 0.2)).toBeCloseTo(0.3);
    expect(sum(-1.5, 3.7)).toBeCloseTo(2.2);
  });

  test('handles large numbers correctly', () => {
    expect(sum(1000000, 2000000)).toBe(3000000);
    expect(sum(Number.MAX_SAFE_INTEGER - 1, 1)).toBe(Number.MAX_SAFE_INTEGER);
  });
});
