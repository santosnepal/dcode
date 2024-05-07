import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, GestureResponderEvent, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import CustomTextInputComponent from '../component/TextInput.tsx';
import CustomTouchableOpacityComponent from '../component/Button.tsx';
import { authRoutes } from '../api-route';
import asyncStorageHelper from '../../../shared/helpers/async-storage.helper.ts';
import PopupWithCloseIcon from '../../../shared/interface/Modal.tsx';

interface ILoginScreen {
  navigation: any;
}

export default function LoginScreen(props: ILoginScreen) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null | boolean>(null);
  const [isFormSubmitDisable, setIsFormSubmitDisable] = useState(true);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [popUpContent, setPopUpContent] = useState('');
  const [popUpMode, setPopUpMode] = useState(false);

  useEffect(() => {
    if (email.length && password.length) {
      setIsFormSubmitDisable(false);
    } else {
      setIsFormSubmitDisable(true);
    }
  }, [email, password]);

  const formSubmitHandler = async (event: GestureResponderEvent) => {
    event.preventDefault();

    setIsLoading(true);

    try {
      const response = (
        await axios.post(authRoutes.login.route, {
          email,
          password,
        })
      ).data;

      if (!response?.data?.accessToken || !response?.data?.user || !response?.data?.user?.id) {
        throw new Error('Unauthorized user');
      }

      const { accessToken, user } = response?.data;
      await asyncStorageHelper.storeData(JSON.stringify(user?.id), JSON.stringify({ accessToken, user }));

      props?.navigation?.replace('PrivateScreen', {
        userId: user?.id,
      });
    } catch (e) {
      setPopUpContent('Please Reverify your credential');
      setPopUpMode(true);
      togglePopup();
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        setError(false);
      }, 10000);
    }
  };
  const closeErrorPopup = () => {
    setError(null);
  };
  const togglePopup = () => {
    setPopupVisible(!isPopupVisible);
  };
  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {error && (
          <View style={styles?.forgotPassword}>
            <Text style={styles?.forgotPassword}>{error}</Text>
            <Pressable onPress={closeErrorPopup}>
              <Text style={styles.forgotPassword}>Close</Text>
            </Pressable>
          </View>
        )}
        <Image source={require('../../../../assets/login_image.png')} style={styles.loginImage} />
        <Text style={styles.loginText}>Login Screen</Text>

        <CustomTextInputComponent
          placeholder={'Email'}
          keyboardType={'default'}
          autoComplete={'email'}
          autoFocus={false}
          inputMode={'email'}
          value={email}
          secureTextEntry={false}
          dispatch={text => setEmail(text)}
        />

        <CustomTextInputComponent
          placeholder={'Password'}
          keyboardType={'default'}
          autoComplete={'password'}
          autoFocus={false}
          inputMode={'text'}
          value={password}
          dispatch={text => setPassword(text)}
          secureTextEntry={true}
        />

        <Pressable
          onPress={() => {
            props.navigation.push('ForgotPasswordScreen');
          }}>
          <Text style={styles.forgotPassword}>Forgot your password?</Text>
        </Pressable>
        <CustomTouchableOpacityComponent isDisable={isFormSubmitDisable} textMessage={'Login'} onSubmitHandler={formSubmitHandler} isLoading={isLoading} />
        <Text style={styles.footerText}>
          Don't have an account?{' '}
          <Pressable
            onPress={() => {
              props.navigation.push('SignupScreen');
            }}>
            <Text style={styles.signupText}>Sign up</Text>
          </Pressable>
        </Text>
      </ScrollView>
      <PopupWithCloseIcon isVisible={isPopupVisible} onClose={togglePopup} content={popUpContent} isError={popUpMode} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: '#f8f8f8',
  },
  loginText: {
    color: '#570bce',
    marginTop: 25,
    fontWeight: 'bold',
    fontSize: 25,
  },
  loginImage: {
    width: 200,
    height: 200,
  },
  forgotPassword: {
    color: '#b30fce',
    position: 'relative',
    marginLeft: '35%',
    fontSize: 15,
  },
  loginButton: {
    width: 300,
    backgroundColor: '#570bce',
    height: 50,
    marginTop: 20,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  footerText: {
    fontWeight: '400',
    color: '#000',
    fontSize: 15,
  },
  signupText: {
    color: '#570bce',
    fontWeight: '700',
  },
});
