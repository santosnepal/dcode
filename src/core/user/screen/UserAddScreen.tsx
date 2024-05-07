import React, { useState } from 'react';
import { GestureResponderEvent, ScrollView, StyleSheet, Text, View } from 'react-native';
import CustomTextInputComponent from '../../auth/component/TextInput.tsx';
import CustomTouchableOpacityComponent from '../../auth/component/Button.tsx';
import axios from 'axios';
import { userRoutes } from '../api-route';
import PopupWithCloseIcon from '../../../shared/interface/Modal.tsx';

interface IUserAddScreen {
  users: any[];
  email: string;
  dispatchUsers: React.Dispatch<React.SetStateAction<any[]>>;
  accessToken: string;
  // dispatchFullName: React.Dispatch<React.SetStateAction<string>>;
  dispatchModelVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function UserAddScreen(props: IUserAddScreen) {
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  // const [email, setEmail] = useState('');
  const [role, setRole] = useState('CHILD');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [popUpContent, setPopUpContent] = useState('');
  const [popUpMode, setPopUpMode] = useState(false);
  const [isPopupVisible, setPopupVisible] = useState(false);

  const handleUserProfileAdd = async (event: GestureResponderEvent) => {
    event.preventDefault();
    setIsLoading(true);

    const addPayload = {
      ...(firstName?.length && { firstName: firstName }),
      ...(lastName?.length && { lastName: lastName }),
      ...(middleName?.length && { middleName: middleName }),
      ...(phone?.length && { phone: phone }),
      // ...(email?.length && {email: email}),
      ...(password?.length && { password: password }),
      ...(confirmPassword?.length && { confirmPassword: confirmPassword }),
      ...(role?.length && { role }),
    };

    try {
      console.log(addPayload);
      console.log(props.accessToken);

      const response = await axios({
        url: userRoutes.create.route,
        method: userRoutes.create.method,
        data: addPayload,
        headers: {
          Authorization: 'Bearer ' + props?.accessToken,
        },
      });
      if (response?.data) {
        const addUser = [
          ...props.users,
          {
            ...response?.data?.data,
            middleName: response?.data?.data?.middleName ?? '',
          },
        ];

        props.dispatchUsers(() => [...addUser]);

        props.dispatchModelVisible(false);
        setPopUpContent('User Added Successfully');
        setPopUpMode(true);
        togglePopup();
      }
    } catch (e: any) {
      console.log('[Add Profile]', e);
      console.log(e.toString());

      setPopUpContent('Error in adding new user please try again');
      setPopUpMode(true);
      togglePopup();
    } finally {
      setIsLoading(false);
    }
  };
  const togglePopup = () => {
    setPopupVisible(!isPopupVisible);
  };
  return (
    <>
      <ScrollView>
        <View style={styles.profileTextView}>
          <Text style={styles.profileTextLabel}>FirstName*</Text>
          <CustomTextInputComponent
            secureTextEntry={false}
            style={styles.profileTextInput}
            value={firstName}
            inputMode={'text'}
            placeholder={'FirstName'}
            autoFocus={false}
            keyboardType={'default'}
            editable={true}
            dispatch={text => setFirstName(text)}
          />
        </View>

        <View style={styles.profileTextView}>
          <Text style={styles.profileTextLabel}>MiddleName</Text>
          <CustomTextInputComponent
            secureTextEntry={false}
            style={styles.profileTextInput}
            value={middleName}
            inputMode={'text'}
            placeholder={'MiddleName'}
            autoFocus={false}
            keyboardType={'default'}
            editable={true}
            dispatch={text => setMiddleName(text)}
          />
        </View>

        <View style={styles.profileTextView}>
          <Text style={styles.profileTextLabel}>LastName*</Text>
          <CustomTextInputComponent
            secureTextEntry={false}
            style={styles.profileTextInput}
            value={lastName}
            inputMode={'text'}
            placeholder={'LastName'}
            autoFocus={false}
            keyboardType={'default'}
            editable={true}
            dispatch={text => setLastName(text)}
          />
        </View>

        {/* <View style={styles.profileTextView}>
        <Text style={styles.profileTextLabel}>Email</Text>
        <CustomTextInputComponent
          secureTextEntry={false}
          style={styles.profileTextInput}
          value={email}
          inputMode={'text'}
          placeholder={'Email'}
          autoFocus={false}
          keyboardType={'default'}
          editable={true}
          dispatch={() => {}}
        />
      </View> */}

        <View style={styles.profileTextView}>
          <Text style={styles.profileTextLabel}>Phone</Text>
          <CustomTextInputComponent
            secureTextEntry={false}
            style={styles.profileTextInput}
            value={phone}
            inputMode={'text'}
            placeholder={'Phone'}
            autoFocus={false}
            keyboardType={'default'}
            editable={true}
            dispatch={text => setPhone(text)}
          />
        </View>

        <View style={styles.profileTextView}>
          <Text style={styles.profileTextLabel}>Role*</Text>
          <CustomTextInputComponent
            secureTextEntry={false}
            style={styles.profileTextInput}
            value={role}
            inputMode={'text'}
            placeholder={'Role'}
            autoFocus={false}
            keyboardType={'default'}
            editable={false}
            dispatch={text => setRole(text)}
          />
        </View>

        <View style={styles.profileTextView}>
          <Text style={styles.profileTextLabel}>Password*</Text>
          <CustomTextInputComponent
            secureTextEntry={true}
            style={styles.profileTextInput}
            value={password}
            inputMode={'text'}
            placeholder={'Password'}
            autoFocus={false}
            keyboardType={'default'}
            editable={true}
            dispatch={text => setPassword(text)}
          />
        </View>

        <View style={styles.profileTextView}>
          <Text style={styles.profileTextLabel}>Confirm Password*</Text>
          <CustomTextInputComponent
            secureTextEntry={true}
            style={styles.profileTextInput}
            value={confirmPassword}
            inputMode={'text'}
            placeholder={'Confirm Password'}
            autoFocus={false}
            keyboardType={'default'}
            editable={true}
            dispatch={text => setConfirmPassword(text)}
          />
        </View>

        <View style={[styles.profileTextView, { justifyContent: 'space-evenly' }]}>
          <CustomTouchableOpacityComponent
            style={styles.profileSubmitButton}
            textMessage={'Add User'}
            isLoading={isLoading}
            onSubmitHandler={handleUserProfileAdd}
          />
        </View>
      </ScrollView>
      <PopupWithCloseIcon isVisible={isPopupVisible} onClose={togglePopup} content={popUpContent} isError={popUpMode} />
    </>
  );
}

const styles = StyleSheet.create({
  profileTextInput: {
    width: '65%',
    borderWidth: 1,
    marginTop: 10,
    marginBottom: 10,
    height: 40,
  },
  profileTextView: { flexDirection: 'row', alignItems: 'center' },
  profileTextLabel: { width: 100 },
  profileSubmitButton: {
    width: '40%',
    height: 40,
  },
});
