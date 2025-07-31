/**
 * Calcule le nombre de jours entre deux dates
 */
export const daysBetweenDates = (date1: Date | string, date2: Date | string): number => {
  const dateObj1 = typeof date1 === 'string' ? new Date(date1) : date1;
  const dateObj2 = typeof date2 === 'string' ? new Date(date2) : date2;
  
  const diffTime = Math.abs(dateObj2.getTime() - dateObj1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};
