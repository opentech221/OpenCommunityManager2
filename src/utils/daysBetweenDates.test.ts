import { daysBetweenDates } from './daysBetweenDates';

describe('daysBetweenDates', () => {
  it('retourne 0 si les deux dates sont identiques', () => {
    expect(daysBetweenDates('2025-07-20', '2025-07-20')).toBe(0);
    expect(daysBetweenDates(new Date('2025-07-20'), new Date('2025-07-20'))).toBe(0);
  });

  it('retourne le nombre de jours entre deux dates (ordre direct)', () => {
    expect(daysBetweenDates('2025-07-20', '2025-07-21')).toBe(1);
    expect(daysBetweenDates('2025-07-20', '2025-07-25')).toBe(5);
  });

  it('retourne le nombre de jours entre deux dates (ordre inverse)', () => {
    expect(daysBetweenDates('2025-07-25', '2025-07-20')).toBe(5);
  });

  it('gère les objets Date et les chaînes', () => {
    expect(daysBetweenDates(new Date('2025-07-20'), '2025-07-22')).toBe(2);
    expect(daysBetweenDates('2025-07-20', new Date('2025-07-23'))).toBe(3);
  });

  it('gère les années bissextiles', () => {
    expect(daysBetweenDates('2024-02-28', '2024-03-01')).toBe(2);
  });
});
