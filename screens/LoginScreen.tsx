import React, { useContext, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View, VisibleOnTapKeyboardView } from '../components/Themed';
import { colorBlack, colorFiolet, colorGreen, colorRed, colorWhite } from "../constants/ColorVariables";
import { TextInput, TouchableOpacity } from "react-native";
import { StackNavigationProp } from '@react-navigation/stack';
import { LoginParamList } from '../types';
import InfoText from '../components/elements/text/InfoText';
import { topDangerMessage, topWarningMessage } from '../utils/message';
import { validateEmail } from '../utils/validation';
import { AuthContext } from '../context/Auth';
import { auth } from '../agent';
import { StorageContext } from '../context/Storage';
import { saveUserInLocalStorage } from '../utils/localStorage';

/**
 * Экран авторизации в приложении. 
 * 
 * -- ОПИСАНИЕ ЭКРАНА --
 * Пользователь вводит E-mail и пароль. 
 * 
 * При нажатии на кнопку "Войти" приложение отсылает запрос в API с телом:
 * {email: <..>, password: <..>}. 
 * Ожидаемый ответ: 
 * 1. Успешный - ответ вида {user: User} - пользователь переносится на главный экран HomeScreen;
 * 2. Неуспешный - bad request 400 - выводится ошибка с текстом "Данные введены неверно".
 * 
 * При нажатии на кнопку "Забыли пароль?" переход на экран восстановления пароля ForgetPasswordScreen.
 */

type LoginScreenNavigationProp = StackNavigationProp<LoginParamList, 'LoginScreen'>;
type IProp = {
  navigation: LoginScreenNavigationProp;
};
export default function LoginScreen({ navigation: { navigate } }: IProp) {
  const { signIn } = useContext(AuthContext);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isValidEmail, setIsValidEmail] = useState<boolean>(false);

  const validate = (value: string) => {
    setEmail(value);
    setIsValidEmail(() => validateEmail(value));
  }

  function checkData() {
    isValidEmail ? sendAuthRequest() : topDangerMessage('Введен неверный электронный адрес')
  }

  async function sendAuthRequest() {
    await auth({email: email, password: password}).then(async (data) => {
      if (!!data.error) {
        topDangerMessage(data.error);
      } else {
        saveUserInLocalStorage(data).then(() => signIn());
        
      }
    });
  }

  return (
    <VisibleOnTapKeyboardView>
      <View style={styles.container}>
        <InfoText width={'70%'}>Добро пожаловать в систему "Умная банка"</InfoText>
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
            keyboardType='email-address'
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
        <TouchableOpacity onPress={() => navigate('ForgetPasswordScreen')}>
          <Text style={styles.forgotBtn}>Забыли пароль?</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={checkData} style={styles.loginBtn} disabled={!(email.length > 0 && password.length > 0)}>
          <Text>Войти</Text>
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
  forgotBtn: {
    height: 30,
    marginBottom: 30,
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
