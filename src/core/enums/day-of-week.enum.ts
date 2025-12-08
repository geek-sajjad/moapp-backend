export enum DayOfWeekEnum {
  SUNDAY = 'Sunday',
  MONDAY = 'Monday',
  TUESDAY = 'Tuesday',
  WEDNESDAY = 'Wednesday',
  THURSDAY = 'Thursday',
  FRIDAY = 'Friday',
  SATURDAY = 'Saturday',
}

export type DayOfWeek = (typeof DayOfWeekEnum)[keyof typeof DayOfWeekEnum];
