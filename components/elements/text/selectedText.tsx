import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '../../Themed';

interface IProp {
  higlightDarkColor?: string;
  higlightLightColor?: string;
}

export default function SelectedText(props: IProp) {
  return (
    <View
      style={[styles.codeHighlightContainer, styles.homeScreenFilename]}
      darkColor={props.higlightDarkColor ?? "rgba(255,255,255,0.05)"}
      lightColor={props.higlightLightColor ?? "rgba(0,0,0,0.05)"}>
      <Text style={styles.monoText}>{props.children}</Text>;
    </View>
  );
}

const styles = StyleSheet.create({
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightContainer: {
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  monoText: {
    fontFamily: 'space-mono'
  }
});
