import React from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, Pressable, Image } from 'react-native';

const DATA = [
  { id: '1', name: 'Dra. Ana Silva', specialty: 'Psicologia', avatar: 'https://i.pravatar.cc/150?img=5' },
  { id: '2', name: 'Dr. Marcos Santos', specialty: 'Nutrição', avatar: 'https://i.pravatar.cc/150?img=11' },
];

export default function SearchScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buscar profissionais</Text>
      <TextInput style={styles.input} placeholder="Pesquisar por nome ou especialidade" />
      <FlatList
        data={DATA}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable style={styles.item} onPress={() => navigation.navigate('ProfessionalProfile', { medico: item })}>
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <View>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.specialty}>{item.specialty}</Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6', padding: 16 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  input: { backgroundColor: '#fff', padding: 12, borderRadius: 10, marginBottom: 12 },
  item: { flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: '#fff', borderRadius: 10, marginBottom: 8 },
  avatar: { width: 48, height: 48, borderRadius: 8, marginRight: 12 },
  name: { fontWeight: '700' },
  specialty: { color: '#6b7280' },
});
