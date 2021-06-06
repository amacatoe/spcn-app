/**
 * Learn more about createBottomTabNavigator:
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */

import { Ionicons, Octicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';
import ForgetPasswordScreen from '../screens/ForgetPasswordScreen';
import LoginScreen from '../screens/LoginScreen';
import RegistrationScreen from '../screens/RegistrationScreen';
import { AuthParamList, LoginParamList, RegistrationParamList } from '../types';

const BottomTab = createBottomTabNavigator<AuthParamList>();

export default function AuthTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="Login"
      tabBarOptions={{ activeTintColor: Colors[colorScheme].tint }}>
      <BottomTab.Screen
        name="Войти"
        component={LoginNavigator}
        options={{
          tabBarIcon: ({ color }) => <Octicons size={30} style={{ marginBottom: -3 }} name="sign-in" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Регистрация"
        component={RegistrationNavigator}
        options={{
          tabBarIcon: ({ color }) => <Ionicons size={30} style={{ marginBottom: -3 }} color={color} name="person-add" />,
        }}
      />
    </BottomTab.Navigator>
  );
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const LoginStack = createStackNavigator<LoginParamList>();

function LoginNavigator() {
  return (
    <LoginStack.Navigator mode="modal">
      <LoginStack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{ headerTitle: 'Войти' }}
      />
      <LoginStack.Screen
        name="ForgetPasswordScreen"
        component={ForgetPasswordScreen}
        options={{ headerTitle: 'Восстановление пароля' }}
      />
      <LoginStack.Screen
        name="ChangePasswordScreen"
        component={ChangePasswordScreen}
        options={{ headerTitle: 'Изменение пароля' }}
      />
    </LoginStack.Navigator>
  );
}

const RegistrationStack = createStackNavigator<RegistrationParamList>();

function RegistrationNavigator() {
  return (
    <RegistrationStack.Navigator>
      <RegistrationStack.Screen
        name="RegistrationScreen"
        component={RegistrationScreen}
        initialParams={{ isSpcOwner: false }}
        options={{ headerTitle: 'Регистрация' }}
      />
    </RegistrationStack.Navigator>
  );
}