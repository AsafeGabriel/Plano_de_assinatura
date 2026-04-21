import { useState, createContext, useContext } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import LoginScreen from './LoginScreen';
import SubscriptionScreen from './SubscriptionScreen';
import ChatScreen from './ChatScreen';
import VideoScreen from './VideoScreen';
import ProfessionalScreen from './ProfessionalScreen';

const Stack = createNativeStackNavigator();

const ProfContext = createContext();

const professionals = [
  { name: 'Dra. Ana Souza', specialty: 'Nutricionista', clients: [], balance: 0 },
  { name: 'Dr. Lucas Pereira', specialty: 'Educador Físico', clients: [], balance: 0 },
  { name: 'Dra. Mariana Lima', specialty: 'Psicóloga', clients: [], balance: 0 },
];

function HomeScreen({ navigation, route }) {
  const { profData } = useContext(ProfContext);
  const isLoggedIn = route.params?.isLoggedIn || false;
  const subscription = route.params?.subscription || null;
  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.title}>Conecta Saúde</Text>
        <Text style={styles.subtitle}>Conectando pacientes a profissionais de saúde com chat e vídeo.</Text>
        {isLoggedIn && <Text style={styles.welcome}>Bem-vindo! Você está logado.</Text>}
        {subscription && <Text style={styles.subscription}>Plano ativo: {subscription.plan} ({subscription.duration})</Text>}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profissionais em destaque</Text>
        {professionals.map((item) => (
          <Pressable key={item.name} style={styles.card} onPress={() => subscription ? navigation.navigate('Chat') : Alert.alert('Acesso restrito', 'Assine um plano para acessar.')}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardSubtitle}>{item.specialty}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Serviços</Text>
        <View style={styles.buttonRow}>
          <Pressable style={styles.serviceButton} onPress={() => subscription ? navigation.navigate('Chat') : Alert.alert('Acesso restrito', 'Assine um plano para acessar.')}>
            <Text style={styles.serviceTitle}>Chat Rápido</Text>
            <Text style={styles.serviceDesc}>Dúvidas rápidas e ajustes simples</Text>
          </Pressable>
          <Pressable style={styles.serviceButton} onPress={() => subscription ? navigation.navigate('Video') : Alert.alert('Acesso restrito', 'Assine um plano para acessar.')}>
            <Text style={styles.serviceTitle}>Vídeo Chamada</Text>
            <Text style={styles.serviceDesc}>Consultas, reavaliações</Text>
          </Pressable>
        </View>
      </View>

      {isLoggedIn && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Área Profissional</Text>
          <Pressable style={styles.primaryButton} onPress={() => navigation.navigate('Professional', { professional: 'Dra. Ana Souza', clients: profData[0].clients, balance: profData[0].balance })}>
            <Text style={styles.primaryButtonText}>Ver Painel Profissional</Text>
          </Pressable>
        </View>
      )}

      {!isLoggedIn && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Seja membro</Text>
          <Text style={styles.description}>Faça login ou assine um plano para acessar todos os serviços.</Text>
          <View style={styles.buttonRow}>
            <Pressable style={styles.primaryButton} onPress={() => navigation.navigate('Login')}>
              <Text style={styles.primaryButtonText}>Login</Text>
            </Pressable>
            <Pressable style={styles.secondaryButton} onPress={() => navigation.navigate('Subscription')}>
              <Text style={styles.secondaryButtonText}>Assinar</Text>
            </Pressable>
          </View>
        </View>
      )}

      {isLoggedIn && !subscription && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ative sua assinatura</Text>
          <Text style={styles.description}>Escolha um plano para começar a usar os serviços.</Text>
          <Pressable style={styles.primaryButton} onPress={() => navigation.navigate('Subscription')}>
            <Text style={styles.primaryButtonText}>Assinar Plano</Text>
          </Pressable>
        </View>
      )}

      <View style={styles.footer}>
        <Text style={styles.footerText}>App Conecta Saúde funcional: login e assinatura ativam acesso aos serviços.</Text>
      </View>
    </ScrollView>
  );
}

export default function App() {
  const [profData, setProfData] = useState(professionals);
  return (
    <ProfContext.Provider value={{ profData, setProfData }}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#4338ca' }, headerTintColor: '#ffffff' }}>
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Conecta Saúde' }} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Subscription" component={SubscriptionScreen} initialParams={{ updateProfData: setProfData }} />
          <Stack.Screen name="Chat" component={ChatScreen} />
          <Stack.Screen name="Video" component={VideoScreen} />
          <Stack.Screen name="Professional" component={ProfessionalScreen} />
        </Stack.Navigator>
        <StatusBar style="light" />
      </NavigationContainer>
    </ProfContext.Provider>
  );
}

const styles = StyleSheet.create({
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
});
