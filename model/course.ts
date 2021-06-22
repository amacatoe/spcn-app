import { getCourseStatus } from "../utils/dates";
import { CourseStatus } from '../model/courseStatus';

export class CourseToSave {
  id: number | undefined = undefined;
  medicine: string;
  spcSerialNumber: string;
  dateStarted: string;
  dateFinished: string;
  timetable: string[]; //уникальное время
  takeDurationSec: number;

  static mapToEntity = (medicine: string, spc: string, dateStarted: string, dateFinished: string, timetable: string[], takeDurationSec: number): CourseToSave => {
    return {
      id: undefined,
      medicine: medicine,
      spcSerialNumber: spc,
      dateStarted: dateStarted,
      dateFinished: dateFinished,
      timetable: timetable,
      takeDurationSec: takeDurationSec,
    };
  };
}

export class Course {
  id: number;
  medicine: string;
  spc: string;
  dateStarted: string;
  dateFinished: string;
  timetable: string[]; //уникальное время
  takeDurationSec: number;

  static mapToModels = (entities: any[]): Course[] => {
    let courses:Course[] = [];
    if (!!entities)  {
      entities.map((course) => courses.push(Course.mapToModel(course)));
    }
    console.log(courses);
    return courses;
  };

  static mapToModel = (entity: any): Course => {
    return {
      id: entity.id,
      medicine: entity.medicine,
      spc: entity.spcSerialNumber,
      dateStarted: entity.dateStarted,
      dateFinished: entity.dateFinished,
      timetable: entity.timetable,
      takeDurationSec: entity.takeDurationSec,
    };
  };

  static mapToEntity = (model: Course): any => {
    return {
      id: model.id,
      medicine: model.medicine,
      spcSerialNumber: model.spc,
      dateStarted: model.dateStarted,
      dateFinished: model.dateFinished,
      timetable: model.timetable,
      takeDurationSec: model.takeDurationSec,
    };
  };
}

export const courseStub = {
  id: 1,
  medicine: 'Аспирин',
  spc: 'spc_111_test',
  dateStarted: '2021-04-10',
  dateFinished: '2021-06-10',
  takeDurationSec: 600,
  timetable: ['12:00', '16:00', '20:00'],
}

export const courseStub2 = {
  id: 2,
  medicine: 'Вобензин',
  spc: 'spc_111_test',
  dateStarted: '2021-06-10',
  dateFinished: '2021-07-10',
  takeDurationSec: 1200,
  timetable: ['15:00', '21:00'],
}

export const courseStub3 = {
  id: 3,
  medicine: 'Фемостон',
  spc: 'spc_111_test',
  dateStarted: '2021-05-15',
  dateFinished: '2021-05-30',
  timetable: ['17:00'],
  takeDurationSec: 1200,
}



