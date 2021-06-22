import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Modal from 'react-native-modal';
import { TouchableOpacity } from "react-native-gesture-handler";
import { colorBlack, colorGrey, colorRed, colorWhite } from "../../../../constants/ColorVariables";
/**
 * Модальное окно добавления дозатора. 
 * 
 * -- ВХОДНЫЕ ПАРАМЕТРЫ --
 * 1) userId - id пользователя, которому добавляется дозатор, не обязательное поле 
 * (используется при добавлении дозатора из экрана создания курса приема)
 * 
 * Варианты использования, проверяется наличием входного параметра:
 * 1) Из экрана дозаторов;
 * 2) Из экрана создания курса приема. 
 * 
 * -- ОПИСАНИЕ ЭКРАНА --
 * Пользователь вводит серийный номер дозатора и, если нет userId, выбирает пользователя, к которому необходимо привязать дозатор. 
 * 
 * При нажатии на кнопку "Добавить дозатор",
 * сначала приложение проверяет наличие такого дозатора у авторизованного пользователя и его опекаемых,
 * если такой дозатор уже прикреплен, то выводится сообщение "Вы уже добавили данный дозатор в систему.",
 * иначе приложение отсылает запрос на сервис с телом {userId: <..>, spc: <..>}>,
 * ожидаемый ответ:
 * 1) успешный - 200 OK - дозатор привязан, скрывается модальное окно
 * 2) неуспешный - badrequest - 
 * (дозатор не удалось найти в системе 
 * или не удалось привязать 
 * или он уже привязан к какому-то другому пользователю) - вывод текста ошибки (текст задается на сервисе)
 */

interface IProp {
  visible: boolean;
  hideFunc: () => void;
  changeFunc: () => any;
  deleteItem: string;
}

export const ConfirmModal = (props: IProp) => {
  useEffect(() => {

  }, []);

  return (
    <Modal
      isVisible={props.visible}
      avoidKeyboard={true}
      onBackButtonPress={props.hideFunc}
      onBackdropPress={props.hideFunc}
    >
      <View style={styles.modalView}>
        <Text style={styles.text}>Вы действительно хотите удалить {props.deleteItem}?</Text>
        <View style={styles.btnView}>
          <TouchableOpacity onPress={props.changeFunc} style={[styles.btn, styles.btnRed]}>
            <Text>Удалить</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={props.hideFunc} style={[styles.btn]}>
            <Text>Отмена</Text>
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
  btnRed: {
    backgroundColor: colorRed,
  },
  inputView: {
    borderRadius: 30,
    borderWidth: 1,
    borderColor: colorBlack,
    width: "75%",
    height: 45,
    marginBottom: 20,
    alignItems: "center",
  },
  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    width: '100%',
    textAlign: 'center'
  },
  text: {
    color: colorBlack,
    fontSize: 18,
    marginBottom: 20,
    maxWidth: '90%',
  },
  selectView: {
    marginTop: 20,
    width: '75%'
  },
  select: {
    borderRadius: 30,
    borderWidth: 1,
    borderColor: colorBlack,
    width: "100%",
    padding: 13,
    marginTop: 10
  }
});