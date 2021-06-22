import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { ColorSchemeName } from 'react-native';
import { AuthRootStackParamList, PrivateRootStackParamList } from '../types';
import BottomTabNavigator from './BottomTabNavigator';
import LinkingConfiguration from './LinkingConfiguration';
import AuthTabNavigator from './LoginNavigator';

export default function RootNavigator({ colorScheme }: { colorScheme: ColorSchemeName }) {

}

export function PrivateNavigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <PrivateRootNavigator />
    </NavigationContainer>
  );
}

export function AuthNavigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthRootNavigator />
    </NavigationContainer>
  );
}

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const AuthStack = createStackNavigator<AuthRootStackParamList>();

function AuthRootNavigator() {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
        cardOverlayEnabled: true,
      }}
      mode="modal"
    >
      <AuthStack.Screen name="Auth" component={AuthTabNavigator} />
      {/* <AuthStack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} /> */}
    </AuthStack.Navigator>
  );
}

const PrivateStack = createStackNavigator<PrivateRootStackParamList>();

function PrivateRootNavigator() {
  return (
    <PrivateStack.Navigator screenOptions={{ headerShown: false }}>
      <PrivateStack.Screen name="Root" component={BottomTabNavigator} />
    </PrivateStack.Navigator>
  );
}
