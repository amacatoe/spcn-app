import React from 'react';
import { Course, CourseToSave } from "./model/course";
import { topDangerMessage } from './utils/message';

/**
* 1. Запрос на всего юзера при заходе в приложение по id user - get
* 2. Запрос на добавление юзера (опекаемого) через регу -> {2 request: 1. user (рега) -> id user, 2.id current user, id user}
* 3. Запрос на авторизацию -> email, password -> получаем: user | null/bad request - get
* 4. Запрос на статистику по id курса - get
* 5. Запрос на добавление юзера (регистрация) -> user (рега) -> id user, есть в бд или нет - post
* 6. Запрос на восстановление пароля - email get -> code -> переход на экран изменения пароля
* 7. Запрос на изменение пароля -> email, password (bad request, 200) -> запрос на авторизацию
* 8. Добавление курса -> id user, course -> получаем id course
* 9. Добавление дозатора (инструкция) -> serial number spc, id user -> bad request, если нет в бд такого серийника,
* тогда выводим повторную инструкцию -> пользователь повторяет пока не получится -> 200 -> добавляем серийный номер в юзера
* 10. Мои дозаторы -> список - серийник + юзер -> из
* 11. Хочу стать самостоятельной (isDepend) -> id user ->
* 12. Запрос на добавление юзера (опекаемого) email -> id user / bad request -> email + ссылка -> запрос при переходе по ссылке (13)
* 13. Запрос на связывание пользователей -> id1 -опекающий, id2 -опекаемый
*
*/

//If response is in json then in success
// .then((responseJson) => {
//   alert(JSON.stringify(responseJson));
//   console.log(responseJson);
// })
// //If response is not in json then in error
// .catch((error) => {
//   alert(JSON.stringify(error));
//   console.error(error);
// });

const url = 'http://5d8190488012.ngrok.io';

// User

// 1.  Запрос на регистрацию юзера
//     POST /users/registration
//     >> JSON: RegisterUserRequest {String username, String email, String password, Boolean isDependent}
//     << JSON: RegisterUserResponse {Long userId} | UserRegistrationError {String error}, HttpStatus

export const registration = (user: { username: string, email: string, password: string, isDependent: boolean }): Promise<any> => (
  //POST request
  fetch(url + '/users/registration', {
    method: 'POST', //Request Type
    body: JSON.stringify(user), //post body
    headers: {
      //Header Defination
      'Content-Type': 'application/json;charset=UTF-8',
    },
  }).then((response) => response.json()).catch((error) => topDangerMessage(error.message))
);

// 2.  Запрос на авторизацию юзера
//     POST /users/auth
//     >> JSON: AuthUserRequest {String email, String password}
//     << JSON: UserApiDto {//Поля пользователя} | UserNotFoundException {String error} | InvalidUserPasswordException {String error}, HttpStatus

export const auth = (user: { email: string, password: string }): Promise<any> => (
  //POST request
  fetch(url + '/users/auth', {
    method: 'POST', //Request Type
    body: JSON.stringify(user), //post body
    headers: {
      //Header Defination
      'Content-Type': 'application/json;charset=UTF-8',
    },
  }).then((response) => response.json()).catch((error) => topDangerMessage(error.message))
);

// 3.  Запрос на отправку кода для подтверждения восстановления пароля юзера
//     POST /users/passwordRecovery
//     >> JSON: String email
//     << JSON: HandlePasswordRecoveryResponseDto {String code} | IncorrectUserEmailException {String error}, HttpStatus

export const getCode = (user: { email: string }): Promise<any> => (
  //POST request
  fetch(url + '/users/passwordRecovery', {
    method: 'POST', //Request Type
    body: JSON.stringify(user), //post body
    headers: {
      //Header Defination
      'Content-Type': 'application/json;charset=UTF-8',
    },
  }).then((response) => response.json()).catch((error) => topDangerMessage(error.message))
);

// 4.  Запрос на изменение пароля юзера
//     PUT /users/passwordChange
//     >> JSON: ChangePasswordRequest {String email, String password}
//     << JSON: IncorrectUserEmailException {String error}, HttpStatus

export const changePassword = (user: { email: string, password: string }): Promise<any> => (
  //POST request
  fetch(url + '/users/passwordChange', {
    method: 'PUT', //Request Type
    body: JSON.stringify(user), //post body
    headers: {
      //Header Defination
      'Content-Type': 'application/json;charset=UTF-8',
    },
  }).then((response) => response.json()).catch((error) => console.log(error.message))
);

// 5.  Запрос на изменение имени юзера
//     PUT /users/{userId}/nameUpdate
//     >> PathVariable: Long userId, JSON: String username
//     << HttpStatus

export const changeUsername = (id: number, user: { name: string }): Promise<any> => (
  //POST request
  fetch(url + '/users/' + id + '/nameUpdate', {
    method: 'PUT', //Request Type
    body: JSON.stringify(user), //post body
    headers: {
      //Header Defination
      'Content-Type': 'application/json;charset=UTF-8',
    },
  }).then((response) => response.json()).catch((error) => console.log(error.message))
);

// 6.  Запрос на изменение зависимости юзера
//     PUT /users/{userId}/dependencyUpdate
//     >> PathVariable: Long userId, JSON: Boolean isDependent
//     << HttpStatus

