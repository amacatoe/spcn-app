import { StackNavigationProp } from '@react-navigation/stack';
import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { View, Text, ScrollView } from '../components/Themed';
import { colorFiolet, colorGrey, colorLightBlack, colorRed, colorWhite } from '../constants/ColorVariables';
import { HomeParamList } from '../types';
import { Table, TableWrapper, Row, Cell } from 'react-native-table-component';
import { getMapSpc, ISpcUserMap, isSpcUse } from '../utils/spcFunct';
import { centerSuccessMessage, topDangerMessage } from '../utils/message';
import { Entypo, FontAwesome } from '@expo/vector-icons';
import { SpcModal } from '../components/elements/modal/addSpcModal';
import { StorageContext } from '../context/Storage';
import { User } from '../model/user';
import { changeSpcOwner, delSpcOwner } from '../agent';
import { ConfirmModal } from '../components/elements/modal/confirmModal';

/**
 * Экран дозаторов.
 * 
 * -- ОПИСАНИЕ ЭКРАНА --
 * Здесь отображается список дозаторов, которые прикреплены к данному пользователю и его опекаемым.
 * 1) При нажатии на иконку мусорки около серийника дозатора происходит удаление дозатора (отвязывание от всех пользователей),
 * приложение отправляет запрос на сервис с телом {spc: <..>}, ожидаемый ответ:
 * - 200 ОК - дозатор отвязался - пропадает из списка
 * - badrequest - дозатор не отвязался - вывод ошибки "Что-то пошло не так"
 * 2) При нажатии на иконку карандаш около серийника дозатора происходит редактирование текущего пользователя дозатора,
 * появляется список пользователей, галочкой отмечен текущий владелец, 
 * при выборе пользователя приложение отправляет запрос на сервис с телом {spc: <..>, userId: <..>}, ожидаемый ответ:
 * - 200 ОК - дозатор привязан к выбранному пользователю - обновление списка
 * - badrequest - привязка дозатора не обновлена - вывод ошибки "Что-то пошло не так"
 * 3) При нажатии на кнопку Добавить дозатор, открывается модальное окно добавления дозатора. 
 * 
 */
type SpcScreenNavigationProp = StackNavigationProp<HomeParamList, 'SpcScreen'>;
type IProp = {
  navigation: SpcScreenNavigationProp;
};
export default function SpcScreen({ navigation: { navigate } }: IProp) {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [changed, setChanged] = useState<boolean>(false);
  const [spc, setSpc] = useState<ISpcUserMap>();
  const { getUser } = useContext(StorageContext);
  const [user, setUser] = useState<User>(getUser());
  const [modalConfirmVisible, setModalConfirmVisible] = useState<boolean>(false);
  const [selectedSpc, setSelectedSpc] = useState<string>();

  useEffect(() => {
    setUser(() => getUser());
  }, []);

  function openModal(data?: ISpcUserMap) {
    setModalVisible(() => true);
    setSpc(() => data);
  }

  async function sendChangeSpcOwnerRequest(spc: string, userId: number) {
    //setChanged(true);
    changeSpcOwner(spc, { userId: userId }).then((data) => {
      if (!!data.error) {
        topDangerMessage(data.error);
      }
    });
  }

  async function sendDelSpcOwner(spc: string) {
    delSpcOwner(spc).then((data) => {
      if (!!data.error) {
        topDangerMessage(data.error);
      }
    });
    setModalConfirmVisible(false);
    setSelectedSpc(undefined);
  }

  function confirmDelSpc(spc: string) {
    setSelectedSpc(() => spc);
    setModalConfirmVisible(true);
  }

  const btn = (data: ISpcUserMap) => (
    !isSpcUse(data.spc, user) && (
      <View style={styles.rowBtnWrapper}>
        <TouchableOpacity onPress={() => openModal(data)}>
          <View style={styles.rowBtn}>
            <Entypo name="edit" size={20} color="black" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => confirmDelSpc(data.spc)}>
          <View style={[styles.rowBtn, styles.rowBtnRed]}>
            <FontAwesome name="trash" size={20} color="black" />
          </View>
        </TouchableOpacity>
      </View>
    )
  );

  function renderRows() {
    return (
      getMapSpc(user).map((rowData: ISpcUserMap, index: number) => (
        <TableWrapper key={'spc-tab-r-' + index} style={styles.row}>
          <Cell key={'spc-tab-r-' + index + '-c-1'} data={rowData.spc} textStyle={styles.text} />
          <Cell key={'spc-tab-r-' + index + '-c-2'} data={rowData.username} textStyle={styles.text} />
          <Cell key={'spc-tab-r-' + index + '-c-3'} data={btn(rowData)} textStyle={styles.text} />
        </TableWrapper>
      ))
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        {
          changed ? (<ActivityIndicator />) : (
            <View style={styles.innerWrapper}>
              <Table borderStyle={{ borderColor: 'transparent' }}>
                <Row data={['Дозатор', 'Владелец', '']} style={styles.head} textStyle={styles.text} />
              </Table>
              <ScrollView style={styles.scrollWrapper}>
                <Table borderStyle={{ borderColor: 'transparent' }}>
                  {renderRows()}
                </Table>
              </ScrollView>
            </View>
          )
        }
      </View>
      <TouchableOpacity style={styles.btn} onPress={() => openModal()}>
        <Text>Добавить дозатор</Text>
      </TouchableOpacity>
      <SpcModal
        visible={modalVisible}
        hideFunc={() => setModalVisible(false)}
        changeFunc={(userId: number, spc: string) => sendChangeSpcOwnerRequest(spc, userId)}
        mapSpc={spc}
      />
      <ConfirmModal
        visible={modalConfirmVisible}
        hideFunc={() => setModalConfirmVisible(false)}
        changeFunc={sendDelSpcOwner(selectedSpc!)}
        deleteItem={'дозатор'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 40,
    width: '100%'
  },
  wrapper: {
    width: '100%',
    height: '70%'
  },
  innerWrapper: {
    margin: 0
  },
  btn: {
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    backgroundColor: colorFiolet,
    paddingHorizontal: 20,
  },
  rowBtnWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    backgroundColor: colorWhite,
  },
  rowBtn: {
    padding: 10,
    backgroundColor: colorGrey,
    borderRadius: 25,
    width: 40,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowBtnRed: {
    backgroundColor: colorRed,
  },
  head: {
    padding: 10,
    backgroundColor: colorFiolet,
  },
  row: {
    flexDirection: 'row',
    padding: 10,
  },
  scrollWrapper: {
    backgroundColor: colorWhite,
    paddingBottom: 10
  },
  text: {

  },
});
