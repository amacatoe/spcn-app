import { useNavigation } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { ScrollView, Text, View } from '../components/Themed';
import { colorBlack, colorFiolet, colorGreen, colorGrey, colorLightGrey, colorOrange, colorWhite } from '../constants/ColorVariables';
import { SpcOwnersParamList } from '../types';
import FlatList from 'flatlist-react';
import { User } from '../model/user';
import { StorageContext } from '../context/Storage';
import InfoText from '../components/elements/text/InfoText';
import Modal from 'react-native-modal';
import { AddSpcOwnerModal } from '../components/elements/modal/spcOwnerModal';
import { getUserFromApi } from '../agent';

/**
 * Экран опекаемых пользователей. 
 * Здесь выводится список опекаемых пользователей. На элементы списка можно нажать. 
 * При нажатии на элемент списка, пользователь переходит на экран опекаемого пользователя. 
 * При нажатии на кнопку "Добавить опекаемого", пользователь переходит на экран регистрации.  
 */

type SpcOwnersScreenNavigationProp = StackNavigationProp<SpcOwnersParamList, 'SpcOwnersScreen'>;
type IProp = {
  navigation: SpcOwnersScreenNavigationProp;
};

export default function SpcOwnersScreen({ navigation: { navigate } }: IProp) {
  const navigation = useNavigation();
  const { getUser, setUser } = React.useContext(StorageContext)
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [user, setInnerUser] = useState<User>(getUser());
  const [visible, setVisible] = useState<boolean>(false);

  const renderSpcOwners = (user: User) => (
    <View
      style={[styles.item, { backgroundColor: colorLightGrey }]}
      key={'spc-owners-' + user.id}
    >
      <TouchableOpacity onPress={() => navigation.navigate({
        name: 'SpcOwnerCoursesScreen',
        params: { userId: user.id, isFinalCourses: false },
      })}>
        <Text darkColor={colorBlack} lightColor={colorBlack}>{user.username}</Text>
      </TouchableOpacity>
    </View>
  );

  function registerSpcOwner() {
    setVisible(() => false);
    navigate({
      name: 'AddSpcOwnerScreen',
      params: { isSpcOwned: true }
    });
  }

  useEffect(() => {
    const rerender = navigation.addListener("focus", () => {
      getUserFromApi(getUser().id).then((data) => {
        setUser(User.mapToModel(data)).then(() => setInnerUser(User.mapToModel(data)));
      })
    })
    return rerender;
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.searchView}>
        <TextInput
          style={styles.search}
          placeholder={"Введите имя опекаемого..."}
          onChangeText={searchTerm => setSearchTerm(searchTerm)}
          placeholderTextColor={colorGrey}
        />
      </View>
      <ScrollView style={styles.scrollView}>
        <FlatList
          list={user.spcOwners}
          renderItem={renderSpcOwners}
          renderWhenEmpty={() => <Text style={styles.text}>Опекаемых пользователей нет</Text>}
          searchTerm={searchTerm}
          searchBy={'username'}
          searchMinCharactersCount={1}
        />
      </ScrollView>
      <TouchableOpacity onPress={() => setVisible(() => true)} style={styles.btn}>
        <Text style={styles.text}>Добавить опекаемого пользователя</Text>
      </TouchableOpacity>

      <AddSpcOwnerModal
        visible={visible}
        userId={user.id}
        hideFunc={() => setVisible(false)}
        registerNavigation={() => registerSpcOwner()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
  },
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
  btn: {
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    backgroundColor: colorFiolet,
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  text: {
    textAlign: 'center'
  },
  scrollView: {
    width: '90%',
    height: '65%',
    marginVertical: 15
  },
  searchView: {
    backgroundColor: colorWhite,
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: colorBlack,
    alignItems: 'center',
  },
  search: {
    color: colorBlack,
    fontSize: 17,
  },
  item: {
    padding: 10,
    marginVertical: 5,
  }
});

