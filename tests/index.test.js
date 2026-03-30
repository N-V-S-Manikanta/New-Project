import { greet } from '../src/index.js';

describe('Greet Function', () => {
  test('should return greeting message', () => {
    const result = greet('World');
    expect(result).toBe('Hello, World!');
  });

  test('should return greeting with different name', () => {
    const result = greet('John');
    expect(result).toBe('Hello, John!');
  });
});