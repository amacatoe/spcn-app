import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ISpcUserMap } from "../../../../utils/spcFunct";
import Modal from 'react-native-modal';
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { colorBlack, colorGreen, colorGrey, colorWhite } from "../../../../constants/ColorVariables";
import RNPickerSelect from 'react-native-picker-select';
import { getAllUsers } from "../../../../utils/userFunc";
import { User } from "../../../../model/user";
import { StorageContext } from "../../../../context/Storage";
import { topDangerMessage, topWarningMessage } from "../../../../utils/message";
import { add } from "react-native-reanimated";
import { changeSpcOwner, isSpcOwned } from "../../../../agent";
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
  mapSpc?: ISpcUserMap;
  hideFunc: () => void;
  changeFunc: (userId: number, spc: string) => void;
  userId?: number;
}
export const SpcModal = (props: IProp) => {
  const [spc, setSpc] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<number | undefined>(props.userId);
  const { getUser } = useContext(StorageContext);
  const [user, setUser] = useState<User>(getUser())
  const [users, setUsers] = useState<User[]>(getAllUsers(getUser()))


  useEffect(() => {
    setUser(() => getUser())
    setUsers(() => getAllUsers(user))
    setSelectedUser(() => props.mapSpc?.userId)
  }, [props.mapSpc]);

  async function sendRequest() {
    if (!!selectedUser && spc.length > 0) {
      if (!!props.mapSpc) {
        await addRequest();
      } else {
        props.changeFunc(selectedUser, spc)
      }
    } else {
      topWarningMessage('Пожалуйста, введите необходимые данные.')
    }
  }

  async function addRequest() {
    await isSpcOwned(spc).then((data) => {
      if (data.isSpcOwned) {
        topWarningMessage('Дозатор уже используется.')
      } else {
        changeSpcOwner(spc, { userId: selectedUser! }).then((data) => {
          if (!!data.error) {
            topDangerMessage(data.error);
          }
        });
      }
    })
  }

  return (
    <Modal
      isVisible={props.visible}
      avoidKeyboard={true}
      onBackButtonPress={props.hideFunc}
      onBackdropPress={props.hideFunc}
    >
      <View style={styles.modalView}>
        {props.mapSpc === undefined && (
          <Text style={styles.text}>Включите дозатор, должен загореться зеленый светодиод. </Text>
        )}
        {!!props.mapSpc ? (
          <Text>{'Дозатор:  ' + props.mapSpc.spc}</Text>
        ) : (
          <View style={styles.inputView}>
            <TextInput
              style={styles.TextInput}
              placeholder="Введите серийный номер"
              placeholderTextColor={colorBlack}
              onChangeText={setSpc}
              keyboardType='default'
            />
          </View>
        )}

        {props.userId === undefined && (
          <View style={styles.selectView}>
            <Text>Владелец дозатора: </Text>
            <View style={styles.select}>
              <RNPickerSelect
                onValueChange={(value: number) => {
                  setSelectedUser(value);
                }}
                placeholder={{}}
                items={users.map((user) => (
                  { label: user.username, value: user.id }
                ))}
                value={selectedUser}
                itemKey={'select-spc-'}
              >
                <Text>{users.find(e => e.id === selectedUser)?.username ?? 'Выберите владельца дозатора'}</Text>
              </RNPickerSelect>
            </View>
          </View>
        )}

        <View style={styles.btnView}>
          <TouchableOpacity onPress={sendRequest} style={[styles.btn, styles.btnGreen]}>
            <Text>{!!props.mapSpc ? 'Применить' : 'Добавить'}</Text>
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
  btnGreen: {
    backgroundColor: colorGreen,
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