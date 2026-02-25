import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {LoginScreen} from '../screens/auth/LoginScreen';
import {SignupScreen} from '../screens/auth/SignupScreen';
import {OTPVerificationScreen} from '../screens/auth/OTPVerificationScreen';
import { useThemeColors } from "../context/ThemeContext";

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  OTPVerification: {
    email: string;
    otpToken: string;
    isSignupFlow?: boolean;
    signupData?: {
      name: string;
      age: string;
    };
  };
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator: React.FC = () => {
    const colors = useThemeColors();
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
        contentStyle: {backgroundColor: colors.background},
        animation: 'slide_from_right',
      }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
    </Stack.Navigator>
  );
};
