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
import {classRoutes} from '../api-route';

interface IClassSpecificScreen {
  classId: string;
  classes: any[];
  dispatchClasses: React.Dispatch<React.SetStateAction<any[]>>;
  accessToken: string;
  dispatchModelVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ClassSpecificFetchScreen(props: IClassSpecificScreen) {
  const [isClassLoading, setIsClassLoading] = useState(false);
  const [name, setName] = useState('');
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  useEffect(() => {
    setIsClassLoading(true);
    if (props?.classId) {
      axios({
        url: classRoutes.findById.route(+props?.classId),
        method: classRoutes.findById.method,
        headers: {
          Authorization: 'Bearer ' + props?.accessToken,
        },
      })
        .then(({data}) => {
          setName(data?.data?.name ?? '');
        })

        .catch(e => console.log(e))
        .finally(() => setIsClassLoading(false));
    }
  }, [props?.accessToken, props?.classId]);

  const handleClassUpdate = async (event: GestureResponderEvent) => {
    event.preventDefault();
    setIsUpdateLoading(true);

    const prepareUpdateData = {
      ...(name?.length && {name}),
    };

    try {
      const response = await axios({
        method: classRoutes.updateById.method,
        url: classRoutes.updateById.route(+props.classId),
        headers: {
          Authorization: 'Bearer ' + props?.accessToken,
        },
        data: prepareUpdateData,
      });

      if (response?.data) {
        const updateUser = props.classes.map(_class => {
          if (_class?.id === response?.data?.data?.id) {
            return response?.data?.data;
          }

          return _class;
        });

        props.dispatchClasses(() => [...updateUser]);
      }
    } catch (e) {
      console.log('[Update Class]', e);
    } finally {
      setIsUpdateLoading(false);
    }
  };

  const handleClassDelete = async (event: GestureResponderEvent) => {
    event.preventDefault();
    setIsDeleteLoading(true);

    try {
      const response = await axios({
        method: classRoutes.deleteById.method,
        url: classRoutes.deleteById.route(+props.classId),
        headers: {
          Authorization: 'Bearer ' + props?.accessToken,
        },
      });

      if (response?.data) {
        const deleteUser = props.classes.filter(
          _class => _class?.id !== props.classId,
        );
        props.dispatchClasses(() => [...deleteUser]);
        props.dispatchModelVisible(false);
      }
    } catch (e) {
      console.log('[Delete User]', e);
    } finally {
      setIsDeleteLoading(false);
    }
  };

  if (isClassLoading) {
    return <ActivityIndicator animating={isClassLoading} size={'large'} />;
  }

  return (
    <View>
      <View style={styles.profileTextView}>
        <Text style={styles.profileTextLabel}>Name*</Text>
        <CustomTextInputComponent
          secureTextEntry={false}
          style={styles.profileTextInput}
          value={name}
          inputMode={'text'}
          placeholder={'Name'}
          autoFocus={false}
          keyboardType={'default'}
          editable={true}
          dispatch={text => setName(text)}
        />
      </View>

      <View style={[styles.profileTextView, {justifyContent: 'space-evenly'}]}>
        <CustomTouchableOpacityComponent
          style={styles.profileSubmitButton}
          textMessage={'Update'}
          isLoading={isUpdateLoading}
          onSubmitHandler={handleClassUpdate}
        />

        <CustomTouchableOpacityComponent
          style={[styles.profileSubmitButton, {backgroundColor: '#ff6666'}]}
          textMessage={'Delete'}
          isLoading={isDeleteLoading}
          onSubmitHandler={handleClassDelete}
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
