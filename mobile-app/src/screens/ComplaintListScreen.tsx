import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity } from 'react-native';
import { api } from '../api/client';
import { useNavigation } from '@react-navigation/native';

type Dept = { id: string; name: string };
type Complaint = {
  id: string; title: string; description: string;
  status: 'OPEN'|'IN_PROGRESS'|'RESOLVED';
  department?: Dept;
};

export default function ComplaintListScreen() {
  const [items, setItems] = useState<Complaint[]>([]);
  const nav = useNavigation<any>();

  const load = async () => {
    const { data } = await api.get<Complaint[]>('/complaints');
    setItems(data);
  };
  useEffect(() => { const unsub = nav.addListener('focus', load); return unsub; }, [nav]);

  return (
    <View style={{ flex: 1, padding: 12 }}>
      <Button title="Yeni Şikayet" onPress={() => nav.navigate('CreateComplaint')} />
      <FlatList
        data={items}
        keyExtractor={(it) => it.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => nav.navigate('ComplaintDetail', { id: item.id })}>
            <View style={{ paddingVertical: 10 }}>
              <Text style={{ fontWeight: '600' }}>{item.title}  •  {item.status}</Text>
              <Text>{item.department?.name}</Text>
            </View>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: '#eee' }} />}
      />
    </View>
  );
}