export const changeDependency = (id: number, user: { isDependent: boolean }): Promise<any> => (
  //POST request
  fetch(url + '/users/' + id + '/dependencyUpdate', {
    method: 'PUT', //Request Type
    body: JSON.stringify(user), //post body
    headers: {
      //Header Defination
      'Content-Type': 'application/json;charset=UTF-8',
    },
  }).then((response) => response.json()).catch((error) => console.log(error.message))
);

// 7.  Запрос на получение юзера
//     GET /user/{userId}
//     >> PathVariable: Long userId
//     << JSON: UserApiDto {//Поля пользователя}, HttpStatus

export const getUserFromApi = (id: number): Promise<any> => (
  //GET request
  fetch(url + '/users/' + id, {
    method: 'GET',
    //Request Type
  }).then((response) => response.json()).catch((error) => topDangerMessage(error.message))
);

// Monitoring

// 8.  Запрос на связывание юзеров
//     POST /monitoring
//     >> JSON: SaveMonitoringRequest {Long caretakerId, Long spcOwnerId}
//     << HttpStatus

export const associateUsers = (users: { caretakerId: number, spcOwnerId: number }): Promise<any> => (
  //POST request
  fetch(url + '/monitoring', {
    method: 'POST',
    body: JSON.stringify(users), //post body
    headers: {
      //Header Defination
      'Content-Type': 'application/json;charset=UTF-8',
    },
  }).then((response) => response.json()).catch((error) => console.log(error.message))
);

// 9.  Запрос на отправку кода для подтверждения опеки над зарегистрированным юзером
//     POST /monitoring/notification
//     >> JSON: String email
//     << JSON: HandleMonitoringNotificationResponseDto {String code, String addresseeEmail, String addresseeName, Long spcOwnerId}, HttpStatus

export const getRegisterCode = (user: { email: string }): Promise<any> => (
  //POST request
  fetch(url + '/monitoring/notification', {
    method: 'POST',
    body: JSON.stringify(user), //post body
    headers: {
      //Header Defination
      'Content-Type': 'application/json;charset=UTF-8',
    },
  }).then((response) => response.json()).catch((error) => console.log(error.message))
);

// Course

// 10. Запрос на добавление курса
//     POST /courses
//     >> JSON: SaveCourseRequest {CourseDto course, Long userId}
//     << JSON: Long courseId, HttpStatus

export const addCourse = (courseInfo: { course: CourseToSave, userId: number }): Promise<any> => (
  //POST request
  fetch(url + '/courses', {
    method: 'POST',
    body: JSON.stringify(courseInfo), //post body
    headers: {
      //Header Defination
      'Content-Type': 'application/json;charset=UTF-8',
    },
  }).then((response) => response.json()).catch((error) => topDangerMessage(error.message))
);

// 11. Запрос на удаление курса
//     DELETE /courses/{courseId}
//     >> PathVariable: Long courseId
//     << HttpStatus

export const delCourse = (courseId: number): Promise<any> => (
  //POST request
  fetch(url + '/courses/' + courseId, {
    method: 'DELETE',
  }).then((response) => response.json()).catch((error) => console.log(error.message))
);

// 12. Запрос на получение статистики по курсу
//     GET /courses/{courseId}/statistics
//     >> PathVariable: Long courseId
//     << JSON: List<TakeDto> takes, HttpStatus

export const getCourseTakes = (courseId: number): Promise<any> => (
  fetch(url + '/courses/' + courseId + '/statistics', {
    method: 'GET',
  }).then((response) => response.json()).catch((error) => console.log(error.message))
);

// Spc

// 13. Запрос на связывание дозатора и юзера
//     PUT /spc/{serialNumber}/spcOwnerUpdate
//     >> PathVariable: String serialNumber, JSON: Long userId
//     << SpcNotFoundException {String error}, HttpStatus

export const changeSpcOwner = (spc: string, user: { userId: number }): Promise<any> => (
  fetch(url + '/spc/spcOwnerUpdate?serialNumber=' + spc, {
    method: 'PUT',
    body: JSON.stringify(user), //post body
    headers: {
      //Header Defination
      'Content-Type': 'application/json;charset=UTF-8',
    },
  }).then((response) => response.json()).catch((error) => console.log(error.message))
);

// 14. Запрос на получение данных о существовании связи дозатора и юзера
//     GET /spc/{serialNumber}/ownership
//     >> PathVariable: String serialNumber
//     << JSON: Boolean isSpcOwned | SpcNotFoundException {String error}, HttpStatus

export const isSpcOwned = (spc: string): Promise<any> => (
  fetch(url + '/spc/ownership?serialNumber=' + spc, {
    method: 'GET',
  }).then((response) => response.json())
);

// 15. Разрыв связи дозатора и юзер
//    PUT /spc/{serialNumber}/spcOwnerClean
//    >> PathVariable: String serialNumber
//    << SpcNotFoundException {String error}, HttpStatus

export const delSpcOwner = (spc: string): Promise<any> => (
  fetch(url + '/spc/spcOwnerClean?serialNumber=' + spc, {
    method: 'PUT',
  }).then((response) => response.json()).catch((error) => console.log(error.message))
);

// 16. Вызов оповещающего сигнала дозатора
//     POST /spc/{serialNumber}/connectionTest
//     >> PathVariable: String serialNumber
//     << SpcNotFoundException {String error}, HttpStatus

export const connectionTest = (spc: string): Promise<any> => (
  fetch(url + '/spc/connectionTest?serialNumber=' + spc, {
    method: 'POST',
  }).then((response) => response.json()).catch((error) => console.log(error.message))
);