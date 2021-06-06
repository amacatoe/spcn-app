import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '../../Themed';

type IProp = {
  colorDark?: string,
  colorLight?: string;
  width?: string | number;
  textSize?: number;
  children?: any;
};

export default function InfoText(props: IProp) {

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      marginHorizontal: 50,
      marginVertical: 30,
      width: props.width ?? '90%'
    },
    text: {
      fontSize: props.textSize ?? 17,
      lineHeight: 30,
      textAlign: 'center',
    },
  });

  return (
    <View style={styles.container}>
      <Text
        style={styles.text}
        lightColor={props.colorLight ?? "rgba(0,0,0,0.8)"}
        darkColor={props.colorDark ?? "rgba(255,255,255,0.8)"}
        {...props}
      />
    </View>
  );
}
