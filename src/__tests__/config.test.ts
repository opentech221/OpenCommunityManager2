// Test simple pour vérifier la configuration Jest
import { formatDate } from '../utils';

describe('Configuration Tests', () => {
  test('Jest configuration is working', () => {
    expect(true).toBe(true);
  });

  test('formatDate utility function works', () => {
    const date = new Date('2025-01-15');
    const result = formatDate(date);
    expect(result).toContain('15');
    expect(result).toContain('2025');
  });

  test('Mock functions are available', () => {
    const mockFn = jest.fn();
    mockFn('test');
    expect(mockFn).toHaveBeenCalledWith('test');
  });
});
