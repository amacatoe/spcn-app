import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Modal from 'react-native-modal';
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { colorBlack, colorGreen, colorGrey, colorRed, colorWhite } from "../../../../constants/ColorVariables";
import { Take } from "../../../../model/take";
import { PlainList } from "flatlist-react";
import { parseDate } from "../../../../utils/dates";
import { getCourseTakes } from "../../../../agent";
/**
 * Модальное окно статистики курса. 
 * 
 * -- ВХОДНЫЕ ДАННЫЕ --
 * 1) courseId - id курса, для которого необходимо получить статистику.
 * 
 * -- ОПИСАНИЕ ЭКРАНА --
 * Здесь отображается статистика курса. 
 * 
 * При вызове модального окна, приложение отправляет запрос на сервис с телом {courseId: <..>},
 * ожидаемый ответ: 
 * 1) успешный (по сути всегда) - тело вида {takes: <..>[]}
 * 2) неуспешный - bad request - вывод ошибки с текстом "Что-то пошло не так"
 * 
 */

interface IProp {
  visible: boolean;
  hideFunc: () => void;
  courseId: number;
}

export const CourseTakenModal = (props: IProp) => {
  const [takes, setTakes] = useState<Take[]>([]);

  useEffect(() => {
    const takesRequest = async () => {
      await getCourseTakes(props.courseId).then((data) => {
        setTakes(() => Take.mapToModels(data));
      })
    }

    takesRequest();
  }, [props.courseId]);

  const renderItem = (item: Take, index: number) => (
    <View key={'takes-' + index} style={styles.takesView}>
      <View style={[styles.indicator, { backgroundColor: item.taken ? colorGreen : colorRed }]}></View>
      <Text>{parseDate(new Date(item.date), "D MMM YYYY, HH:mm") + ': Лекарство ' + (item.taken ? 'принято' : 'не принято')}</Text>
    </View>
  )

  return (
    <Modal
      isVisible={props.visible}
      avoidKeyboard={true}
      onBackButtonPress={props.hideFunc}
      onBackdropPress={props.hideFunc}
    >
      <View style={styles.modalView}>
        <ScrollView style={styles.scrollView}>
          {takes.length > 0 ? (<PlainList
            list={takes}
            renderItem={renderItem}
          />) : (<Text>Стастистика отсутствует.</Text>)
          }
        </ScrollView>

        <View style={styles.btnView}>
          <TouchableOpacity onPress={props.hideFunc} style={[styles.btn]}>
            <Text>Закрыть</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalView: {
    backgroundColor: colorWhite,
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 10,
    alignItems: "center",
    shadowColor: colorBlack,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  btnView: {
    flexDirection: 'row',
    marginTop: 20
  },
  btn: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: colorGrey,
    marginHorizontal: 10,
  },
  text: {
    color: colorBlack,
    fontSize: 18,
    marginBottom: 20,
    maxWidth: '90%',
  },
  scrollView: {
    maxHeight: '70%'
  },
  takesView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5
  },
});