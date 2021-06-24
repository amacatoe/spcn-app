import { StatusBar } from 'expo-status-bar';
import React, { useState, useMemo, useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import { AuthNavigation, PrivateNavigation } from './navigation';
import FlashMessage from "react-native-flash-message";
import { AuthContext } from './context/Auth';
import { StorageContext } from './context/Storage';
import moment from 'moment';
import 'moment/locale/ru';
import { User, userStub } from './model/user';
import { deleteAll, getUserFromLocalStorage, saveUserInLocalStorage } from './utils/localStorage';
import { getUserFromApi } from './agent';
import { createScheduleNotification, creatorNotification, registerForPushNotificationsAsync, schedulePushNotification } from './components/elements/notify/pushNotify';
import { getAllUsers } from './utils/userFunc';
import { getCourseStatus, getSecondsToDate, parseDate } from './utils/dates';
import { CourseStatus } from './model/courseStatus';
import { Notifications } from 'react-native-notifications';
import { LogBox } from 'react-native';
moment.locale('ru');

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  const [isSignIn, setIsSignIn] = useState<boolean>(false);
  const [user, setUser] = useState<User>();

  const authContext = useMemo(() => ({
    signIn: async () => {
      setIsSignIn(true)
    },
    signOut: async () => {
      setIsSignIn(false);
      setUser(undefined);
    },
  }), []);

  const storageContext = useMemo(() => ({
    getUser: (): User => {
      return user!;
    },
    setUser: async (user: User) => {
      setUser(() => user)
    }
  }), [user]);


  useEffect(() => {
    async function userSetter() {
      //await deleteAll();
      //await saveUserInLocalStorage(userStub);
      const tmpUser = await getUserFromLocalStorage();
      if (!!tmpUser) {
        await getUserFromApi(tmpUser.id).then((data) => {
          saveUserInLocalStorage(data).then(() => setUser(User.mapToModel(tmpUser)));
        });
      }
      setIsSignIn(!!tmpUser);
      await creatorNotification(tmpUser);
      //registerForPushNotificationsAsync();
    };

    LogBox.ignoreAllLogs();

    userSetter();
  }, []);


  if (!isLoadingComplete) {
    console.log(user);
    return null;
  } else {
    console.log(user);
    return (
      <AuthContext.Provider value={authContext}>
        <StorageContext.Provider value={storageContext}>
          <SafeAreaProvider>
            {isSignIn
              ? (<PrivateNavigation colorScheme={colorScheme} />)
              : (<AuthNavigation colorScheme={colorScheme} />)
            }
            <StatusBar />
            <FlashMessage position="top" />
          </SafeAreaProvider>
        </StorageContext.Provider>
      </AuthContext.Provider>
    );
  }
}
