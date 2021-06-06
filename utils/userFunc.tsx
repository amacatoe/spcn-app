import { User, userStub } from "../model/user";
import { getUserFromLocalStorage } from "./localStorage";

export function getAllUsers(user: User): User[] {
  if (!!user) {
    return !!user.spcOwners ? [user, ...user.spcOwners] : [user];
  }
  
  return [];
}

export function getUser(currentUser: User, userId: number): User {
  return getAllUsers(currentUser).find(user => user.id === userId)!;
}

// export function getSpcOwners(currentUser: User): User[] {
//   return getCurrentUser(currentUser).spcOwners;
// }


// export function getCurrentUser(): User {
//   var user:User|undefined = undefined;

//   const callback = (result: User) => {
//     user = result;
//     return user;
//   }

//   (async() => await getUserFromLocalStorage().then(callback));
//   return user!;
// }
