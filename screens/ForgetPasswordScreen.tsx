import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View, VisibleOnTapKeyboardView } from '../components/Themed';
import { colorBlack, colorFiolet, colorGreen, colorRed, colorWhite } from "../constants/ColorVariables";
import { TextInput, TouchableOpacity } from "react-native";
import InfoText from '../components/elements/text/InfoText';
import { validateEmail } from '../utils/validation';
import { topDangerMessage } from '../utils/message';
import { StackNavigationProp } from '@react-navigation/stack';
import { LoginParamList } from '../types';
import { getCode } from '../agent';

/**
 * Экран восстановления пароля. 
 * 
 * -- ОПИСАНИЕ ЭКРАНА --
 * Пользователь вводит Email.
 * 
 * При нажатии на кнопку "Восстановить пароль" приложение отсылает запрос в API с телом:
 * {email: <..>}
 * Ожидаемый ответ:
 * 1. Успешный - ответ с телом {code: <..>} - переход на экран ChangePasswordScreen;
 * 2. Неуспешный - bad request 400 (не получилось отправить сообщение на электронный адрес/не нашлось такого email в бд) - 
 * вывод ошибки с текстом "Произошло что-то не так/Такого пользователя не существует"
 */
type ForgetPasswordScreenNavigationProp = StackNavigationProp<LoginParamList, 'ForgetPasswordScreen'>;
type IProp = {
  navigation: ForgetPasswordScreenNavigationProp;
};
export default function ForgetPasswordScreen({ navigation: { navigate } }: IProp) {
  const [email, setEmail] = useState<string>('');
  const [isValid, setIsValid] = useState<boolean>(false);

  const validate = (value: string) => {
    setEmail(value);
    setIsValid(() => validateEmail(value));
  }

  async function navigateToScreen() {
    if (isValid) {
      // getCode({email: email}).then((data) => {
      navigate({
        name: 'ChangePasswordScreen',
        params: { email: email, code: /*data.code*/ '1234' },
      })
      // })
    } else topDangerMessage('Введен неверный электронный адрес')
  }

  return (
    <VisibleOnTapKeyboardView>
      <View style={styles.container}>
        <InfoText width={'70%'}>Для восстановления пароля, пожалуйста, введите свой электронный адрес</InfoText>
        <View style={[styles.inputView, { backgroundColor: email.length > 0 ? (isValid ? colorGreen : colorRed) : colorWhite }]}>
          <TextInput
            style={[styles.TextInput]}
            placeholder="Email"
            placeholderTextColor={colorBlack}
            onChangeText={(val) => validate(val)}
            keyboardType='email-address'
          />
        </View>
        {/* TODO: рассмотреть ситуации с API */}
        <TouchableOpacity
          style={styles.loginBtn}
          onPress={navigateToScreen}
          disabled={email.length <= 0}
        >
          <Text>Восстановить пароль</Text>
        </TouchableOpacity>
      </View>
    </VisibleOnTapKeyboardView>
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
