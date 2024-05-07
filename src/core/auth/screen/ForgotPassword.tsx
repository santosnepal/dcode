import React, {useEffect, useState} from 'react';
import {
  GestureResponderEvent,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import CustomTextInputComponent from '../component/TextInput.tsx';
import CustomTouchableOpacityComponent from '../component/Button.tsx';
import axios from 'axios';
import {authRoutes} from '../api-route';
import AntDesign from 'react-native-vector-icons/AntDesign';
import PopupWithCloseIcon from '../../../shared/interface/Modal.tsx'


interface IForgotPassword {
  navigation: any;
  route: any;
  setResetPasswordEmail:  React.Dispatch<React.SetStateAction<string>>
}

export default function ForgotPassword(props: IForgotPassword) {
  const [email, setEmail] = useState('');

  const [isFormSubmitDisable, setIsFormSubmitDisable] = useState(true);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [popUpContent,setPopUpContent] = useState('')
  const [popUpMode,setPopUpMode] = useState(false)

  useEffect(() => {
    if (email.length) {
      setIsFormSubmitDisable(false);
    } else {
      setIsFormSubmitDisable(true);
    }
  }, [email]);
  const togglePopup =  () => {
    
    setPopupVisible(!isPopupVisible)
    
  };
  const formSubmitHandler = async (event: GestureResponderEvent) => {
    event.preventDefault();

    props.setResetPasswordEmail(email);

    try {
      (
        await axios({
          url: authRoutes.forgotPasswordOtpGeneration.route,
          method: authRoutes.forgotPasswordOtpGeneration.method,
          data: {
            email,
          },
        })
      ).data;

      props.setResetPasswordEmail(email);
      props.navigation.replace('ResetPasswordScreen');
    } catch (e) {
      setPopUpContent('An unexpected error occured')
      setPopUpMode(true);
      togglePopup();
      console.log(e);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../../../assets/login_image.png')}
        style={styles.forgotPasswordImage}
      />
      <Text style={styles.forgotPasswordText}>Forgot Password</Text>

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

      <Text>You will receive email with OTP to reset password</Text>

      <CustomTouchableOpacityComponent
        onSubmitHandler={formSubmitHandler}
        textMessage={'Forgot Password'}
        isDisable={isFormSubmitDisable}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
  },
  arrow: {
    position: 'absolute',
    top: -120,
    left: '-45%',
    fontSize: 24,
    color: 'black',
  },
  forgotPasswordText: {
    color: '#570bce',
    marginTop: 25,
    fontWeight: 'bold',
    fontSize: 25,
  },
  forgotPasswordImage: {
    width: 200,
    height: 200,
  },
});
