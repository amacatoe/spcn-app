import { useNavigation } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { CourseTakenModal } from '../components/elements/modal/courseTakenModal';
import { Text, View } from '../components/Themed';
import { colorFiolet, colorLightGrey } from '../constants/ColorVariables';
import { Course } from '../model/course';
import { CoursesParamList, HomeParamList } from '../types';
import { getCourseStatus, parseDate } from '../utils/dates';
import { CourseStatus } from '../model/courseStatus';

/**
 * Экран курса. 
 * 
 * -- ВХОДНЫЕ ДАННЫЕ -
 * 1) course - объект курса COURSE
 * 
 * -- ОПИСАНИЕ ЭКРАНА --
 * Пользователь просматривает информацию о курсе, а именно:
 * 1) Название курса
 * 2) Дозатор
 * 3) Период курса (дата начала - дата конца вкл), в скобках указывается общее количество дней приема лекарства
 * 4) Статус курса
 * 5) Время приема лекарства 
 * 
 * При нажатии на кнопку "Статистика курса", приложение отправляет запрос на сервис с телом {courseId: <..>},
 * ожидаемый ответ: 
 * 1) Успешный (по сути всегда) - тело вида {takes[]: <..>} - переход на экран статистики курса CourseTakesScreen;
 * 2) Неуспешный - bad request - вывод сообщения "Что-то пошло не так"
 * 
 */

type CourseScreenNavigationProp = StackNavigationProp<CoursesParamList, 'CourseScreen'>;

type IProp = {
  route: CourseScreenNavigationProp;
};

export default function CourseScreen({ route: { params } }: IProp) {
  const navigation = useNavigation();
  const [course, setCourse] = useState<Course>();
  const [visibleModal, setVisibleModal] = useState<boolean>(false);

  useEffect(() => {
    setCourse(() => params.course);
  }, []);

  function getStatus() {
    return (
      getCourseStatus(course?.dateStarted!, course?.dateFinished!) === CourseStatus.ACTIVE
        ? ('Активен (в процессе)')
        : (getCourseStatus(course?.dateStarted!, course?.dateFinished!) === CourseStatus.WAITING ? ('В ожидании (скоро начнется)') : ('Завершен'))
    )
  }

  function getDatePeriod() {
    const ds = new Date(course?.dateStarted!);
    const df = new Date(course?.dateFinished!);
    return parseDate(ds, "D MMM YYYY") + ' - ' + parseDate(df, "D MMM YYYY");
  }

  return (
    <View style={styles.container}>
      <View style={styles.infoWrapper}>
        <View style={styles.info}>
          <Text style={styles.text}>{'Курс приемов лекарства: '}</Text>
          <Text style={[styles.text, styles.highlightText]}>{course?.medicine}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.text}>{'Статус: '}</Text>
          <Text style={[styles.text, styles.highlightText]}>{getStatus()}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.text}>{'Дозатор: '}</Text>
          <Text style={[styles.text, styles.highlightText]}>{course?.spc}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.text}>{'Период приемов: '}</Text>
          <Text style={[styles.text, styles.highlightText]}>{getDatePeriod()}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.text}>{'Длительность приема: '}</Text>
          <Text style={[styles.text, styles.highlightText]}>{course?.takeDurationSec! / 60}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.text}>{'В какое время принимается лекарство: '}</Text>
          <Text style={[styles.text, styles.highlightText]}>
            {course?.timetable.map((e, index) => e + ((index !== course.timetable.length - 1) ? ', ' : ''))}
          </Text>
        </View>
      </View>
      {!params.isFinalCourses && (
        <View style={styles.btnView}>
          <TouchableOpacity onPress={() => setVisibleModal(() => true)} style={styles.btn}>
            <Text>Статистика курса</Text>
          </TouchableOpacity>
        </View>
      )}
      {!!course && (
        <CourseTakenModal
          visible={visibleModal}
          courseId={course.id}
          hideFunc={() => setVisibleModal(() => false)}
        />
      )

      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  btnView: {
    width: '90%'
  },
  btn: {
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    backgroundColor: colorFiolet,
    paddingVertical: 10,
    paddingHorizontal: 15
  },
  infoWrapper: {
    width: '90%',
  },
  info: {
    marginVertical: 10
  },
  text: {
    fontSize: 18
  },
  highlightText: {
    fontSize: 22,
    marginVertical: 5,
    padding: 5,
    backgroundColor: colorLightGrey
  },
});
