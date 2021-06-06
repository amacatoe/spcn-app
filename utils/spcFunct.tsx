import { User } from "../model/user";
import { getAllUsers, getUser } from "./userFunc";

export function getSpc(currentUser: User, userId: number): string[] {
  return getUser(currentUser, userId).spcSerialNumberList;
}

export interface ISpcUserMap {
  userId: number;
  username: string;
  spc: string;
}

export function getMapSpc(currentUser: User): ISpcUserMap[] {
  let spcMap: ISpcUserMap[] = [];
  getAllUsers(currentUser).map(user => {
    if (!user.hasCaretaker || user.isDependent) {
      !!user.spcSerialNumberList ? (user.spcSerialNumberList.map(spc =>
        spcMap.push({
          userId: user.id,
          username: user.username!,
          spc: spc,
        })
      )) : [];
    }
  }
  );
  return spcMap;
}

export function isSpcUse(spc: string, currentUser: User) {
  let isUse = false;
  getAllUsers(currentUser).map((user) => {
    if (user.courses.length > 0 && !!user.courses.find(c => c.spc === spc)) {
      isUse = true;
    }
  })

  return isUse;
}