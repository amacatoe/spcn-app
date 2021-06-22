import { Course } from "../model/course";
import { User} from "../model/user";
import { getUser } from "./userFunc";
import { CourseStatus } from '../model/courseStatus';
import { Take, TakeStub } from "../model/take";
import { getCourseStatus } from "./dates";

export function getCourses(currentUser: User, userId: number): Course[] {
  return getUser(currentUser, userId).courses;
}

export function getActiveCourses(currentUser: User, userId: number): Course[] {
  const user: User = getUser(currentUser, userId);
  return !!user ? user.courses.filter(e => (getCourseStatus(e.dateStarted, e.dateFinished)  === CourseStatus.ACTIVE) || (getCourseStatus(e.dateStarted, e.dateFinished) === CourseStatus.WAITING)) : [];
}

export function getFinishedCourses(currentUser: User, userId: number): Course[] {
  const user: User = getUser(currentUser, userId);
  return !!user ? user.courses.filter(e => getCourseStatus(e.dateStarted, e.dateFinished) === CourseStatus.FINISHED) : [];
}

export function getTakes(courseId: number): Take[] {
  return TakeStub;
}

