import React, { useEffect, useState } from 'react';
import { View, Text, Button, TextInput } from 'react-native';
import { api } from '../api/client';

type Complaint = {
  id: string; title: string; description: string;
  status: 'OPEN'|'IN_PROGRESS'|'RESOLVED';
  attachments?: { id: string; url: string; type: string }[];
};

export default function ComplaintDetailScreen({ route }: any) {
  const id = route.params.id as string;
  const [c, setC] = useState<Complaint | null>(null);
  const [url, setUrl] = useState('');

  const load = async () => {
    const { data } = await api.get<Complaint>(`/complaints/${id}`);
    setC(data);
  };
  useEffect(() => { load(); }, [id]);

  const addAttachment = async () => {
    await api.post(`/complaints/${id}/attachments`, { url, type: 'image/jpeg' });
    setUrl('');
    load();
  };

  const markInProgress = async () => { await api.patch(`/complaints/${id}/status`, { status: 'IN_PROGRESS' }); load(); };
  const markResolved   = async () => { await api.patch(`/complaints/${id}/status`, { status: 'RESOLVED' }); load(); };

  if (!c) return <Text>Yükleniyor...</Text>;
  return (
    <View style={{ padding: 16, gap: 10 }}>
      <Text style={{ fontSize: 20, fontWeight: '700' }}>{c.title}</Text>
      <Text>{c.description}</Text>
      <Text>Durum: {c.status}</Text>

      <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
        <Button title="IN_PROGRESS" onPress={markInProgress} />
        <Button title="RESOLVED" onPress={markResolved} />
      </View>

      <View style={{ marginTop: 16 }}>
        <Text>Ek (URL):</Text>
        <TextInput placeholder="https://..." value={url} onChangeText={setUrl}
          style={{ borderWidth: 1, padding: 10, borderRadius: 8 }} />
        <Button title="Ekle" onPress={addAttachment} />
      </View>

      <View style={{ marginTop: 16 }}>
        <Text style={{ fontWeight: '600' }}>Ekler</Text>
        {c.attachments?.map(a => <Text key={a.id}>{a.url}</Text>)}
      </View>
    </View>
  );
}
