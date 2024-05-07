import React, {useEffect, useState} from 'react';
import {
  GestureResponderEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {IAuthUserWithToken} from '../../../shared/interface/auth-user.interface.ts';
import CustomTextInputComponent from '../../auth/component/TextInput.tsx';
import CustomTouchableOpacityComponent from '../../auth/component/Button.tsx';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import {userRoutes} from '../api-route';
import {getFullName} from '../../../shared/utils/string.ts';

interface ISettingProps {
  navigation: any;
  authUser?: IAuthUserWithToken | null;
  dispatchToTriggerLogout: () => void;
}

export default function SettingScreen(props: ISettingProps) {
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fullName, setFullName] = useState('');

  const [toggleProfileTab, setToggleProfileTab] = useState(true);

  useEffect(() => {
    if (!props.authUser) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }

    return () => {
      setIsLoading(false);
    };
  }, [props.authUser]);

  useEffect(() => {
    if (props?.authUser) {
      axios({
        method: userRoutes.findById.method,
        url: userRoutes.findById.route(props?.authUser?.user?.id),
        headers: {
          Authorization: 'Bearer ' + props?.authUser?.accessToken,
        },
      })
        .then(({data}) => {
          setRole(data?.data?.role ?? '');
          setEmail(data?.data?.email ?? '');
          setFirstName(data?.data?.firstName ?? '');
          setMiddleName(data?.data?.middleName ?? '');
          setLastName(data?.data?.lastName ?? '');
          setPhone(data?.data?.phone ?? '');
          setFullName(() =>
            getFullName({
              firstName: data?.data?.firstName,
              lastName: data?.data?.lastName,
              middleName: data?.data?.middleName,
            }),
          );
        })
        .catch(error => console.log(error));
    }
  }, []);

  const handleUpdateUserProfile = async (event: GestureResponderEvent) => {
    event.preventDefault();

    setIsLoading(true);

    const prepareUpdateData = {
      ...(firstName?.length && {firstName: firstName}),
      ...(lastName?.length && {lastName: lastName}),
      ...(middleName?.length && {middleName: middleName}),
      ...(phone?.length && {phone: phone}),
    };

    try {
      const response = await axios({
        method: userRoutes.updateProfile.method,
        url: userRoutes.updateProfile.route,
        headers: {
          Authorization: 'Bearer ' + props?.authUser?.accessToken,
        },
        data: prepareUpdateData,
      });

      if (response?.data) {
        setFullName(() =>
          getFullName({
            firstName: response?.data?.data?.firstName,
            lastName: response?.data?.data?.lastName,
            middleName: response?.data?.data?.middleName,
          }),
        );
      }
    } catch (e) {
      console.log('[Update Profile]', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async (event: GestureResponderEvent) => {
    event.preventDefault();

    setIsLoading(true);

    const prepareUpdateData = {
      ...(oldPassword?.length && {password: oldPassword}),
      ...(password?.length && {newPassword: password}),
      ...(confirmPassword?.length && {confirmPassword: confirmPassword}),
    };

    try {
      const response = await axios({
        method: userRoutes.updatePassword.method,
        url: userRoutes.updatePassword.route,
        headers: {
          Authorization: 'Bearer ' + props?.authUser?.accessToken,
        },
        data: prepareUpdateData,
      });

      if (response?.data) {
        console.log('[Update Password]', response.data);
        props.dispatchToTriggerLogout();
      }
    } catch (e) {
      console.log('[Update Password]', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{}}>
      <View style={styles.profileInfo}>
        <View style={styles.profileLeftHeader}>
          <View style={styles.avatar} />
          <View style={styles.profileData}>
            <Text>{fullName}</Text>
            <Text>{email}</Text>
          </View>
        </View>

        <View>
          <Pressable onPress={() => props.dispatchToTriggerLogout()}>
            <MaterialIcons name={'logout'} size={40} color={'#ff6666'} />
          </Pressable>
        </View>
      </View>

      <View style={styles.profileTab}>
        <Pressable onPress={() => setToggleProfileTab(true)}>
          <Text
            style={[
              {fontSize: 15, marginRight: 20},
              toggleProfileTab && {
                borderBottomWidth: 2,
                borderBottomColor: '#570bce',
                paddingBottom: 10,
              },
            ]}>
            Profile
          </Text>
        </Pressable>

        <Pressable onPress={() => setToggleProfileTab(false)}>
          <Text
            style={[
              {fontSize: 15, marginRight: 20},
              !toggleProfileTab && {
                borderBottomWidth: 2,
                borderBottomColor: '#570bce',
                paddingBottom: 10,
              },
            ]}>
            Password
          </Text>
        </Pressable>
      </View>
      <View style={styles.horizontalLine} />

      {toggleProfileTab && (
        <View style={styles.profileView}>
          <View>
            <Text>FirstName*</Text>
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

          <View>
            <Text>MiddleName</Text>
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

          <View>
            <Text>LastName*</Text>
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

          <View>
            <Text>Email*</Text>
            <CustomTextInputComponent
              secureTextEntry={false}
              style={styles.profileTextInput}
              value={email}
              inputMode={'email'}
              placeholder={'Email'}
              autoFocus={false}
              keyboardType={'default'}
              editable={false}
              dispatch={text => setEmail(text)}
            />
          </View>

          <View>
            <Text>Phone</Text>
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

          <View>
            <Text>Role*</Text>
            <CustomTextInputComponent
              secureTextEntry={false}
              style={styles.profileTextInput}
              value={role}
              inputMode={'text'}
              placeholder={'Role'}
              autoFocus={false}
              keyboardType={'default'}
              editable={true}
              dispatch={text => setRole(text)}
            />
          </View>

          <CustomTouchableOpacityComponent
            style={styles.profileSubmitButton}
            textMessage={'Update Profile'}
            isLoading={isLoading}
            onSubmitHandler={handleUpdateUserProfile}
          />
        </View>
      )}

      {!toggleProfileTab && (
        <View style={styles.passwordView}>
          <View>
            <Text>Old Password</Text>
            <CustomTextInputComponent
              secureTextEntry={true}
              style={styles.profileTextInput}
              value={oldPassword}
              inputMode={'text'}
              placeholder={'Old Password'}
              autoFocus={false}
              keyboardType={'default'}
              editable={true}
              dispatch={text => setOldPassword(text)}
            />
          </View>

          <View>
            <Text>New Password</Text>
            <CustomTextInputComponent
              secureTextEntry={true}
              style={styles.profileTextInput}
              value={password}
              inputMode={'text'}
              placeholder={'New Password'}
              autoFocus={false}
              keyboardType={'default'}
              editable={true}
              dispatch={text => setPassword(text)}
            />
          </View>

          <View>
            <Text>Confirm Password</Text>
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

          <View>
            <Text>Password Requirement</Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginVertical: 10,
              }}>
              <AntDesign name={'checkcircle'} />
              <Text style={{paddingLeft: 10}}>
                Password must be at least 8 characters including at least one
                uppercase, special character i.e #@! and a number
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginVertical: 10,
              }}>
              <AntDesign name={'checkcircle'} />
              <Text style={{paddingLeft: 10}}>
                New Password and Confirm Password should match
              </Text>
            </View>
          </View>

          <CustomTouchableOpacityComponent
            style={styles.profileSubmitButton}
            textMessage={'Change Password'}
            isLoading={isLoading}
            onSubmitHandler={handleUpdatePassword}
          />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    top: 20,
    flex: 1,
    left: 20,
    width: '90%',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileLeftHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    height: 50,
    width: 50,
    backgroundColor: '#cbcbcc',
    borderRadius: 50,
  },
  profileData: {
    marginLeft: 10,
  },
  horizontalLine: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.47)',
    marginBottom: 20,
  },
  profileTab: {
    marginTop: 20,
    flexDirection: 'row',
    flex: 1,
    height: 30,
  },
  profileView: {},
  profileTextInput: {
    width: '100%',
    borderWidth: 1,
    marginTop: 10,
    marginBottom: 10,
    height: 40,
  },
  profileSubmitButton: {
    width: '100%',
    height: 40,
  },
  passwordView: {},
});
