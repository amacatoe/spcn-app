import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import React, { useState, useEffect, useRef } from 'react';
import { Text, View, Button, Platform } from 'react-native';
import { CourseStatus } from '../../../model/courseStatus';
import { User } from '../../../model/user';
import { getCourseStatus, getSecondsToDate, parseDate } from '../../../utils/dates';
import { getAllUsers } from '../../../utils/userFunc';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function schedulePushNotification(medicine: string, username: string, time: number) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Пользователю " + username,
      body: 'Необходимо принять лекарство: ' + medicine,
    },
    trigger: { seconds: time },
  });
}

export async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}

export async function createScheduleNotification(username: string, timetable: string[], dateStarted: string, dateFinished: string, medicine: string) {
  if(getCourseStatus(dateStarted, dateFinished) === CourseStatus.ACTIVE) {
    let actualTimetable: string[] = timetable?.filter((f) => f >= parseDate(new Date(), 'HH:mm'));

    if (actualTimetable.length>0) {
      actualTimetable.map(time => {
        let date = parseDate(new Date(), 'YYYY-MM-DD') + 'T' + time;
        schedulePushNotification(medicine, username, getSecondsToDate(new Date(), new Date(date)));
      });
    }

    let nextDay = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()+1);
    var days = Math.ceil((new Date(dateFinished).getTime() - nextDay.getTime())/(1000*60*60*24));

    for (let i = 0; i<days; i++) {
      timetable.map(time => {
        let date = parseDate(nextDay, 'YYYY-MM-DD') + 'T' + time;
        schedulePushNotification(medicine, username, getSecondsToDate(new Date(), new Date(date)));
      });

      nextDay = new Date(nextDay.getFullYear(), nextDay.getMonth(), nextDay.getDate()+1);
    }
  }
}


export const creatorNotification = async (currentUser: User) => {
  await Notifications.cancelAllScheduledNotificationsAsync();
  getAllUsers(currentUser).map((user) => {
    if (!!user.courses && user.courses.length > 0) {
      user.courses.map((course) => {
        createScheduleNotification(user.username, course.timetable, course.dateStarted, course.dateFinished, course.medicine);
      })
    }
  })
}