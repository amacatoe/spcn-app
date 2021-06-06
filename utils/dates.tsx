import Moment from 'moment';
import { CourseStatus } from '../model/courseStatus';

export function isToday(date: Date) {
  const now: Date = new Date();
  return +now === +date;
}

export function isTodayOrLess(date: Date) {
  const now: Date = new Date();
  return +date <= +now;
}

export function isLess(date1: Date, date2: Date) {
  return date1 < date2;
}

export function isLessThenToday(date: Date) {
  const now: Date = new Date();
  return date < now;
}

export function parseDate(date: Date, format: string = 'd MMMM') {
  return Moment(date).format(format);
}

export function getCourseStatus(dateStarted: string, dateFinished: string): CourseStatus {
  const dF = new Date(dateFinished);
  const dS = new Date(dateStarted);

  if (isTodayOrLess(dS)) {
    if (isLessThenToday(dF)) {
      return CourseStatus.FINISHED;
    }
    return CourseStatus.ACTIVE;
  } else return CourseStatus.WAITING;
}