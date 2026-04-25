import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AuthContext } from './src/context/AuthContext';

export default function ProfileScreen() {
  const { user, logout } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      {user ? (
        <>
          <Text style={styles.title}>Olá, {user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
          <TouchableOpacity style={styles.button} onPress={logout}>
            <Text style={styles.buttonText}>Sair</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.title}>Você não está logado</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f3f4f6' },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 8 },
  email: { color: '#6b7280', marginBottom: 20 },
  button: { backgroundColor: '#2563eb', padding: 12, borderRadius: 10 },
  buttonText: { color: '#fff', fontWeight: '700' },
});
