import React, { useEffect, useState } from 'react';
import asyncStorageHelper from '../shared/helpers/async-storage.helper.ts';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AntDesign from 'react-native-vector-icons/AntDesign';
import UserManagementScreen from './user/screen/UserManagement.tsx';
import LocationManagementScreen from './location/screen/LocationManagement.tsx';
import ClassManagementScreen from './class/screen/ClassManagement.tsx';
import SettingScreen from './user/screen/Setting.tsx';
import { IAuthUserWithToken } from '../shared/interface/auth-user.interface.ts';
import ChatManagementScreen from './chat/screen/ChatManagement.tsx';
import NotificationManagementScreen from './notification/screen/NotificationManagement.tsx';

interface IPrivateScreenProps {
  navigation: any;
  route: any;
}

export default function PrivateScreen(props: IPrivateScreenProps) {
  const [chatReceiveEmail, setChatReceiveEmail] = useState('');

  const Tab = createBottomTabNavigator();

  const [authUserData, setAuthUserData] = useState<null | IAuthUserWithToken>(null);
  const [isLogoutTrigger, setIsLogoutTrigger] = useState(false);

  useEffect(() => {
    if (isLogoutTrigger) {
      props?.navigation?.replace('LoginScreen');
      asyncStorageHelper.removeValue(JSON.stringify(props?.route?.params?.userId)).then(() => console.log('Logged successfully'));
    }

    return () => {
      setIsLogoutTrigger(false);
    };
  }, [isLogoutTrigger]);

  useEffect(() => {
    if (!props?.route?.params?.userId) {
      props?.navigation?.replace('LoginScreen');
    }
    getUserAuthData().then(data => {
      setAuthUserData(() => JSON.parse(data as any) as any);
    });
  }, []);

  const getUserAuthData = async () => {
    const authData = await asyncStorageHelper.getData(JSON.stringify(props?.route?.params?.userId));

    if (!authData) {
      props?.navigation?.replace('LoginScreen');
    }

    return authData;
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, size, color }) => {
          let iconName = '';

          if (route.name === 'User' && authUserData?.user?.role !== 'CHILD') {
            iconName = 'user';
          }
          if (route.name === 'Location') {
            iconName = 'find';
          }
          if (route.name === 'Class') {
            iconName = 'layout';
          }
          if (route.name === 'Chat') {
            iconName = 'message1';
          }
          if (route.name === 'Notification') {
            iconName = 'notification';
          }
          if (route.name === 'Setting') {
            iconName = 'setting';
          }

          return <AntDesign name={iconName} size={size} color={color} />;
        },
        headerShown: false,
      })}>
      {authUserData?.user?.role !== 'CHILD' && (
        <Tab.Screen name="User">
          {_props => authUserData && <UserManagementScreen {..._props} authUser={authUserData} setChatReceiveEmail={setChatReceiveEmail} />}
        </Tab.Screen>
      )}
      <Tab.Screen name="Location">{_props => authUserData && <LocationManagementScreen {..._props} authUser={authUserData} />}</Tab.Screen>
      <Tab.Screen name="Chat">
        {_props => authUserData && <ChatManagementScreen {..._props} authUser={authUserData} chatReceiveEmail={chatReceiveEmail} />}
      </Tab.Screen>
      <Tab.Screen name="Class">{_props => authUserData && <ClassManagementScreen {..._props} authUser={authUserData} />}</Tab.Screen>
      <Tab.Screen name="Notification">{_props => authUserData && <NotificationManagementScreen {..._props} authUser={authUserData} />}</Tab.Screen>

      <Tab.Screen name="Setting">
        {_props => authUserData && <SettingScreen {..._props} authUser={authUserData} dispatchToTriggerLogout={() => setIsLogoutTrigger(true)} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
