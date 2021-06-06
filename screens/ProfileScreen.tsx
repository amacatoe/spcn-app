import { StackNavigationProp } from '@react-navigation/stack';
import * as React from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import InfoText from '../components/elements/text/InfoText';
import { View, Text } from '../components/Themed';
import { colorBlack, colorFiolet, colorGrey, colorLightBlack, colorLightGrey, colorOrange, colorRed } from '../constants/ColorVariables';
import { AuthContext } from '../context/Auth';
import { StorageContext } from '../context/Storage';
import { User } from '../model/user';
import { ProfileParamList } from '../types';
import { Entypo } from '@expo/vector-icons';
import { SetNameModal } from '../components/elements/modal/nameModal';
import { deleteAll } from '../utils/localStorage';
import { changeDependency, getCode } from '../agent';

/**
 * Экран личного кабинета. 
 * 
 * -- ОПИСАНИЕ ЭКРАНА --
 * Пользователь может просмотреть информацию о текущем аккаунте. А именно:
 * 1) привязанный email (скрытого вида e****@mail.ru)
 * 2) ???
 * 
 * При нажатии на кнопку "Изменить пароль", приложение отправляет запрос на сервис с телом {email: <..>}, 
 * ожидаемый ответ: 
 * 1. Успешный - ответ с телом {code: <..>} - переход на экран ChangePasswordScreen;
 * 2. Неуспешный - bad request 400 (не получилось отправить сообщение на электронный адрес) - 
 * вывод сообщения "Что-то пошло не так"
 * 
 * При нажатии на кнопку "Выйти из системы" - выход из системы и удаление информации о текущем пользователе из локального хранилища. 
 */
type ProfileScreenNavigationProp = StackNavigationProp<ProfileParamList, 'ProfileScreen'>;
type IProp = {
  navigation: ProfileScreenNavigationProp;
};

export default function ProfileScreen({ navigation: { navigate } }: IProp) {
  const { signOut } = React.useContext(AuthContext);
  const { getUser } = React.useContext(StorageContext);
  const [user] = React.useState<User>(getUser());
  const [visible, setVisible] = React.useState<boolean>(false);

  async function sendLogOutRequest() {
    await deleteAll().then(() => signOut());
  }

  async function sendChangePasswordRequest() {
    /* getCode({ email: user.email }).then((data) =>*/ navigate({
      name: 'ChangePasswordProfileScreen',
      params: { code: /*data.code*/ '1234', email: user.email },
    })/*)*/
  }

  async function sendChangeDependencyRequest() {
    changeDependency(user.id, { isDependent: !user.isDependent });
  }

  return (
    <View style={styles.container}>
      <View style={styles.textView}>
        <Text style={styles.text}>Текущий пользователь: </Text>
        <View style={styles.viewHigh}>
          <Text style={[styles.textHigh, styles.username]}>{user.username}</Text>
          <View style={styles.rowBtn}>
            <TouchableOpacity onPress={() => setVisible(true)}>
                <Entypo name="edit" size={20} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.textView}>
        <Text style={styles.text}>E-mail: </Text>
        <Text style={styles.textHigh}>{user.email}</Text>
      </View>
      {user.isDependent && (
        <View style={styles.warningView}>
          <Text style={styles.warningText}>
            На данный момент Вы являетесь опекаемым пользователем.
            Ваш опекун имеет доступ к вашим дозаторам, может создать Вам курс приемов лекарства.
            Хотите запретить данные привилегии опекуна?
            </Text>
          <TouchableOpacity onPress={sendChangeDependencyRequest} style={[styles.loginBtn, styles.warningBtn]}>
            <Text>Запретить доступ</Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.textView}>
        <TouchableOpacity onPress={sendChangePasswordRequest} style={styles.loginBtn}>
          <Text>Изменить пароль</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.textView}>
        <TouchableOpacity onPress={sendLogOutRequest} style={styles.loginBtn}>
          <Text>Выйти из системы</Text>
        </TouchableOpacity>
      </View>
      <SetNameModal
        visible={visible}
        hideFunc={() => setVisible(false)}
        userId={user.id}
        username={user.username}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  loginBtn: {
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    backgroundColor: colorFiolet,
    width: '100%'
  },
  textView: {
    width: '70%',
    marginBottom: 10,
  },
  text: {
    fontSize: 20,
    marginVertical: 10
  },
  textHigh: {
    padding: 10,
    backgroundColor: colorLightGrey,
    color: colorBlack,
    width: '100%'
  },
  warningView: {
    width: '70%',
    borderWidth: 1,
    borderColor: colorOrange,
    padding: 10,
    borderRadius: 20
  },
  warningText: {
    fontSize: 12,
    textAlign: 'center'
  },
  warningBtn: {
    backgroundColor: colorOrange,
  },
  viewHigh: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  rowBtn: {
    backgroundColor: colorLightGrey,
    width: '12%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5

  },
  username: {
    width: '88%'
  },
});
