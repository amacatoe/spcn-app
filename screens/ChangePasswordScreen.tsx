import React, { useContext, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View, VisibleOnTapKeyboardView } from '../components/Themed';
import { colorBlack, colorFiolet, colorGreen, colorRed, colorWhite } from "../constants/ColorVariables";
import { TextInput, TouchableOpacity } from "react-native";
import { topDangerMessage, topSuccessMessage } from '../utils/message';
import { StackNavigationProp } from '@react-navigation/stack';
import { LoginParamList } from '../types';
import InfoText from '../components/elements/text/InfoText';
import { auth, changePassword } from '../agent';
import { StorageContext } from '../context/Storage';

/**
 * Экран изменения пароля. 
 * 
 * -- ВХОДНЫЕ ДАННЫЕ --
 * 1) code - код (4 символа), которые был отправлен пользователю на email.
 * 2) email - существующий в системе email-адрес пользователя. 
 * 
 * Варианты использования экрана, ситуация проверяется наличием авторизованного пользователя в системе (!):
 * 1) Изменение пароля через экран авторизации (забыл пароль);
 * 2) Изменение пароля через личный кабинет.
 * 
 * -- ОПИСАНИЕ ЭКРАНА --
 * Пользователь вводит код, который отправили ему на электронный адрес и новый пароль 2 раза. 
 * При нажатии на кнопку "Изменить пароль":
 * 1. Если пароли совпадают и код валиден - то приложение отправляет запрос на API с телом: 
 * {email: <..>, password: <..>},
 * 
 * Ожидаемый ответ ПРИ 1 ВАРИАНТЕ использования: 
 * 1) если userId === null, то запрос считается неуспешным (ошибка апдейта) - вывод ошибки с текстом "Что-то пошло не так"
 * 2) если userId !== null, то приложение отправляет запрос на получение пользователя по полученному userId с телом {userId: <..>},
 * ожидаемый ответ (по сути всегда успешный) с телом {user: USER}
 * 2. Если пароли не совпадают или код невалиден - вывод ошибки с текстом "Код неверный/Пароли не совпадают"
 * 
 * Ожидаемый ответ ПРИ 2 ВАРИАНТЕ использования: 
 * 1) если userId === null, то запрос считается неуспешным (ошибка апдейта) - вывод ошибки с текстом "Что-то пошло не так"
 * 2) если userId !== null, то вывод сообщения с текстом "Пароль успешно обновлен"
 * 2. Если пароли не совпадают или код невалиден - вывод ошибки с текстом "Код неверный/Пароли не совпадают"
 */

type ChangePasswordScreenNavigationProp = StackNavigationProp<LoginParamList, 'ChangePasswordScreen'>;
type IProp = {
  route: ChangePasswordScreenNavigationProp;
};

export default function ChangePasswordScreen({ route : { params } }: IProp) {
  const [password, setPassword] = useState<string>('');
  const [passwordRepeat, setPasswordRepeat] = useState<string>('');
  const [isDifferent, setIsDifferent] = useState<boolean>(true);
  const [isValidCode, setIsValidCode] = useState<boolean>(false);
  const {getUser} = useContext(StorageContext);

  function checkPassword(val: string, repeat: boolean = true) {
    repeat
      ? setIsDifferent(password !== val)
      : setIsDifferent(passwordRepeat !== val)
  }

  function checkCode(val: string) {
    setIsValidCode(val === params.code);
  }

  function checkData() {
    isValidCode
      ? (!isDifferent
        ? sendChangePasswordRequest()
        : topDangerMessage('Пароли не совпадают')
      )
      : topDangerMessage('Введен неверный код');
  }

  async function sendChangePasswordRequest() {
    await changePassword({email: params.email, password: password}).then((data) => {
      if (getUser() === undefined) {
        auth({email: params.email, password: password}).then((data) => {
          topSuccessMessage('Пароль успешно изменен. Сейчас Вы будете авторизованы в системе.')
        })
      } else {
        topSuccessMessage('Пароль успешно изменен. ')
      }
    }) 
  }

  return (
    <VisibleOnTapKeyboardView>
      <View style={styles.container}>
        <InfoText width={'70%'}>На Ваш электронный адрес было отправлено письмо с кодом. Пожалуйста, заполните все текстовые поля.</InfoText>
        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            placeholder="Введите код"
            placeholderTextColor={colorBlack}
            onChangeText={(val) => checkCode(val)}
            keyboardType='numeric'
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            placeholder="Новый пароль"
            placeholderTextColor={colorBlack}
            secureTextEntry={true}
            onChangeText={(val) => {
              setPassword(val);
              checkPassword(val, false);
            }}
          />
        </View>
        <View
          style={[styles.inputView,
          { backgroundColor: passwordRepeat.length > 0 ? (!isDifferent ? colorGreen : colorRed) : colorWhite }
          ]}
        >
          <TextInput
            style={styles.TextInput}
            placeholder="Повторите пароль еще раз"
            placeholderTextColor={colorBlack}
            secureTextEntry={true}
            onChangeText={(val) => {
              setPasswordRepeat(val);
              checkPassword(val);
            }}
            editable={password.length > 0}
          />
        </View>

        <TouchableOpacity style={styles.loginBtn} onPress={checkData}>
          <Text>Изменить пароль</Text>
        </TouchableOpacity>
      </View>
    </VisibleOnTapKeyboardView >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  inputView: {
    backgroundColor: colorWhite,
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
  loginBtn: {
    width: "80%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    backgroundColor: colorFiolet,
  },
});
