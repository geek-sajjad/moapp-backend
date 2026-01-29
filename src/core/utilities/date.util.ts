// src/utils/date.util.ts
import * as moment from 'moment';
import { DayOfWeekEnum } from 'src/core/enums';

/**
 * Formats a date to YYYY-MM-DD HH:mm:ss format
 */
export const formatDate = (date: Date | string): string =>
  moment(date).format('YYYY-MM-DD HH:mm:ss');

/**
 * Formats a date to YYYY-MM-DD format (ISO date string)
 */
export const formatDateToISO = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Normalizes a date by setting hours, minutes, seconds, and milliseconds to 0
 */
export const normalizeDate = (date: Date): Date => {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
};

/**
 * Gets the day of week enum from a date
 */
export const getDayOfWeekFromDate = (date: Date): DayOfWeekEnum => {
  const days = [
    DayOfWeekEnum.SUNDAY,
    DayOfWeekEnum.MONDAY,
    DayOfWeekEnum.TUESDAY,
    DayOfWeekEnum.WEDNESDAY,
    DayOfWeekEnum.THURSDAY,
    DayOfWeekEnum.FRIDAY,
    DayOfWeekEnum.SATURDAY,
  ];
  return days[date.getDay()];
};

/**
 * Calculates the difference in days between two dates
 */
export const calculateDateDifference = (start: Date, end: Date): number => {
  const diffTime = end.getTime() - start.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Calculates the current week's Saturday (start) and Thursday (end) dates
 * @returns Object with weekStart (Saturday) and weekEnd (Thursday) as ISO date strings (YYYY-MM-DD)
 */
export const getCurrentWeekSaturdayToThursday = (): {
  weekStart: string;
  weekEnd: string;
} => {
  const today = normalizeDate(new Date());
  const currentDay = today.getDay(); // 0 = Sunday, 6 = Saturday

  // Calculate days to subtract to get to the most recent Saturday
  // If today is Saturday (6), daysToSubtract = 0
  // If today is Sunday (0), daysToSubtract = 1
  // If today is Monday (1), daysToSubtract = 2
  // etc.
  const daysToSubtract = (currentDay + 1) % 7;

  // Get Saturday (start of week)
  const saturday = new Date(today);
  saturday.setDate(today.getDate() - daysToSubtract);
  const normalizedSaturday = normalizeDate(saturday);

  // Get Thursday (end of week) - 5 days after Saturday
  const thursday = new Date(normalizedSaturday);
  thursday.setDate(normalizedSaturday.getDate() + 5);
  const normalizedThursday = normalizeDate(thursday);

  return {
    weekStart: formatDateToISO(normalizedSaturday),
    weekEnd: formatDateToISO(normalizedThursday),
  };
};

/**
 * Limits a date range to a maximum number of days
 * @param startDate - Start date string (YYYY-MM-DD)
 * @param endDate - End date string (YYYY-MM-DD)
 * @param maxDays - Maximum number of days allowed (default: 5)
 * @returns Limited end date string (YYYY-MM-DD)
 */
export const limitDateRange = (
  startDate: string,
  endDate: string,
  maxDays: number = 5,
): string => {
  const start = normalizeDate(new Date(startDate));
  const end = normalizeDate(new Date(endDate));

  const diffDays = calculateDateDifference(start, end);

  if (diffDays > maxDays) {
    const limitedEnd = new Date(start);
    limitedEnd.setDate(start.getDate() + maxDays);
    const normalizedLimitedEnd = normalizeDate(limitedEnd);
    return formatDateToISO(normalizedLimitedEnd);
  }

  return endDate;
};

/**
 * Checks if a date is Friday
 */
export const isFriday = (date: Date | string): boolean => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.getDay() === 5; // 5 = Friday
};

/**
 * Generates an array of all dates between start and end date (inclusive)
 * @param startDate - Start date string (YYYY-MM-DD) or Date
 * @param endDate - End date string (YYYY-MM-DD) or Date
 * @returns Array of date strings in YYYY-MM-DD format
 */
export const getDatesInRange = (
  startDate: string | Date,
  endDate: string | Date,
): string[] => {
  const start = normalizeDate(
    typeof startDate === 'string' ? new Date(startDate) : startDate,
  );
  const end = normalizeDate(
    typeof endDate === 'string' ? new Date(endDate) : endDate,
  );

  const dates: string[] = [];
  const currentDate = new Date(start);

  while (currentDate <= end) {
    dates.push(formatDateToISO(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};

export const addDaysToDate = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};
