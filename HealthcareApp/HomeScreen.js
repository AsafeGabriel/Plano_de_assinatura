import React from 'react';
import { ScrollView, View, Text, StyleSheet, Image, Pressable } from 'react-native';

const profissionais = [
  { id: 1, nome: 'Dra. Ana Silva', especialidade: 'Psicologia', imagem: 'https://i.pravatar.cc/150?img=5' },
  { id: 2, nome: 'Dr. Marcos Santos', especialidade: 'Nutrição', imagem: 'https://i.pravatar.cc/150?img=11' },
  { id: 3, nome: 'Prof. João Costa', especialidade: 'Educação Física', imagem: 'https://i.pravatar.cc/150?img=12' },
];

export default function HomeScreen({ navigation }) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.title}>Profissionais em destaque</Text>
      {profissionais.map((p) => (
        <Pressable key={p.id} style={styles.card} onPress={() => navigation.navigate('ProfessionalProfile', { medico: p })}>
          <Image source={{ uri: p.imagem }} style={styles.avatar} />
          <View style={styles.info}>
            <Text style={styles.name}>{p.nome}</Text>
            <Text style={styles.specialty}>{p.especialidade}</Text>
          </View>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 12, color: '#0f172a', paddingHorizontal: 4 },
  card: { flexDirection: 'row', backgroundColor: '#fff', padding: 12, borderRadius: 12, marginBottom: 10, alignItems: 'center' },
  avatar: { width: 64, height: 64, borderRadius: 12, marginRight: 12, backgroundColor: '#e5e7eb' },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: '700', color: '#0f172a' },
  specialty: { fontSize: 14, color: '#6b7280' },
});
