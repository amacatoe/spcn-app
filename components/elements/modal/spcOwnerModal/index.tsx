import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import Modal from 'react-native-modal';
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { colorBlack, colorFiolet, colorGreen, colorGrey, colorRed, colorWhite } from "../../../../constants/ColorVariables";
import { validateEmail } from "../../../../utils/validation";
import { Text } from "../../../Themed";
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
  registerNavigation: () => void;
}

export const AddSpcOwnerModal = (props: IProp) => {
  const [email, setEmail] = useState<string>('');
  const [isValid, setIsValid] = useState<boolean>(false);
  const [code, setCode] = useState<string>('');
  const [isAdding, setIsAdding] = useState<boolean>(false);

  const validate = (value: string) => {
    setEmail(value);
    setIsValid(() => validateEmail(value));
  }

  function cancel() {
    setIsAdding(() => false);
    props.hideFunc();
  }

  return (
    <Modal
      isVisible={props.visible}
      avoidKeyboard={true}
      onBackButtonPress={cancel}
      onBackdropPress={cancel}
    >
      <View style={styles.modalView}>
        <Text darkColor={colorBlack} style={styles.title}>Добавление опекаемого пользователя</Text>
        {!isAdding ? (
          <View>
            <View style={styles.btnColumnView}>
              <TouchableOpacity onPress={() => setIsAdding(() => true)} style={[styles.btn, styles.btnColumn]}>
                <Text>У опекаемого есть учетная запись</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={props.registerNavigation} style={[styles.btn, styles.btnColumn]}>
                <Text>У опекаемого нет учетной запись</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.view}>
            <View style={[styles.inputView, { backgroundColor: email.length > 0 ? (isValid ? colorGreen : colorRed) : colorWhite }]}>
              <TextInput
                style={[styles.TextInput]}
                placeholder="Email"
                placeholderTextColor={colorBlack}
                onChangeText={(val) => validate(val)}
                keyboardType='email-address'
              />
            </View>
            <View style={styles.btnView}>
              <TouchableOpacity onPress={cancel} style={[styles.btn]}>
                <Text>Отмена</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={props.hideFunc} style={[styles.btn, styles.btnGreen]}>
                <Text>Добавить пользователя</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
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
  btnColumnView: {
    flexDirection: 'column',
    marginTop: 20,
    backgroundColor: colorWhite
  },
  view: {
    width: '90%'
  },
  inputView: {
    borderRadius: 30,
    borderWidth: 1,
    borderColor: colorBlack,
    height: 45,
    marginVertical: 20,
    alignItems: "center",
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
    justifyContent: 'space-between'
  },
  btn: {
    padding: 13,
    borderRadius: 20,
    backgroundColor: colorGrey,
  },
  btnGreen: {
    backgroundColor: colorGreen,
  },
  btnColumn: {
    marginVertical: 10,
    marginHorizontal: 0,
    backgroundColor: colorFiolet,
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