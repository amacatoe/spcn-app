import { StackNavigationProp } from '@react-navigation/stack';
import React, { useContext, useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { ScrollView, Text, View, VisibleOnTapKeyboardView } from '../components/Themed';
import { colorBlack, colorFiolet, colorGrey, colorLightGrey, colorOrange, colorWhite } from '../constants/ColorVariables';
import { CoursesParamList, HomeParamList } from '../types';
import RNPickerSelect from 'react-native-picker-select';
import { getSpc } from '../utils/spcFunct';
import { SpcModal } from '../components/elements/modal/addSpcModal';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { getCourseStatus, parseDate } from '../utils/dates';
import { getCourses } from '../utils/courseFunc';
import { CourseStatus } from '../model/courseStatus';
import { StorageContext } from '../context/Storage';
import { addCourse, getUserFromApi } from '../agent';
import { CourseToSave } from '../model/course';
import { topWarningMessage } from '../utils/message';
import { saveUserInLocalStorage } from '../utils/localStorage';
import { useNavigation } from '@react-navigation/core';
import { User } from '../model/user';
import { createScheduleNotification } from '../components/elements/notify/pushNotify';

/**
 * Экран добавления курса. 
 * 
 * -- ВХОДНЫЕ ДАННЫЕ --
 * 1) userId - id пользователя, для которого добавляется курс;
 * 
 * -- ОПИСАНИЕ ЭКРАНА --
 * Пользователь задает настройки курса:
 * 1) Название курса
 * 2) Дата начала курса
 * 3) Количество дней приема
 * 4) Время приема
 * 5) Дозатор
 * 
 * При выборе дозатора можно добавить новый дозатор к данному пользователю:
 * При нажатии на строку "Добавить дозатор", открывается модальное окно добавления дозатора. 
 * 
 * При нажатии на кнопку "Создать курс", приложение отправляет запрос на сервис с телом 
 * {medicine: <..>, spc: <..>, dateStarted: <..>, dateFinished: <..>, status: <..>, timetable: <..>}, 
 * ожидаемый ответ:
 * 1) Успешный - 200 ОК - вывод сообщения "Вы добавили новый курс приема лекарства {название}.", возврат на страницу курсов
 * 2) Неуспешный - badrequest? - вывод сообщения "Что-то пошло не так"
 * 
 */

type AddCourseScreenNavigationProp = StackNavigationProp<CoursesParamList, 'AddCourseScreen'>;
type IProp = {
  route: AddCourseScreenNavigationProp;
};

export default function AddCourseScreen({ route: { params } }: IProp) {
  const [medicine, setMedicine] = useState<string>('');
  const [spc, setSpc] = useState<string>();
  const [userSpc, setUserSpc] = useState<string[]>();
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [minDate, setMinDate] = useState<Date>(new Date());
  const [dateStarted, setDateStarted] = useState<Date>();
  const [dateFinished, setDateFinished] = useState<Date>();
  const [visibleDatePicker, setVisibleDatePicker] = useState<boolean>(false);
  const [isStartDate, setIsStartDate] = useState<boolean>();
  const [visibleWarning, setVisibleWarning] = useState<boolean>(false);
  const [date, setDate] = useState<Date>();
  const [visibleTimePicker, setVisibleTimePicker] = useState<boolean>(false);
  const [timetable, setTimetable] = useState<string[]>([]);
  const [takeDurationSec, setTakeDurationSec] = useState<number>();
  const { getUser, setUser } = useContext(StorageContext);
  const navigation = useNavigation();


  useEffect(() => {
    setUserSpc(() => getSpc(getUser(), params.userId));
  }, [params.userId]);

  function openDateStartedPickerModal() {
    setDate(minDate);
    setIsStartDate(true);
    setVisibleDatePicker(true);
  }

  function openDateFinishedPickerModal() {
    setDate(dateStarted ?? minDate)
    setIsStartDate(false);
    setVisibleDatePicker(true);
  }

  function changeDateStarted(date: Date) {
    setDateStarted(() => date);
    setDateFinished(() => undefined);
    setVisibleDatePicker(false);
  }

  function changeDateFinished(date: Date) {
    setDateFinished(() => date);
    setVisibleDatePicker(false);
  }

  function isEnabled(spc: string) {
    const course = getCourses(getUser(), params.userId).find(course => (getCourseStatus(course.dateStarted, course.dateFinished) === CourseStatus.ACTIVE && course.spc === spc));
    return course?.dateFinished;
  }

  function getMinDate(spc: string) {
    const dateF = isEnabled(spc);
    var minDate = new Date();
    if (!!dateF) {
      minDate = new Date(dateF);
      minDate = new Date(minDate.getTime() + (24 * 60 * 60 * 1000));
      setVisibleWarning(true);
    }

    setMinDate(() => minDate);
  }

  function changeSpc(spc: string) {
    setSpc(() => spc);
    getMinDate(spc);
    setDateStarted(() => undefined);
    setDateFinished(() => undefined);
  }

  function addTime(date: Date) {
    var time = parseDate(date, 'HH:mm');
    if (!timetable.includes(time)) {
      setTimetable((prevState) => [...prevState, time]);
    }
    setVisibleTimePicker(() => false);
  }

  function delTime(time: string) {
    setTimetable((prevState) => prevState.filter(t => t !== time));
  }

  async function sendAddCourseRequest() {
    if (!!spc && medicine.length > 0 && !!dateStarted && !!dateFinished && timetable.length > 0 && !!takeDurationSec) {
      await addCourse({
        course: CourseToSave.mapToEntity(
          medicine,
          spc,
          parseDate(dateStarted, 'YYYY-MM-DD'),
          parseDate(dateFinished, 'YYYY-MM-DD'),
          timetable,
          takeDurationSec),
        userId: params.userId
      }).then(() => onAdd());
    } else {
      topWarningMessage('Пожалуйста, заполните данные курса!')
    }
  }

  async function onAdd() {
    await getUserFromApi(getUser().id).then((data) => 
    saveUserInLocalStorage(User.mapToModel(data)).then(() => {
      createScheduleNotification(
        getUser().username, 
        timetable, 
        parseDate(dateStarted!, 'YYYY-MM-DD'), 
        parseDate(dateFinished!, 'YYYY-MM-DD'),
        medicine
      );
      navigation.goBack()
    }))
  }

  return (
    <ScrollView>
      <VisibleOnTapKeyboardView>
        <KeyboardAvoidingView behavior='padding' keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}>
          {(!!userSpc && userSpc?.length > 0) ? (
            <View style={styles.container}>
              <View style={styles.wrapper}>
                <View style={styles.selectView}>
                  <Text>Название курса (лекарства): </Text>
                  <View style={[styles.inputView]}>
                    <TextInput
                      style={styles.TextInput}
                      placeholder="Введите название"
                      placeholderTextColor={colorBlack}
                      onChangeText={setMedicine}
                      keyboardType='default'
                    />
                  </View>
                </View>
                <View style={styles.selectView}>
                  <Text>Дозатор: </Text>
                  <View style={styles.select}>
                    <RNPickerSelect
                      onValueChange={changeSpc}
                      placeholder={{ label: 'Выберите дозатор' }}
                      items={userSpc.map((spc) => (
                        { label: spc, value: spc }
                      ))}
                      value={spc}
                      itemKey={'spc-'}
                      enabled={userSpc!.length > 0}
                    >
                      <Text style={{ textAlign: 'center' }} darkColor={colorBlack} lightColor={colorBlack}>{spc ?? 'Выберите дозатор'}</Text>
                    </RNPickerSelect>
                  </View>
                </View>
                <Text style={[styles.warningText,
                {
                  opacity: visibleWarning ? 1 : 0,
                  height: visibleWarning ? 'auto' : 0,
                  padding: visibleWarning ? 10 : 0,
                  marginVertical: visibleWarning ? 10 : 0,
                }
                ]} darkColor={colorOrange} lightColor={colorBlack}>
                  На данный момент дозатор используется для другого курса. Установлена минимально доступная дата начала курса.
          </Text>
                <View style={styles.selectView}>
                  <Text>Даты начала и конца курса: </Text>
                  <View style={styles.select}>
                    <Text style={{ textAlign: 'center' }} darkColor={colorBlack} lightColor={colorBlack} onPress={openDateStartedPickerModal}>{!!dateStarted ? parseDate(dateStarted, "D MMM YYYY") : 'Выберите дату начала'}</Text>
                  </View>
                  <View style={styles.select}>
                    <Text style={{ textAlign: 'center' }} darkColor={colorBlack} lightColor={colorBlack} onPress={openDateFinishedPickerModal}>{!!dateFinished ? parseDate(dateFinished, "D MMM YYYY") : 'Выберите дату конца'}</Text>
                  </View>
                  <DateTimePickerModal
                    mode="date"
                    locale="ru"
                    date={date}
                    isVisible={visibleDatePicker}
                    onConfirm={(date: Date) => isStartDate ? changeDateStarted(date) : changeDateFinished(date)}
                    onCancel={() => setVisibleDatePicker(false)}
                    minimumDate={isStartDate ? minDate : dateStarted}
                    headerTextIOS={isStartDate ? 'Выберите дату начала' : 'Выберите дату конца'}
                    confirmTextIOS={'Выбрать'}
                    cancelTextIOS={'Отмена'}
                  />
                </View>
                <View style={styles.selectView}>
                  <Text>Время приемов: </Text>
                  <View style={styles.timesView}>
                    <View style={styles.times}>
                      {timetable.map((t: string, index: number) => (
                        <View style={styles.time} key={'t-' + index}>
                          <Text>{t}</Text>
                          <TouchableOpacity onPress={() => delTime(t)} style={[styles.btnDelTime]}>
                            <Text>✖</Text>
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                    <View>
                      <TouchableOpacity onPress={() => setVisibleTimePicker(true)} style={[styles.btn, styles.btnTime]}>
                        <Text>Добавить время приема</Text>
                      </TouchableOpacity>
                    </View>
                    <DateTimePickerModal
                      mode="time"
                      locale="ru"
                      is24Hour={true}
                      isVisible={visibleTimePicker}
                      onConfirm={addTime}
                      onCancel={() => setVisibleTimePicker(false)}
                      headerTextIOS={'Выберите время приема'}
                      confirmTextIOS={'Добавить'}
                      cancelTextIOS={'Отмена'}
                    />
                  </View>
                </View>
                <View style={styles.selectView}>
                  <Text>Длительность приема: </Text>
                  <View style={[styles.inputView]}>
                    <TextInput
                      style={styles.TextInput}
                      placeholder="Введите кол-во минут"
                      placeholderTextColor={colorBlack}
                      onChangeText={(data) => {
                        const min = parseInt(data);
                        setTakeDurationSec(min * 60);
                      }}
                      keyboardType='numeric'
                    />
                  </View>
                </View>
              </View>
              <View>
                <TouchableOpacity onPress={sendAddCourseRequest} style={styles.btnAdd}>
                  <Text>Добавить курс</Text>
                </TouchableOpacity>
              </View>
            </View>) : (
            <View style={[styles.container, styles.containerCenter]}>
              <Text style={styles.addSpcText}>На данный момент отсутствует дозатор, который можно использовать для нового курса. </Text>
              <View>
                <TouchableOpacity onPress={() => setVisibleModal(true)} style={styles.btn}>
                  <Text style={styles.btnText}>Добавить дозатор</Text>
                </TouchableOpacity>
              </View>
              <SpcModal
                userId={params.userId}
                visible={visibleModal}
                hideFunc={() => setVisibleModal(false)}
                changeFunc={(userId: number, spc: string) => setSpc(() => spc)}
              />
            </View>
          )}
        </KeyboardAvoidingView>
      </VisibleOnTapKeyboardView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: '100%'
  },
  containerCenter: {
    justifyContent: 'center'
  },
  wrapper: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
  },
  btnAdd: {
    paddingVertical: 15,
    paddingHorizontal: 25,
    backgroundColor: colorFiolet,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  btn: {
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    paddingVertical: 15,
    paddingHorizontal: 25,
    backgroundColor: colorFiolet,
  },
  btnText: {
    color: colorBlack,
    fontSize: 18,
  },
  btnTime: {
    marginTop: 10,
    paddingVertical: 10,
  },
  inputView: {
    borderRadius: 30,
    borderWidth: 1,
    borderColor: colorBlack,
    width: "100%",
    height: 45,
    alignItems: "center",
    marginTop: 10,
    backgroundColor: colorWhite
  },
  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    width: '100%',
    textAlign: 'center'
  },
  selectView: {
    marginBottom: 20,
    width: '75%',
  },
  select: {
    borderRadius: 30,
    borderWidth: 1,
    borderColor: colorBlack,
    width: "100%",
    padding: 13,
    marginTop: 10,
    backgroundColor: colorWhite
  },
  addSpcText: {
    fontSize: 20,
    maxWidth: '90%',
    textAlign: 'center',
    lineHeight: 27,
  },
  warningText: {
    width: '75%',
    lineHeight: 24,
    fontSize: 12,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: colorOrange,
    borderRadius: 15,
  },
  timesView: {
    marginTop: 10,
  },
  times: {
    flexDirection: 'row'
  },
  time: {
    padding: 10,
    borderWidth: 1,
    borderColor: colorLightGrey,
    borderRadius: 20,
    marginRight: 5,
    flexDirection: 'row',
    alignItems: 'center'
  },
  btnDelTime: {
    backgroundColor: colorGrey,
    color: colorFiolet,
    borderRadius: 10,
    paddingVertical: 1,
    marginLeft: 5
  },
});
