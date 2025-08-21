import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { api } from '../api/client';
import { useNavigation } from '@react-navigation/native';

type Dept = { id: string; name: string };

export default function ComplaintCreateScreen() {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [deptId, setDeptId] = useState('');
  const [depts, setDepts] = useState<Dept[]>([]);
  const nav = useNavigation<any>();

  useEffect(() => { (async () => {
    const { data } = await api.get<Dept[]>('/departments');
    setDepts(data);
    if (data[0]) setDeptId(data[0].id);
  })(); }, []);

  const submit = async () => {
    await api.post('/complaints', { title, description: desc, departmentId: deptId });
    nav.goBack();
  };

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: '600' }}>Yeni Şikayet</Text>
      <TextInput placeholder="Başlık" value={title} onChangeText={setTitle}
        style={{ borderWidth: 1, padding: 10, borderRadius: 8 }} />
      <TextInput placeholder="Açıklama" value={desc} onChangeText={setDesc} multiline
        style={{ borderWidth: 1, padding: 10, borderRadius: 8, height: 100 }} />
      <Text>Departman seç (geçici):</Text>
      {/* Çok basit seçim yöntemi: ilk departmanı kullanıyoruz; istersen Picker ekleyelim */}
      {depts.length ? <Text>{depts.find(d=>d.id===deptId)?.name}</Text> : <Text>Departman yok</Text>}
      <Button title="Kaydet" onPress={submit} />
    </View>
  );
}
