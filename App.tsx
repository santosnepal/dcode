/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import PrivateScreen from './src/core/PrivateScreen.tsx';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import SignUpScreen from './src/core/user/screen/SignUp.tsx';
import ForgotPassword from './src/core/auth/screen/ForgotPassword.tsx';
import LoginScreen from './src/core/auth/screen/Login.tsx';
import ResetPassword from './src/core/auth/screen/ResetPassword.tsx';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  const [resetPasswordEmail, setResetPasswordEmail] = useState('');

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName="LoginScreen">
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="PrivateScreen" component={PrivateScreen} />
        <Stack.Screen name="SignupScreen">
          {props => <SignUpScreen {...props} />}
        </Stack.Screen>
        <Stack.Screen name="ForgotPasswordScreen">
          {props => <ForgotPassword {...props} setResetPasswordEmail={setResetPasswordEmail} />}
        </Stack.Screen>

        <Stack.Screen name={'ResetPasswordScreen'}>
          {props => <ResetPassword {...props}  email={resetPasswordEmail} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
