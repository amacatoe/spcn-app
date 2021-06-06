import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import HomeScreen from '../screens/HomeScreen';
import CoursesScreen from '../screens/CoursesScreen';
import SpcOwnersScreen from '../screens/SpcOwnersScreen';
import { BottomTabParamList, HomeParamList, CoursesParamList, SpcOwnersParamList, ProfileParamList } from '../types';
import SpcScreen from '../screens/SpcScreen';
import RegistrationScreen from '../screens/RegistrationScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CourseScreen from '../screens/CourseScreen';
import AddCourseScreen from '../screens/AddCourseScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';
import { StorageContext } from '../context/Storage';

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      tabBarOptions={{ activeTintColor: Colors[colorScheme].tint }}>
      <BottomTab.Screen
        name="Главная"
        component={HomeNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="ios-home" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Курсы приемов"
        component={CourseNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="md-list-circle" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Опекаемые"
        component={SpcOwnersNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="ios-people" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Личный кабинет"
        component={ProfileNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="person" color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
}

function TabBarIcon(props: { name: React.ComponentProps<typeof Ionicons>['name']; color: string }) {
  return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
}

const HomeStack = createStackNavigator<HomeParamList>();

function HomeNavigator() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ headerTitle: 'Умная банка' }}
      />
      <HomeStack.Screen
        name="SpcScreen"
        component={SpcScreen}
        options={{ headerTitle: 'Мои дозаторы' }}
      />
    </HomeStack.Navigator>
  );
}

const CourseStack = createStackNavigator<CoursesParamList>();

function CourseNavigator() {
  const { getUser } = React.useContext(StorageContext);
  const [user, setUser] = React.useState<User>(getUser())

  return (
    <CourseStack.Navigator>
      <CourseStack.Screen
        name="CoursesScreen"
        component={CoursesScreen}
        initialParams={{ isFinalCourses: false, userId: user.id }}
        options={{ headerTitle: 'Курсы приемов' }}
      />
      <CourseStack.Screen
        name="CourseScreen"
        component={CourseScreen}
        options={{ headerTitle: 'Курсы приемов' }}
      />
      <CourseStack.Screen
        name="FinalCoursesScreen"
        component={CoursesScreen}
        options={{ headerTitle: 'Архив курсов приемов' }}
      />
      <CourseStack.Screen
        name='AddCourseScreen'
        component={AddCourseScreen}
        options={{ headerTitle: 'Добавить курс приемов' }}
      />
    </CourseStack.Navigator>
  );
}

const SpcOwnersStack = createStackNavigator<SpcOwnersParamList>();

function SpcOwnersNavigator() {
  return (
    <SpcOwnersStack.Navigator>
      <SpcOwnersStack.Screen
        name="SpcOwnersScreen"
        component={SpcOwnersScreen}
        options={{ headerTitle: 'Опекаемые пользователи' }}
      />
      <SpcOwnersStack.Screen
        name="AddSpcOwnerScreen"
        component={RegistrationScreen}
        initialParams={{ isSpcOwner: true}}
        options={{ headerTitle: 'Регистрация опекаемого пользователя' }}
      />
      <SpcOwnersStack.Screen
        name="SpcOwnerCoursesScreen"
        component={CoursesScreen}
        options={{ headerTitle: 'Курсы опекаемого пользователя' }}
      />
      <SpcOwnersStack.Screen
        name="SpcOwnerCourseScreen"
        component={CourseScreen}
        options={{ headerTitle: 'Курс опекаемого пользователя' }}
      />
      <SpcOwnersStack.Screen
        name="SpcOwnerFinalCoursesScreen"
        component={CoursesScreen}
        options={{ headerTitle: 'Архив курсов опекаемого пользователя' }}
      />
      <SpcOwnersStack.Screen
        name="AddSpcOwnerCourseScreen"
        component={AddCourseScreen}
        options={{ headerTitle: 'Добавить курс приемов' }}
      />
    </SpcOwnersStack.Navigator>
  );
}

const ProfileStack = createStackNavigator<ProfileParamList>();

function ProfileNavigator() {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{ headerTitle: 'Личный кабинет' }}
      />
      <ProfileStack.Screen
        name="ChangePasswordProfileScreen"
        component={ChangePasswordScreen}
        options={{ headerTitle: 'Изменить пароль' }}
      />
    </ProfileStack.Navigator>
  );
}