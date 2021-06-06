import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View, VisibleOnTapKeyboardView } from '../components/Themed';
import { colorBlack, colorFiolet, colorGreen, colorRed, colorWhite } from "../constants/ColorVariables";
import { TextInput, TouchableOpacity } from "react-native";
import { topDangerMessage, topSuccessMessage } from '../utils/message';
import { AuthParamList } from '../types';
import { StackNavigationProp } from '@react-navigation/stack';
import { validateEmail } from '../utils/validation';
import InfoText from '../components/elements/text/InfoText';
import { associateUsers, isSpcOwned, registration, getUserFromApi, auth } from '../agent';
import { StorageContext } from '../context/Storage';
import { AuthContext } from '../context/Auth';
import { saveUserInLocalStorage } from '../utils/localStorage';
import { useNavigation } from '@react-navigation/core';
/**
 * Экран регистрации. 
 * 
 * Варианты использования, ситуация проверяется наличием авторизованного пользователя в системе (!):
 * 1) Регистрация пользователя в системе (в целом);
 * 2) Регистрация опекаемого пользователя (переход из экрана Опекаемые пользователи). 
 * 
 * --ОПИСАНИЕ ЭКРАНА--
 * Пользователь вводит свои данные (username, email, password).
 * 
 * При нажатии на кнопку "Зарегистрироваться" приложение отправляет запрос на сервис с телом:
 * {username: <..>, email: <..>, password: <..>, isDependent: <..>}, 
 * 
 * Ожидаемый ответ ПРИ 1 ВАРИАНТЕ использования: 
 * 1. При успешном добавлении юзера - ответ вида {userId: <..>}
 * - вывод сообщения "<username>, Вы успешно зарегистрировались! Сейчас Вы будете авторизованы в системе." 
 * - приложение отправляет запрос на сервис на получение данных о пользователе с телом вида {userId: <..>},
 *   если userId пустой, то значит такой пользователь существует в системе, вывод ошибки с текстом "Такой пользователь уже существует".
 * 2. При неуспешном - ответ bad request и вывод ошибки с текстом "Что-то пошло не так".
 * 
 * Ожидаемый ответ ПРИ 2 ВАРИАНТЕ использования:
 1. При успешном добавлении юзера - ответ вида {userId: <..>}
 * - вывод сообщения "<username>, Вы успешно добавили опекаемого пользователя!" 
 * - приложение отправляет запрос на сервис на получение данных о пользователе с телом вида {userId: <..>},
 *   если 
 *   1) userId пустой - вывод ошибки с текстом "Такой пользователь уже существует".
 *   2) userId не пустой - отправка запроса на сервис на связывание пользователей с телом {currentUserId: <..>, spcOwnerUserId: <..>}
 * 2. При неуспешном - ответ bad request и вывод ошибки с текстом "Что-то пошло не так". 
 * 
 */

type RegistrationScreenNavigationProp = StackNavigationProp<AuthParamList, 'Registration'>;
type IProp = {
  route: RegistrationScreenNavigationProp;
};
export default function RegistrationScreen({ route: { params } }: IProp) {
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isValidEmail, setIsValidEmail] = useState<boolean>(false);
  const { getUser, setUser } = useContext(StorageContext);
  const navigation = useNavigation();

  const validate = (value: string) => {
    setEmail(value);
    setIsValidEmail(() => validateEmail(value));
  }

  function checkData() {
    isValidEmail
      ? (username.length > 0 && password.length > 5
        ? sendRegistrationRequest()
        : topDangerMessage('Пожалуйста, заполните текстовые поля')
      ) : topDangerMessage('Введен неверный электронный адрес')
  }

  async function sendRegistrationRequest() {
    await registration({ username: username, password: password, email: email, isDependent: params.isSpcOwned ?? false }).then((data) => {
      if (params.isSpcOwner) {
        var curUser = getUser();
        associateUsers({ caretakerId: curUser.id, spcOwnerId: data.id }).then((data) =>
          getUserFromApi(curUser.id).then(async data => {
            await saveUserInLocalStorage(data);
            setUser(() => data);
            topSuccessMessage(curUser.username + ', Вы успешно добавили опекаемого пользователя!');
            navigation.goBack();
          })
        )
      } else {
        topSuccessMessage(username + ', Вы успешно зарегистрировались! Сейчас Вы будете авторизованы в системе.');
        auth({ email: email, password: password }).then(async (data) => {
          if (!!data.error) {
            topDangerMessage(data.error);
          } else await saveUserInLocalStorage(data).then(() => setUser(() => data));
        })
      }
    })
  }

  useEffect(() => {
    console.log(params.isSpcOwner)
  }, [])

  return (
    <VisibleOnTapKeyboardView>
      <View style={styles.container}>
        <InfoText width={'70%'}>Для регистрации в системе заполните текстовые поля</InfoText>
        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            placeholder="Имя пользователя"
            placeholderTextColor={colorBlack}
            onChangeText={(val) => setUsername(val)}
          />
        </View>
        <View
          style={[styles.inputView,
          { backgroundColor: email.length > 0 ? (isValidEmail ? colorGreen : colorRed) : colorWhite }
          ]}
        >
          <TextInput
            style={styles.TextInput}
            placeholder="Email"
            placeholderTextColor={colorBlack}
            onChangeText={(val) => validate(val)}
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            placeholder="Пароль"
            placeholderTextColor={colorBlack}
            secureTextEntry={true}
            onChangeText={(val) => setPassword(val)}
          />
        </View>

        <TouchableOpacity style={styles.loginBtn} onPress={checkData}>
          <Text>{params.isSpcOwner ? 'Зарегистрировать пользователя' : 'Зарегистрироваться'}</Text>
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
