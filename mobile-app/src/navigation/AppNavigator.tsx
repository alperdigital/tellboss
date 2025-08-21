import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import ComplaintListScreen from '../screens/ComplaintListScreen';
import ComplaintCreateScreen from '../screens/ComplaintCreateScreen';
import ComplaintDetailScreen from '../screens/ComplaintDetailScreen';
import { useAuth } from '../context/AuthContext';
import { Button } from 'react-native';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { user, logout } = useAuth();
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!user ? (
          <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Giriş' }} />
        ) : (
          <>
            <Stack.Screen
              name="Complaints"
              component={ComplaintListScreen}
              options={{ title: 'Şikayetler', headerRight: () => <Button title="Çıkış" onPress={logout} /> }}
            />
            <Stack.Screen name="CreateComplaint" component={ComplaintCreateScreen} options={{ title: 'Yeni Şikayet' }} />
            <Stack.Screen name="ComplaintDetail" component={ComplaintDetailScreen} options={{ title: 'Detay' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
