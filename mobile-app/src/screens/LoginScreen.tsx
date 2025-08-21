import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('a@a.com');
  const [password, setPassword] = useState('secret12');
  const [err, setErr] = useState('');

  const onLogin = async () => {
    setErr('');
    try { await login(email, password); } 
    catch (e: any) { setErr(e?.response?.data?.message || 'Login failed'); }
  };

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: '600' }}>TellBoss Giriş</Text>
      <TextInput placeholder="Email" autoCapitalize="none" value={email} onChangeText={setEmail}
        style={{ borderWidth: 1, padding: 10, borderRadius: 8 }} />
      <TextInput placeholder="Şifre" secureTextEntry value={password} onChangeText={setPassword}
        style={{ borderWidth: 1, padding: 10, borderRadius: 8 }} />
      {!!err && <Text style={{ color: 'red' }}>{err}</Text>}
      <Button title="Giriş" onPress={onLogin} />
    </View>
  );
}
