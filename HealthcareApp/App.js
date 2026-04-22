import { useState, createContext, useContext, useEffect } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View, TextInput, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import LoginScreen from './LoginScreen';
import SubscriptionScreen from './SubscriptionScreen';
import ChatScreen from './ChatScreen';
import VideoScreen from './VideoScreen';
import ProfessionalScreen from './ProfessionalScreen';
import { professionalsAPI } from './api';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const ProfContext = createContext();

// Dados simulados dos profissionais de saúde
const profissionais = [
  {
    id: 1,
    nome: 'Dra. Ana Silva',
    especialidade: 'Psicologia Clínica',
    avaliacao: 4.9,
    preco: 'Plano Premium',
    imagem: 'https://i.pravatar.cc/150?img=5',
    disponibilidade: 'Hoje'
  },
  {
    id: 2,
    nome: 'Dr. Marcos Santos',
    especialidade: 'Nutrição',
    avaliacao: 4.8,
    preco: 'Todos os Planos',
    imagem: 'https://i.pravatar.cc/150?img=11',
    disponibilidade: 'Amanhã'
  },
  {
    id: 3,
    nome: 'Prof. João Costa',
    especialidade: 'Educação Física',
    avaliacao: 5.0,
    preco: 'Todos os Planos',
    imagem: 'https://i.pravatar.cc/150?img=12',
    disponibilidade: 'Hoje'
  },
];

