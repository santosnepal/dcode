import { GestureResponderEvent, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import CustomTouchableOpacityComponent from '../../auth/component/Button.tsx';
import axios from 'axios';
import { userRoutes } from '../api-route';
import AntDesign from 'react-native-vector-icons/AntDesign';

interface ISignUpScreen {
  // signUpScreenCloseTriggerHandler: () => void;
  navigation: any;
  route: any;
}

export default function SignUpScreen(props: ISignUpScreen) {
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('');
  const [checked, setChecked] = React.useState(false);

  const [isFormSubmitDisable, setIsFormSubmitDisable] = useState(true);

  useEffect(() => {
    if (firstName.length && lastName.length && email.length && password.length && confirmPassword.length && role.length && checked) {
      setIsFormSubmitDisable(false);
    } else {
      setIsFormSubmitDisable(true);
    }
  }, [confirmPassword, email, firstName, lastName, password, role, checked]);

  const registerUserHandler = async (event: GestureResponderEvent) => {
    event.preventDefault();

    try {
      const response = (
        await axios({
          url: userRoutes.signup.route,
          method: userRoutes.signup.method,
          data: {
            firstName,
            middleName,
            lastName,
            email,
            phone,
            password,
            confirmPassword,
            role: 'PARENT',
          },
        })
      ).data;

      // await createUserWithEmailAndPassword(auth, email, password);

      if (!response) {
        throw new Error('Cannot create user');
      }

      // props.signUpScreenCloseTriggerHandler();
    } catch (e: any) {
      console.log(e.message);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}>
      <Image source={require('../../../../assets/login_image.png')} style={styles.signupImage} />
      <Text style={styles.signupText}>Create Account</Text>

      <TextInput
        style={[styles.textInput]}
        placeholder={'First Name'}
        keyboardType={'default'}
        autoFocus={true}
        inputMode={'text'}
        value={firstName}
        onChangeText={text => setFirstName(text)}
      />

      <TextInput
        style={[styles.textInput]}
        placeholder={'Middle Name'}
        keyboardType={'default'}
        autoFocus={false}
        inputMode={'text'}
        value={middleName}
        onChangeText={text => setMiddleName(text)}
      />

      <TextInput
        style={[styles.textInput]}
        placeholder={'Last Name'}
        keyboardType={'default'}
        autoFocus={false}
        inputMode={'text'}
        value={lastName}
        onChangeText={text => setLastName(text)}
      />

      <TextInput
        style={[styles.textInput]}
        placeholder={'Email'}
        keyboardType={'default'}
        autoComplete={'email'}
        autoFocus={false}
        inputMode={'email'}
        value={email}
        onChangeText={text => setEmail(text)}
      />

      <TextInput
        style={[styles.textInput]}
        placeholder={'Phone'}
        keyboardType={'numeric'}
        autoFocus={false}
        inputMode={'numeric'}
        value={phone}
        onChangeText={text => setPhone(text)}
      />

      <TextInput
        style={[styles.textInput]}
        placeholder={'Role'}
        keyboardType={'default'}
        inputMode={'text'}
        value={role}
        onChangeText={text => setRole(text)}
      />

      <TextInput
        style={[styles.textInput]}
        placeholder={'Password'}
        keyboardType={'default'}
        autoComplete={'password'}
        inputMode={'text'}
        value={password}
        onChangeText={text => setPassword(text)}
      />

      <TextInput
        style={[styles.textInput]}
        placeholder={'Confirm Password'}
        keyboardType={'default'}
        autoComplete={'password'}
        inputMode={'text'}
        value={confirmPassword}
        onChangeText={text => setConfirmPassword(text)}
      />

      <View style={styles.agreeContainer}>
        <Pressable
          onPress={event => {
            event.preventDefault();
            setChecked(!checked);
          }}>
          {checked ? (
            <AntDesign name={'checkcircleo'} size={20} style={{ marginHorizontal: 5 }} />
          ) : (
            <View
              style={{
                marginHorizontal: 5,
                height: 20,
                width: 20,
                borderWidth: 1,
                borderRadius: 50,
              }}
            />
          )}
        </Pressable>
        <Text style={styles.agreeText}>Agree with Terms & Conditions</Text>
      </View>

      <CustomTouchableOpacityComponent isDisable={isFormSubmitDisable} textMessage={'Register'} onSubmitHandler={registerUserHandler} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  arrow: {
    position: 'relative',
    top: 5,
    left: '-45%',
    fontSize: 24,
    color: 'black',
  },
  signupText: {
    color: '#570bce',
    marginTop: 25,
    fontWeight: 'bold',
    fontSize: 25,
  },
  signupImage: {
    width: 150,
    height: 150,
  },
  textInput: {
    borderBottomColor: '#cbcbcc',
    borderBottomWidth: 2,
    width: 300,
    paddingBottom: -10,
    paddingLeft: 10,
    marginTop: 5,
  },
  agreeContainer: {
    width: '75%',
    marginTop: 20,
    marginBottom: 10,
    display: 'flex',
    justifyContent: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
  },
  agreeText: {
    color: '#570bce',
  },
  registerButton: {
    width: 300,
    backgroundColor: '#570bce',
    height: 50,
    marginTop: 20,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  registerText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
