import { Type } from "class-transformer";
import { Course, courseStub, courseStub2, courseStub3 } from "./course";

 export class User {
  id: number = 0;
  username: string;
  email: string;
  courses: Course[] = [];
  spcSerialNumberList: string[] = []; //дозаторы
  isDependent: boolean; //закрытость дозаторов
  hasCaretaker: boolean; //наличие опекаемых
  spcOwners: User[] = []; //опекаемые

  // constructor(
  //   id: number,
  //   username: string,
  //   email: string,
  //   courses: Course[],
  //   spcSerialNumberList: string[],
  //   isDependent: boolean,
  //   hasCaretaker: boolean,
  //   spcOwners: User[]
  // ) {
  //   this.id = id,
  //   this.username = username,
  //   this.email = email,
  //   this.courses = courses,
  //   this.spcSerialNumberList = spc 

  // }

  static mapToModels = (entities: any[]): User[] => {
    let users:User[] = [];
    if (!!entities)  {
      entities.map((user) => users.push(User.mapToModel(user)));
    }
    return users;
  };

  static mapToModel = (entity: any): User => {
    return {
      id: entity.id,
      username: entity.username,
      email: entity.email,
      courses: Course.mapToModels(entity.courses),
      spcOwners: User.mapToModels(entity.spcOwners),
      spcSerialNumberList: entity.spcSerialNumberList,
      isDependent: entity.isDependent,
      hasCaretaker: entity.hasCaretaker,
    };
  };

  // static mapToEntity = (model: User): any => {
  //   return {
  //     id: model.id,
  //     username: model.username,
  //     email: model.email,
  //     courses: model.courses,
  //     spcOwners: model.spcOwners,
  //     spcSerialNumberList: model.spcSerialNumberList,
  //     isDependent: model.isDependent,
  //     //hasCaretaker: model.hasCaretaker,
  //   };
  // };
}


export const user2Stub: User = {
  id: 2,
  username: 'Бабушка',
  email: 'spcn2@gmail.com',
  courses: [],
  spcOwners: [],
  spcSerialNumberList: ['spc_222_test'],
  hasCaretaker: true,
  isDependent: true,
}

export const userStub: User = {
  id: 1,
  username: 'Татьяна',
  email: 'spcn@gmail.com',
  courses: [Course.mapToModel(courseStub), Course.mapToModel(courseStub2), Course.mapToModel(courseStub3)],
  spcOwners: [user2Stub],
  spcSerialNumberList: ['spc_111_test'],
  hasCaretaker: true,
  isDependent: true,
}