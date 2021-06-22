import { useNavigation } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import InfoText from '../components/elements/text/InfoText';
import { ScrollView, Text, View } from '../components/Themed';
import { colorBlack, colorFiolet, colorGreen, colorGrey, colorLightGrey, colorOrange, colorRed, colorWhite } from '../constants/ColorVariables';
import { Course } from '../model/course';
import { CoursesParamList } from '../types';
import { getCourses } from '../utils/courseFunc';
import FlatList from 'flatlist-react';
import { StorageContext } from '../context/Storage';
import { User } from '../model/user';
import { CourseStatus } from '../model/courseStatus';
import { FontAwesome } from '@expo/vector-icons';
import { topSuccessMessage } from '../utils/message';
import { ConfirmModal } from '../components/elements/modal/confirmModal';
import { delCourse } from '../agent';
import { getCourseStatus } from '../utils/dates';

/**
 * Экран курсов. 
 * 
 * -- ВХОДНЫЕ ДАННЫЕ --
 * 1) userId - id юзера, чьи курсы надо отобразить
 * 2) isFinalCourses - бул-значение является ли список курсов списком завершенных курсов. 
 * 
 * Варианты использования: 
 * 1) Из основной навигации (текущий пользователь);
 * 2) Из навигации внутри опекаемого пользователя. 
 * 
 * -- ОПИСАНИЕ ЭКРАНА --
 * Здесь отображается список курсов. 
 * Если isFinalCourses === false, то отображаются кнопки "Архив курсов" и "Создать курс". 
 * 
 * При нажатии на кнопку "Создать курс" - переход на экран создания курса AddCourseScreen.
 * 
 * При нажатии на кнопку "Архив курсов" - переход на этот же экран (isFinalCourses === true) 
 * 
 */

type CoursesScreenNavigationProp = StackNavigationProp<CoursesParamList, 'CoursesScreen'>;
type IProp = {
  route: CoursesScreenNavigationProp;
};

export default function CoursesScreen({ route: { params } }: IProp) {
  const navigation = useNavigation();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { getUser } = useContext(StorageContext);
  const [user, setUser] = useState<User>(getUser());
  const [selectedCourse, setSelectedCourse] = useState<number>();
  const [visibility, setVisibility] = useState<boolean>(false);

  function getFinalCourses() {
    return getCourses(user, params.userId).filter(course => getCourseStatus(course.dateStarted, course.dateFinished) === CourseStatus.FINISHED);
  }

  function getActiveCourses() {
    return getCourses(user, params.userId).filter(course => getCourseStatus(course.dateStarted, course.dateFinished) !== CourseStatus.FINISHED);
  }

  function isCurrentUser() {
    return user.id === parseInt(params.userId);
  }

  async function delCourseRequest() {
    await delCourse(selectedCourse!).then((data) => topSuccessMessage('Курс успешно удален!'))
    setVisibility(false);
    setSelectedCourse(undefined);
  }

  const renderCourse = (course: Course) => (
    <View
      style={styles.courseView}
      key={'course-' + course.id}
    >
      <View
        style={[styles.item,
        {
          backgroundColor:
          getCourseStatus(course.dateStarted, course.dateFinished)  === CourseStatus.ACTIVE
              ? colorGreen
              : (getCourseStatus(course.dateStarted, course.dateFinished)  === CourseStatus.WAITING
                ? colorOrange
                : (getCourseStatus(course.dateStarted, course.dateFinished)  === CourseStatus.FINISHED) ? colorLightGrey : colorWhite)
        }]}
      >
        <TouchableOpacity onPress={() => navigation.navigate({
          name: isCurrentUser() ? 'CourseScreen' : 'SpcOwnerCourseScreen',
          params: { course: course },
        })}>
          <Text>{course.medicine}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.btnRow}>
        <TouchableOpacity onPress={() => confirmDelete(course.id)}>
          <FontAwesome name="trash" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );


  useEffect(() => {
    setUser(() => getUser())
  }, [])

  function confirmDelete(id: number) {
    setSelectedCourse(() => id);
    setVisibility(true);
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchView}>
        <TextInput
          style={styles.search}
          placeholder={"Введите название курса..."}
          onChangeText={searchTerm => setSearchTerm(searchTerm)}
          placeholderTextColor={colorGrey}
        />
      </View>
      <ScrollView style={[styles.scrollView, { height: params.isFinalCourses ? '80%' : '65%' }]}>
        <FlatList
          list={params.isFinalCourses ? getFinalCourses() : getActiveCourses()}
          renderItem={renderCourse}
          renderWhenEmpty={() => <Text style={styles.text}>Курсов приемов нет</Text>}
          sortBy={[{ key: "dateStarted", descending: false }]}
          searchTerm={searchTerm}
          searchBy={'medicine'}
          searchMinCharactersCount={1}
        />
      </ScrollView>
      {!params.isFinalCourses && (
        <View style={styles.btnView}>
          <TouchableOpacity onPress={() => navigation.navigate({
            name: 'AddCourseScreen',
            params: { userId: params.userId },
          })} style={styles.btn}>
            <Text style={styles.text}>Добавить курс</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate({
            name: isCurrentUser() ? 'FinalCoursesScreen' : 'SpcOwnerFinalCoursesScreen',
            params: { userId: params.userId, isFinalCourses: true },
          })} style={styles.btn}>
            <Text style={styles.text}>Архив курсов</Text>
          </TouchableOpacity>
        </View>
      )}

      <ConfirmModal
        visible={visibility}
        hideFunc={() => setVisibility(false)}
        changeFunc={() => delCourseRequest()}
        deleteItem={'курс'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
  },
  btnView: {
    flexDirection: 'row',
  },
  courseView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    marginBottom: 5
  },
  btn: {
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    backgroundColor: colorFiolet,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginHorizontal: 10
  },
  btnRow: {
    backgroundColor: colorRed,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '15%',
    height: '100%'
  },
  text: {
    textAlign: 'center'
  },
  scrollView: {
    width: '90%',
    marginVertical: 15
  },
  searchView: {
    backgroundColor: colorWhite,
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: colorBlack,
    alignItems: 'center',
  },
  search: {
    color: colorBlack,
    fontSize: 17,
  },
  item: {
    padding: 13,
    width: '85%',
    height: '100%',
  }
});
