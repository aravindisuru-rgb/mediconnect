import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';

import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import OnboardingScreen from '../screens/onboarding/OnboardingScreen';
import DoctorListScreen from '../screens/appointments/DoctorListScreen';
import BookAppointmentScreen from '../screens/appointments/BookAppointmentScreen';
import PharmacySelectionScreen from '../screens/pharmacy/PharmacySelectionScreen';
import MedicationListScreen from '../screens/medications/MedicationListScreen';
import VitalsStatusScreen from '../screens/vitals/VitalsStatusScreen';
import DocumentVaultScreen from '../screens/documents/DocumentVaultScreen';

const Stack = createStackNavigator();

function AppStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false, cardStyle: { backgroundColor: '#fff' } }}>
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
            <Stack.Screen name="DoctorList" component={DoctorListScreen} />
            <Stack.Screen name="BookAppointment" component={BookAppointmentScreen} />
            <Stack.Screen name="PharmacySelection" component={PharmacySelectionScreen} />
            <Stack.Screen name="MedicationList" component={MedicationListScreen} />
            <Stack.Screen name="VitalsStatus" component={VitalsStatusScreen} />
            <Stack.Screen name="DocumentVault" component={DocumentVaultScreen} />
        </Stack.Navigator>
    );
}

function AuthStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
    );
}

export default function RootNavigator() {
    const { token, isLoading } = useAuth();

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            {token ? <AppStack /> : <AuthStack />}
        </NavigationContainer>
    );
}
