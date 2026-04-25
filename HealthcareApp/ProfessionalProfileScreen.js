import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function ProfessionalProfileScreen({ route }) {
  const medico = route.params?.medico || { nome: 'Dra. Ana', especialidade: 'Psicologia', imagem: 'https://i.pravatar.cc/150?img=5' };

  return (
    <View style={styles.container}>
      <Image source={{ uri: medico.imagem }} style={styles.avatar} />
      <Text style={styles.name}>{medico.nome}</Text>
      <Text style={styles.specialty}>{medico.especialidade}</Text>
      <Text style={styles.description}>Perfil do profissional e serviços oferecidos.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', padding: 20, backgroundColor: '#f3f4f6' },
  avatar: { width: 120, height: 120, borderRadius: 16, marginBottom: 12, backgroundColor: '#e5e7eb' },
  name: { fontSize: 20, fontWeight: '700', marginBottom: 4 },
  specialty: { color: '#6b7280', marginBottom: 12 },
  description: { textAlign: 'center', color: '#374151' },
});
