import { greet } from '../src/index.js';

describe('Koro Greet Function', () => {
  test('should return greeting message from koro', () => {
    const result = greet('World');
    expect(result).toBe('Hello from koro, World!');
  });

  test('should return greeting with different name', () => {
    const result = greet('John');
    expect(result).toBe('Hello from koro, John!');
  });
});
