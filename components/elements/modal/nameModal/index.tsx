import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import Modal from 'react-native-modal';
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { colorBlack, colorFiolet, colorGreen, colorGrey, colorRed, colorWhite } from "../../../../constants/ColorVariables";
import { validateEmail } from "../../../../utils/validation";
import { Text } from "../../../Themed";
import { changeUsername } from "../../../../agent";
/**
 * Модальное окно добавления опекаемого пользователя, аккаун которого существует. 
 * 
 * -- ВХОДНЫЕ ДАННЫЕ --
 * 1) userId - id текущего пользователя.
 * 
 * -- ОПИСАНИЕ ЭКРАНА --
 * Здесь отображается поле с вводом e-mail и кода. 
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
  userId: number;
  username: string;
}

export const SetNameModal = (props: IProp) => {
  const [username, setUsername] = useState<string>(props.username);

  async function sendChangeNameRequest() {
    changeUsername(props.userId, {username: username});
  }

  return (
    <Modal
      isVisible={props.visible}
      avoidKeyboard={true}
      onBackButtonPress={props.hideFunc}
      onBackdropPress={props.hideFunc}
    >
      <View style={styles.modalView}>
        <Text darkColor={colorBlack} style={styles.title}>Редактирование имени пользователи</Text>
        <View style={[styles.inputView]}>
          <TextInput
            style={[styles.TextInput]}
            placeholder="Имя пользователя"
            placeholderTextColor={colorBlack}
            onChangeText={setUsername}
            value={username}
            keyboardType='default'
          />
        </View>
        <View style={styles.btnView}>
          <TouchableOpacity onPress={props.hideFunc} style={[styles.btn]}>
            <Text>Отмена</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={sendChangeNameRequest} style={[styles.btn, styles.btnGreen]}>
            <Text>Редактировать</Text>
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
  title: {
    fontSize: 20,
    textAlign: 'center'
  },
  inputView: {
    borderRadius: 30,
    borderWidth: 1,
    borderColor: colorBlack,
    height: 45,
    marginVertical: 20,
    alignItems: "center",
    backgroundColor: colorWhite,
    width: '80%'
  },
  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    width: '100%',
    textAlign: 'center'
  },
  btnView: {
    flexDirection: 'row',
    marginTop: 5,
    justifyContent: 'space-between',
    width: '80%'
  },
  btn: {
    padding: 13,
    borderRadius: 20,
    backgroundColor: colorGrey,
  },
  btnGreen: {
    backgroundColor: colorGreen,
  },
});