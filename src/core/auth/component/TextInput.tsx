import { InputModeOptions, KeyboardTypeOptions, StyleSheet, TextInput } from 'react-native';
import React from 'react';

export interface ICustomTextInputProps {
  placeholder: string;
  keyboardType: KeyboardTypeOptions;
  autoComplete?: string;
  autoFocus: boolean;
  inputMode: InputModeOptions;
  value: string;
  secureTextEntry: boolean;
  editable?: boolean;
  dispatch: React.Dispatch<React.SetStateAction<string>>;
  style?: any;
}

export default function CustomTextInputComponent(props: ICustomTextInputProps) {
  return (
    <TextInput
      style={[styles.textInput, props.style]}
      keyboardType={props.keyboardType}
      placeholder={props.placeholder}
      autoFocus={props.autoFocus}
      inputMode={props.inputMode}
      value={props.value}
      editable={props?.editable ?? true}
      secureTextEntry={props.secureTextEntry}
      onChangeText={text => props.dispatch(text)}
    />
  );
}

const styles = StyleSheet.create({
  textInput: {
    borderColor: '#cbcbcc',
    borderWidth: 2,
    borderRadius: 5,
    width: 300,
    marginTop: 20,
    marginBottom: 10,
    paddingLeft: 10,
  },
});
