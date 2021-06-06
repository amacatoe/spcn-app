/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import * as Linking from 'expo-linking';

export default {
  prefixes: [Linking.makeUrl('/')],
  config: {
    screens: {
      Root: {
        screens: {
          Home: {
            screens: {
              HomeScreen: 'home',
            },
          },
          Course: {
            screens: {
              CourseScreen: 'course',
            },
          },
          SpcOwners: {
            screens: {
              SpcOwnersScreen: 'spcowners',
            },
          },
        },
      },
      NotFound: '*',
      Auth: {
        screens: {
          Login: {
            screens: {
              LoginScreen: 'login',
            },
          },
          Registration: {
            screens: {
              RegistrationScreen: 'registration',
            },
          },
          ForgetPassword: {
            screens: {
              ForgetPasswordScreen: 'forgetpassword',
            },
          },
        },
      }
    },
  },
};
