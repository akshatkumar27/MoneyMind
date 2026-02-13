import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthNavigator } from './AuthNavigator';
import { OnboardingNavigator } from './OnboardingNavigator';
import { MainTabNavigator } from './MainTabNavigator';

export type RootStackParamList = {
    Auth: undefined;
    Onboarding: undefined;
    Main: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

interface RootNavigatorProps {
    isLoggedIn?: boolean;
}

export const RootNavigator: React.FC<RootNavigatorProps> = ({ isLoggedIn = false }) => {
    return (
        <Stack.Navigator
            initialRouteName={isLoggedIn ? 'Main' : 'Auth'}
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="Auth" component={AuthNavigator} />
            <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
            <Stack.Screen name="Main" component={MainTabNavigator} />
        </Stack.Navigator>
    );
};
