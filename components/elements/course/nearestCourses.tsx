import { StackNavigationProp } from '@react-navigation/stack';
import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, ActivityIndicator } from 'react-native';
import { colorBlack, colorFiolet, colorLightBlack, colorLightGrey, colorRed } from '../../../constants/ColorVariables';
import { Course, courseStub } from '../../../model/course';
import { isToday, isTodayOrLess, parseDate } from '../../../utils/dates';
import { getAllUsers } from '../../../utils/userFunc';
import { ScrollView, View, Text } from '../../Themed';
import InfoText from '../text/InfoText';
import FlatList from 'flatlist-react';
import { StorageContext } from '../../../context/Storage';
import { CourseStatus } from '../../../model/courseStatus';

interface ICourseUserMap {
  course: Course;
  username: string;
  userId: number;
}

interface INearestCoursesListItem {
  key: string;
  id: any;
  medicine: string;
  time: string;
  user: string;
}

export default function NearestCourses() {
  const [list, setList] = useState<INearestCoursesListItem[]>([]);
  const { getUser } = useContext(StorageContext);

  const renderListCourses = (item: INearestCoursesListItem) => {
    return (
      <View style={styles.item} key={item.key}>
        <Text style={styles.text} lightColor={colorBlack} darkColor={colorBlack}>
          {item.user + ': ' + item.medicine + ', ' + item.time}
        </Text>
      </View>
    );
  }

  useEffect(() => {
    renderList();
  }, []);

  function getMapAllActiveCourses(): ICourseUserMap[] {
    let tmpCourses: ICourseUserMap[] = [];
    getAllUsers(getUser()).map(user => (
      !!user.courses && (user.courses.map(course => {
        if (course.status === CourseStatus.ACTIVE) tmpCourses.push({ course: course, userId: user.id, username: user.username! })
      }
      ))
    ))
    return tmpCourses;
  }

  function renderList() {
    const now: Date = new Date();
    const courses: ICourseUserMap[] = getMapAllActiveCourses();
    let list: INearestCoursesListItem[] = [];
    courses.map((course, i) => {
      const timetable = course.course.timetable?.filter((f) => f >= parseDate(now, 'HH:mm'));
      if (!!timetable && timetable?.length > 0) {
        timetable.map((time, t_i) => list.push({
          key: 'ind-' + i + '-' + t_i,
          id: course.course.id,
          medicine: course.course.medicine!,
          time: time,
          user: course.username
        }));
      }

    });

    // list.sort((a: INearestCoursesListItem, b: INearestCoursesListItem) => a.time > b.time ? (a.time === b.time ? (0) : (1)) : (-1));
    setList(list);
  }

  return (
    <View style={styles.container}>
      <InfoText textSize={22} width={'70%'}>Ближайшее время приема лекарства</InfoText>
      <ScrollView style={styles.scrollView}>
        <FlatList
          list={list}
          renderItem={renderListCourses}
          renderWhenEmpty={() => <Text style={styles.text}>На сегодня приемов лекарства нет.</Text>}
          sortBy={[{ key: "time", descending: false }]}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
    width: '80%',
  },
  text: {
    fontSize: 14,
    lineHeight: 18,
    textAlign: 'center',
    padding: 10,
  },
  scrollView: {
    width: '90%',
    height: '50%'
  },
  item: {
    width: '100%',
    backgroundColor: colorLightGrey,
  }
});
