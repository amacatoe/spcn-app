/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { Course } from "./model/course";

 export type AuthRootStackParamList = {
  Auth: undefined;
  //NotFound: undefined;
};

export type PrivateRootStackParamList = {
  Root: undefined;
};

export type AuthParamList = {
  Login: undefined;
  Registration: {isSpcOwner: boolean};
}

export type ChangePasswordType = {
  email: string; 
  code: string;
}

export type LoginParamList = {
  LoginScreen: undefined;
  ForgetPasswordScreen: undefined;
  ChangePasswordScreen: ChangePasswordType;
}

export type RegistrationParamList = {
  RegistrationScreen: { isSpcOwner: boolean };
}

export type BottomTabParamList = {
  Home: undefined;
  Courses: undefined;
  SpcOwners: undefined;
  Profile: undefined;
};

export type HomeParamList = {
  HomeScreen: undefined;
  SpcScreen: undefined;
};

export type CoursesType = {
  isFinalCourses: boolean;
  userId: number;
}

export type CourseType = {
  course: Course;
}

export type addCourseType = {
  userId: number;
}

export type CoursesParamList = {
  CoursesScreen: CoursesType;
  CourseScreen: CourseType;
  FinalCoursesScreen: CoursesType;
  AddCourseScreen: addCourseType;
};

export type SpcOwnersParamList = {
  SpcOwnersScreen: undefined;
  SpcOwnerCoursesScreen: CoursesType;
  SpcOwnerCourseScreen: CourseType;
  SpcOwnerFinalCoursesScreen: CoursesType;
  AddSpcOwnerCourseScreen: addCourseType;
  AddSpcOwnerScreen: { isSpcOwner: boolean };
};

export type ProfileParamList = {
  ProfileScreen: undefined;
  ChangePasswordProfileScreen: ChangePasswordType;
}
