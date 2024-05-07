import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  GestureResponderEvent,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import CustomTextInputComponent from '../../auth/component/TextInput.tsx';
import CustomTouchableOpacityComponent from '../../auth/component/Button.tsx';
import axios from 'axios';
import {userRoutes} from '../api-route';
import {getFullName} from '../../../shared/utils/string.ts';

interface IUserSpecificScreen {
  userId: string;
  users: any[];
  dispatchUsers: React.Dispatch<React.SetStateAction<any[]>>;
  accessToken: string;
  dispatchFullName: React.Dispatch<React.SetStateAction<string>>;
  dispatchModelVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function UserSpecificFetchScreen(props: IUserSpecificScreen) {
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [ancestorId, SetAncestorId] = useState<number>(0);
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(false);

  useEffect(() => {
    setIsProfileLoading(true);
    if (props?.userId) {
      axios({
        url: userRoutes.findById.route(+props?.userId),
        method: userRoutes.findById.method,
        headers: {
          Authorization: 'Bearer ' + props?.accessToken,
        },
      })
        .then(({data}) => {
          setRole(data?.data?.role ?? '');
          setEmail(data?.data?.email ?? '');
          setFirstName(data?.data?.firstName ?? '');
          setMiddleName(data?.data?.middleName ?? '');
          setLastName(data?.data?.lastName ?? '');
          setPhone(data?.data?.phone ?? '');
          props.dispatchFullName(() =>
            getFullName({
              firstName: data?.data?.firstName,
              lastName: data?.data?.lastName,
              middleName: data?.data?.middleName,
            }),
          );
        })

        .catch(e => console.log(e))
        .finally(() => setIsProfileLoading(false));
    }
  }, [props?.accessToken, props?.userId]);

  const handleUserProfileUpdate = async (event: GestureResponderEvent) => {
    event.preventDefault();
    setIsUpdateLoading(true);

    const prepareUpdateData = {
      ...(firstName?.length && {firstName: firstName}),
      ...(lastName?.length && {lastName: lastName}),
      ...(middleName?.length && {middleName: middleName}),
      ...(phone?.length && {phone: phone}),
    };

    try {
      const response = await axios({
        method: userRoutes.updateById.method,
        url: userRoutes.updateById.route(+props.userId),
        headers: {
          Authorization: 'Bearer ' + props?.accessToken,
        },
        data: prepareUpdateData,
      });

      if (response?.data) {
        props.dispatchFullName(() =>
          getFullName({
            firstName: response?.data?.data?.firstName,
            lastName: response?.data?.data?.lastName,
            middleName: response?.data?.data?.middleName,
          }),
        );

        const updateUser = props.users.map(user => {
          if (user?.id === response?.data?.data?.id) {
            return response?.data?.data;
          }

          return user;
        });

        props.dispatchUsers(() => [...updateUser]);
      }
    } catch (e) {
      console.log('[Update Profile]', e);
    } finally {
      setIsUpdateLoading(false);
    }
  };

  const handleUserProfileDelete = async (event: GestureResponderEvent) => {
    event.preventDefault();
    setIsDeleteLoading(true);

    try {
      const response = await axios({
        method: userRoutes.deleteById.method,
        url: userRoutes.deleteById.route(+props.userId),
        headers: {
          Authorization: 'Bearer ' + props?.accessToken,
        },
      });

      if (response?.data) {
        const deleteUser = props.users.filter(
          user => user?.id !== props.userId,
        );
        props.dispatchUsers(() => [...deleteUser]);
        props.dispatchModelVisible(false);
      }
    } catch (e) {
      console.log('[Delete Profile]', e);
    } finally {
      setIsDeleteLoading(false);
    }
  };

  if (isProfileLoading) {
    return <ActivityIndicator animating={isProfileLoading} size={'large'} />;
  }

  return (
    <View>
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

      <View style={styles.profileTextView}>
        <Text style={styles.profileTextLabel}>Email*</Text>
        <CustomTextInputComponent
          secureTextEntry={false}
          style={styles.profileTextInput}
          value={email}
          inputMode={'text'}
          placeholder={'Email'}
          autoFocus={false}
          keyboardType={'default'}
          editable={false}
          dispatch={text => setEmail(text)}
        />
      </View>

      <View style={styles.profileTextView}>
        <Text style={styles.profileTextLabel}>Phone*</Text>
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
          editable={true}
          dispatch={text => setRole(text)}
        />
      </View>

      {/*<View style={styles.profileTextView}>*/}
      {/*  <Text style={styles.profileTextLabel}>Ancestor*</Text>*/}
      {/*  <CustomTextInputComponent*/}
      {/*    secureTextEntry={false}*/}
      {/*    style={styles.profileTextInput}*/}
      {/*    value={ancestorId.toString()}*/}
      {/*    inputMode={'numeric'}*/}
      {/*    placeholder={'Ancestor'}*/}
      {/*    autoFocus={false}*/}
      {/*    keyboardType={'default'}*/}
      {/*    editable={true}*/}
      {/*    dispatch={text => SetAncestorId(text as any)}*/}
      {/*  />*/}
      {/*</View>*/}

      <View style={[styles.profileTextView, {justifyContent: 'space-evenly'}]}>
        <CustomTouchableOpacityComponent
          style={styles.profileSubmitButton}
          textMessage={'Update'}
          isLoading={isUpdateLoading}
          onSubmitHandler={handleUserProfileUpdate}
        />

        <CustomTouchableOpacityComponent
          style={[styles.profileSubmitButton, {backgroundColor: '#ff6666'}]}
          textMessage={'Delete'}
          isLoading={isDeleteLoading}
          onSubmitHandler={handleUserProfileDelete}
        />
      </View>
    </View>
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
  profileTextView: {flexDirection: 'row', alignItems: 'center'},
  profileTextLabel: {width: 100},
  profileSubmitButton: {
    width: '40%',
    height: 40,
  },
});
