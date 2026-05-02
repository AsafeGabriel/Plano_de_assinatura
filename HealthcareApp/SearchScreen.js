import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, Pressable, Image, ActivityIndicator, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { professionalsAPI } from './api';

export default function SearchScreen({ navigation }) {
  const systemColorScheme = useColorScheme();
  const isDark = systemColorScheme === 'dark';

  const colors = {
    background: isDark ? '#050f1c' : '#f3f4f6',
    card: isDark ? '#0f172a' : '#ffffff',
    text: isDark ? '#f1f5f9' : '#0f172a',
    textSecondary: isDark ? '#cbd5e1' : '#475569',
    inputBg: isDark ? '#0f172a' : '#ffffff',
    border: isDark ? '#334155' : '#e2e8f0',
    primary: '#2563eb',
  };

  const [professionals, setProfessionals] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        setLoading(true);
        const response = await professionalsAPI.getAll();
        const normalized = response.data.map((prof) => ({
          id: prof._id || prof.id,
          name: prof.name || prof.nome || 'Profissional',
          specialty: prof.specialty || prof.especialty || 'Especialidade não informada',
          avatar: prof.image || 'https://i.pravatar.cc/150?img=5',
          price: prof.price || prof.preco || 'Preço não informado',
          availability: prof.availability || prof.disponibilidade || 'Disponível',
          raw: prof,
        }));
        setProfessionals(normalized);
      } catch (error) {
        console.error('Erro ao buscar profissionais:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfessionals();
  }, []);

  const filteredProfessionals = professionals.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border, backgroundColor: colors.card }]}>
        <Text style={[styles.title, { color: colors.text }]}>Buscar profissionais</Text>
      </View>

      <View style={[styles.searchBox, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
        <Ionicons name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholder="Pesquisar por nome ou especialidade"
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : filteredProfessionals.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="search-outline" size={48} color={colors.textSecondary} />
          <Text style={[styles.emptyText, { color: colors.text }]}>Nenhum profissional encontrado</Text>
          <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>Cadastre um profissional para que ele apareça aqui.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredProfessionals}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Pressable
              style={[styles.item, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => navigation.navigate('ProfessionalProfile', { medico: item })}
            >
              <Image source={{ uri: item.avatar }} style={styles.avatar} />
              <View style={styles.info}>
                <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
                <Text style={[styles.specialty, { color: colors.textSecondary }]}>{item.specialty}</Text>
              </View>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingVertical: 16, borderBottomWidth: 1 },
  title: { fontSize: 24, fontWeight: '700' },
  searchBox: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10, margin: 16, borderWidth: 1, borderRadius: 12 },
  searchIcon: { marginRight: 8 },
  input: { flex: 1, fontSize: 16 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  emptyText: { fontSize: 18, fontWeight: '700', marginTop: 16 },
  emptySubtext: { fontSize: 14, marginTop: 8, textAlign: 'center' },
  list: { paddingHorizontal: 16, paddingBottom: 24 },
  item: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, borderWidth: 1, marginBottom: 12 },
  avatar: { width: 56, height: 56, borderRadius: 14, marginRight: 16 },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: '700' },
  specialty: { marginTop: 4, fontSize: 14 },
});
