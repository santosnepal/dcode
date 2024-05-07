import React, {useState} from 'react';
import {
  GestureResponderEvent,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import CustomTextInputComponent from '../../auth/component/TextInput.tsx';
import CustomTouchableOpacityComponent from '../../auth/component/Button.tsx';
import axios from 'axios';
import {classRoutes} from '../api-route';

interface IClassAddScreen {
  classes: any[];
  dispatchClasses: React.Dispatch<React.SetStateAction<any[]>>;
  accessToken: string;
  // dispatchFullName: React.Dispatch<React.SetStateAction<string>>;
  dispatchModelVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ClassAddScreen(props: IClassAddScreen) {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleClassAdd = async (event: GestureResponderEvent) => {
    event.preventDefault();
    setIsLoading(true);

    const addPayload = {
      ...(name?.length && {name}),
    };

    try {
      const response = await axios({
        url: classRoutes.create.route,
        method: classRoutes.create.method,
        data: addPayload,
        headers: {
          Authorization: 'Bearer ' + props?.accessToken,
        },
      });
      if (response?.data) {
        const addClass = [
          ...props.classes,
          {
            ...response?.data?.data,
          },
        ];

        props.dispatchClasses(() => [...addClass]);

        props.dispatchModelVisible(false);
      }
    } catch (e) {
      console.log('[Add Profile]', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView>
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
          textMessage={'Add Class'}
          isLoading={isLoading}
          onSubmitHandler={handleClassAdd}
        />
      </View>
    </ScrollView>
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
