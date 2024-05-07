import {
  ActivityIndicator,
  GestureResponderEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import React from 'react';

export interface ICustomTouchableOpacityProps {
  textMessage: string;
  isDisable?: boolean;
  onSubmitHandler: (event: GestureResponderEvent) => void;
  isLoading?: boolean;
  style?: any
}
export default function CustomTouchableOpacityComponent(
  props: ICustomTouchableOpacityProps,
) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        {backgroundColor: props?.isLoading ? '#8654d6' : '#570bce'},
        props.style
      ]}
      disabled={props?.isDisable ?? false}
      onPress={props.onSubmitHandler}>
      <Text style={styles.text}>{props.textMessage}</Text>
      <ActivityIndicator
        animating={props?.isLoading ?? false}
        color={'#570bce'}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 300,
    // backgroundColor: '#570bce',
    height: 50,
    marginTop: 20,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    flexDirection: 'row',
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
