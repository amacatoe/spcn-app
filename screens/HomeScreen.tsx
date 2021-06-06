import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import NearestCourses from '../components/elements/course/nearestCourses';
import { Text, View } from '../components/Themed';
import { colorFiolet } from '../constants/ColorVariables';
import { HomeParamList } from '../types';

/**
 * Главный экран. 
 * 
 * -- ОПИСАНИЕ ЭКРАНА --
 * Здесь отображается список ближайших приемов лекарств на сегодня. На каждый элемент списка можно нажать. 
 * 
 * При нажатии на элемент списка, пользователь переходит на экран курса. 
 * 
 * При нажатии на кнопку "Мои дозаторы", пользователь переходит на экран дозаторов. 
 */
type HomeScreenNavigationProp = StackNavigationProp<HomeParamList, 'HomeScreen'>;
type IProp = {
  navigation: HomeScreenNavigationProp;
};
export default function HomeScreen({ navigation: { navigate } }: IProp) {
  React.useEffect(() => {
  }, [])

  return (
    <View style={styles.container}>
      <NearestCourses />
      <TouchableOpacity onPress={() => navigate('SpcScreen')} style={styles.btn}>
        <Text>Мои дозаторы</Text>
      </TouchableOpacity>
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
  btn: {
    borderRadius: 25,
    minHeight: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    backgroundColor: colorFiolet,
    paddingHorizontal: 20,
    maxWidth: '75%'
  },
});
