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
      await saveUserInLocalStorage(userStub);
      const tmpUser = await getUserFromLocalStorage();
      if (!!tmpUser) {
      //   await getUserFromApi(2).then((data) => {
      //     saveUserInLocalStorage(data);
          setUser(() => User.mapToModel(tmpUser));
      //   });
      }
      setIsSignIn(!!tmpUser);
    };

    userSetter();
  }, [])


  if (!isLoadingComplete || (user === undefined && isSignIn)) {
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
