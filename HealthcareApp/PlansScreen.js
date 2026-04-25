import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PlansScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Planos</Text>
      <Text style={styles.text}>Gerencie seus planos e assinaturas aqui.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f3f4f6' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
  text: { color: '#6b7280' },
});
