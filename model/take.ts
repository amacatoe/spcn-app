export enum TakeStatus {
  WAIT, //take period ??? 
  LOST, //invalid data (lost connect)
  OK //valid data (taken or not taken)
}

export class Take {
  date: Date;
  taken: boolean;
  status: TakeStatus;

  static mapToModels = (entities: any[]): Take[] => !!entities ? (entities.map(Take.mapToModel)) : [];

  static mapToModel = (entity: any): Take => {
    return {
      date: new Date(entity.date),
      taken: entity.taken,
      status: entity.status,
    };
  };
}

export const TakeStub: Take[] = [
  {
    date: new Date('2021-04-10T12:00:00'),
    taken: true,
    status: TakeStatus.OK,
  },
  {
    date: new Date('2021-04-10T16:00:00'),
    taken: false,
    status: TakeStatus.OK,
  }
]