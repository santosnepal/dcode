import {
  GestureResponderEvent,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomTextInputComponent from '../component/TextInput.tsx';
import CustomTouchableOpacityComponent from '../component/Button.tsx';
import axios from 'axios';
import {authRoutes} from '../api-route';
import AntDesign from 'react-native-vector-icons/AntDesign';

interface IResetPassword {
  navigation: any;
  route: any;
  email: string;
}

export default function ResetPassword(props: IResetPassword) {
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isFormSubmitDisable, setIsFormSubmitDisable] = useState(true);

  useEffect(() => {
    if (otp.length && password.length && confirmPassword.length) {
      setIsFormSubmitDisable(false);
    } else {
      setIsFormSubmitDisable(true);
    }
  }, [otp, password, confirmPassword]);
  const formSubmitHandler = async (event: GestureResponderEvent) => {
    event.preventDefault();

    try {
      (
        await axios({
          method: authRoutes.forgotPassword.method,
          url: authRoutes.forgotPassword.route,
          data: {
            otp,
            email: props.email,
            password,
            confirmPassword,
          },
        })
      ).data;
      props.navigation('LoginScreen');
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{justifyContent: 'center', alignItems: 'center'}}>
      <Image
        source={require('../../../../assets/login_image.png')}
        style={styles.resetPasswordImage}
      />

      <Text style={styles.resetPasswordText}>Reset Password</Text>

      <CustomTextInputComponent
        placeholder={'Email'}
        keyboardType={'default'}
        autoComplete={'email'}
        autoFocus={false}
        inputMode={'email'}
        value={props.email}
        editable={false}
        secureTextEntry={false}
        dispatch={text => console.log(text)}
      />

      <CustomTextInputComponent
        placeholder={'Otp'}
        keyboardType={'default'}
        autoComplete={''}
        autoFocus={false}
        inputMode={'numeric'}
        value={otp}
        editable={true}
        secureTextEntry={false}
        dispatch={text => setOtp(text)}
      />

      <CustomTextInputComponent
        placeholder={'Password'}
        keyboardType={'default'}
        autoComplete={'text'}
        autoFocus={false}
        inputMode={'text'}
        value={password}
        secureTextEntry={true}
        dispatch={text => setPassword(text)}
      />

      <CustomTextInputComponent
        placeholder={'Confirm Password'}
        keyboardType={'default'}
        autoComplete={'text'}
        autoFocus={false}
        inputMode={'text'}
        value={confirmPassword}
        secureTextEntry={true}
        dispatch={text => setConfirmPassword(text)}
      />

      <CustomTouchableOpacityComponent
        isDisable={isFormSubmitDisable}
        onSubmitHandler={formSubmitHandler}
        textMessage={'Reset Password'}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    backgroundColor: '#f8f8f8',
  },
  arrow: {
    position: 'absolute',
    top: 10,
    left: '-45%',
    fontSize: 24,
    color: 'black',
  },
  resetPasswordText: {
    color: '#570bce',
    marginTop: 25,
    fontWeight: 'bold',
    fontSize: 25,
  },
  resetPasswordImage: {
    width: 200,
    height: 200,
  },
});