function HomeScreen({ navigation }) {
  const { profData } = useContext(ProfContext);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [subscription, setSubscription] = useState({ plan: 'Premium', duration: 'mensal' });

  return (
    <ScrollView style={styles.homeContainer}>
      {/* Cabeçalho */}
      <View style={styles.headerBlue}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerGreeting}>Bom dia,</Text>
            <Text style={styles.headerName}>João Pedro</Text>
            <View style={styles.badgePremium}>
              <Ionicons name="star" size={12} color="#fbbf24" />
              <Text style={styles.badgeText}>Plano Premium Ativo</Text>
            </View>
          </View>
          <View style={styles.headerAvatar}>
            <Ionicons name="person" size={24} color="white" />
          </View>
        </View>

        {/* Card de Consultas */}
        <View style={styles.consultasCard}>
          <View>
            <Text style={styles.consultasLabel}>Consultas Restantes</Text>
            <Text style={styles.consultasValue}>2 de 3 <Text style={styles.consultasSubtext}>neste mês</Text></Text>
          </View>
          <View style={styles.consultasIcon}>
            <Ionicons name="videocam" size={20} color="#2563eb" />
          </View>
        </View>
      </View>

      {/* Ações Rápidas */}
      <View style={styles.actionsSection}>
        <Text style={styles.sectionTitle}>Como podemos ajudar?</Text>
        <View style={styles.actionsGrid}>
          <Pressable style={styles.actionButton} onPress={() => navigation.navigate('Video')}>
            <View style={styles.actionIconBlue}>
              <Ionicons name="videocam" size={24} color="#2563eb" />
            </View>
            <Text style={styles.actionTitle}>Videoconsulta</Text>
            <Text style={styles.actionSubtitle}>Avaliações e Psicologia</Text>
          </Pressable>

          <Pressable style={styles.actionButton} onPress={() => navigation.navigate('Chat')}>
            <View style={styles.actionIconGreen}>
              <Ionicons name="chatbubble" size={24} color="#16a34a" />
            </View>
            <Text style={styles.actionTitle}>Chat Rápido</Text>
            <Text style={styles.actionSubtitle}>Dúvidas simples e ajustes</Text>
          </Pressable>
        </View>
      </View>

      {/* Acesso aos Planos */}
      <View style={styles.plansAccessSection}>
        <Pressable
          style={styles.plansAccessButton}
          onPress={() => navigation.navigate('Subscription')}
        >
          <View>
            <View style={styles.plansTitleRow}>
              <Ionicons name="flash" size={18} color="#fbbf24" />
              <Text style={styles.plansAccessTitle}>Ver Planos</Text>
            </View>
            <Text style={styles.plansAccessSubtitle}>Faça upgrade ou gerencie</Text>
          </View>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </Pressable>
      </View>
    </ScrollView>
  );
}

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Search') {
            iconName = 'search';
          } else if (route.name === 'Calendar') {
            iconName = 'calendar';
          } else if (route.name === 'Profile') {
            iconName = 'person';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function SearchScreen({ navigation }) {
  return (
    <View style={styles.searchContainer}>
      <View style={styles.searchHeader}>
        <Text style={styles.searchTitle}>Profissionais</Text>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#9ca3af" style={styles.searchIcon} />
          <TextInput
            placeholder="Pesquisar por nome ou especialidade..."
            style={styles.searchInput}
          />
        </View>
      </View>

      <ScrollView style={styles.professionalsList}>
        {profissionais.map((medico) => (
          <Pressable
            key={medico.id}
            onPress={() => navigation.navigate('ProfessionalProfile', { medico })}
            style={styles.profesionalCard}
          >
            <Image source={{ uri: medico.imagem }} style={styles.profesionalImage} />
            <View style={styles.profesionalInfo}>
              <View style={styles.profesionalHeader}>
                <Text style={styles.profesionalName}>{medico.nome}</Text>
                <View style={styles.ratingBadge}>
                  <Ionicons name="star" size={14} color="#eab308" />
                  <Text style={styles.ratingText}>{medico.avaliacao}</Text>
                </View>
              </View>
              <Text style={styles.profesionalSpecialty}>{medico.especialidade}</Text>
              <View style={styles.profesionalFooter}>
                <View style={styles.availabilityBadge}>
                  <Ionicons name="time" size={12} color="#16a34a" />
                  <Text style={styles.availabilityText}>{medico.disponibilidade}</Text>
                </View>
                <Text style={styles.planBadge}>{medico.preco}</Text>
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

function CalendarScreen() {
  return (
    <View style={styles.placeholderContainer}>
      <Text>Calendar Screen - Placeholder</Text>
    </View>
  );
}

function ProfileScreen() {
  return (
    <View style={styles.placeholderContainer}>
      <Text>Profile Screen - Placeholder</Text>
    </View>
  );
}

function PlansScreen({ navigation }) {
  return (
    <View style={styles.placeholderContainer}>
      <Text>Plans Screen - Coming Soon</Text>
    </View>
  );
}

function ProfessionalProfileScreen({ route, navigation }) {
  const { medico } = route.params;

  return (
    <View style={styles.placeholderContainer}>
      <Text>Professional Profile Screen - Coming Soon</Text>
    </View>
  );
}

export default function App() {
  const [profData, setProfData] = useState([
    { name: 'Dra. Ana Souza', specialty: 'Nutricionista', clients: [], balance: 0 },
    { name: 'Dr. Lucas Pereira', specialty: 'Educador Físico', clients: [], balance: 0 },
    { name: 'Dra. Mariana Lima', specialty: 'Psicóloga', clients: [], balance: 0 },
  ]);

  return (
    <ProfContext.Provider value={{ profData, setProfData }}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#4338ca' }, headerTintColor: '#ffffff' }}>
          <Stack.Screen name="Main" component={MainTabNavigator} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Subscription" component={SubscriptionScreen} initialParams={{ updateProfData: setProfData }} />
          <Stack.Screen name="Chat" component={ChatScreen} />
          <Stack.Screen name="Video" component={VideoScreen} />
          <Stack.Screen name="Professional" component={ProfessionalScreen} />
          <Stack.Screen name="ProfessionalProfile" component={ProfessionalProfileScreen} />
          <Stack.Screen name="Plans" component={PlansScreen} />
        </Stack.Navigator>
        <StatusBar style="light" />
      </NavigationContainer>
    </ProfContext.Provider>
  );
}

const styles = StyleSheet.create({
  // Home Screen
  homeContainer: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    paddingBottom: 80,
  },
  headerBlue: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerGreeting: {
    color: '#bfdbfe',
    fontSize: 14,
    marginBottom: 4,
  },
  headerName: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  badgePremium: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fbbf24',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    gap: 4,
  },
  badgeText: {
    color: '#78350f',
    fontSize: 11,
    fontWeight: 'bold',
  },
  headerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 2,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  consultasCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  consultasLabel: {
    color: '#6b7280',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  consultasValue: {
    color: '#111827',
    fontSize: 18,
    fontWeight: 'bold',
  },
  consultasSubtext: {
    color: '#9ca3af',
    fontSize: 13,
    fontWeight: '400',
  },
  consultasIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0f4ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionsSection: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  actionIconBlue: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0f4ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionIconGreen: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0fdf4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionTitle: {
    color: '#1f2937',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  actionSubtitle: {
    color: '#9ca3af',
    fontSize: 12,
    textAlign: 'center',
  },
  plansAccessSection: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  plansAccessButton: {
    backgroundColor: '#1f2937',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  plansTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  plansAccessTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  plansAccessSubtitle: {
    color: '#d1d5db',
    fontSize: 13,
  },

  // Old styles (keeping for other components)
  page: {
    backgroundColor: '#eef2ff',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  hero: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: '#475569',
  },
  welcome: {
    fontSize: 14,
    color: '#059669',
    fontWeight: 'bold',
    marginTop: 8,
  },
  subscription: {
    fontSize: 14,
    color: '#7c3aed',
    fontWeight: 'bold',
    marginTop: 4,
  },
  section: {
    marginBottom: 22,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
    marginBottom: 18,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  serviceButton: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  serviceDesc: {
    fontSize: 14,
    color: '#64748b',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#4338ca',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#e5e7eb',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '700',
  },
  infoBox: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  infoText: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 22,
    marginBottom: 8,
  },
  footer: {
    alignItems: 'center',
    marginTop: 12,
  },
  footerText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
  },
  screenCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 14,
    fontSize: 16,
  },
  planCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  planCardSelected: {
    borderColor: '#4338ca',
    shadowColor: '#4338ca',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 18,
  },
  planTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 6,
  },
  planPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4338ca',
    marginBottom: 8,
  },
  planDescription: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    padding: 20,
  },

  // SearchScreen Styles
  searchContainer: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  searchHeader: {
    backgroundColor: 'white',
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
    height: 44,
  },
  professionalsList: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 80,
  },
  profesionalCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    gap: 12,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  profesionalImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#e5e7eb',
  },
  profesionalInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  profesionalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  profesionalName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#78350f',
  },
  profesionalSpecialty: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 8,
  },
  profesionalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  availabilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  availabilityText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#16a34a',
  },
  planBadge: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#2563eb',
  },

  // Placeholder styles
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
  },
});

