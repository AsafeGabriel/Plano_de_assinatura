import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const durations = [
  { id: 'monthly', label: 'Mensal' },
  { id: 'bimonthly', label: 'Bimestral' },
  { id: 'quarterly', label: 'Trimestral' },
  { id: 'semiannual', label: 'Semestral' },
];

const plans = {
  test: {
    title: 'Teste',
    description: 'Plano de teste gratuito para desenvolvimento.',
    consultations: 1,
  },
  basic: {
    title: 'Básico',
    description: '1 consulta por mês com nutricionista ou educador físico + plano personalizado.',
    consultations: 1,
  },
  intermediate: {
    title: 'Intermediário',
    description: '2 consultas mensais com nutricionista e educador físico + plano alimentar, treino e suporte por chat.',
    consultations: 2,
  },
  premium: {
    title: 'Premium',
    description: '3 consultas por mês com nutricionista, educador físico e psicólogo + chat liberado e prioridade no atendimento.',
    consultations: 3,
  },
};

const prices = {
  monthly: { test: 0.01, basic: 29.90, intermediate: 49.90, premium: 79.90 },
  bimonthly: { test: 0.01, basic: 55.90, intermediate: 95.90, premium: 149.90 },
  quarterly: { test: 0.01, basic: 79.90, intermediate: 139.90, premium: 219.90 },
  semiannual: { test: 0.01, basic: 149.90, intermediate: 259.90, premium: 399.90 },
};

export default function SubscriptionScreen({ navigation, route }) {
  const updateProfData = route.params?.updateProfData;
  const [selectedDuration, setSelectedDuration] = useState('monthly');
  const [selectedPlan, setSelectedPlan] = useState('test');

  const handleSubscribe = () => {
    const plan = plans[selectedPlan];
    const price = prices[selectedDuration][selectedPlan];
    const durationLabel = durations.find(d => d.id === selectedDuration).label;
    const assignedProfessional = 'Dra. Ana Souza';
    // Update profData
    if (updateProfData) {
      updateProfData(prev => prev.map((prof, index) =>
        index === 0 ? { ...prof, clients: [...prof.clients, { name: 'Cliente Teste', plan: plan.title, duration: durationLabel }], balance: prof.balance + price } : prof
      ));
    }
    Alert.alert(
      'Assinatura confirmada',
      `Plano ${plan.title} ${durationLabel} - R$ ${price.toFixed(2)}\nAtribuído a: ${assignedProfessional}`,
      [{ text: 'OK', onPress: () => navigation.navigate('Home', { subscription: { plan: plan.title, duration: durationLabel, price, professional: assignedProfessional } }) }]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Escolha seu Plano - Conecta Saúde</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Duração</Text>
        <View style={styles.options}>
          {durations.map((duration) => (
            <TouchableOpacity
              key={duration.id}
              style={[styles.option, selectedDuration === duration.id && styles.optionSelected]}
              onPress={() => setSelectedDuration(duration.id)}
            >
              <Text style={[styles.optionText, selectedDuration === duration.id && styles.optionTextSelected]}>
                {duration.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Plano</Text>
        {Object.entries(plans).map(([key, plan]) => (
          <TouchableOpacity
            key={key}
            style={[styles.planCard, selectedPlan === key && styles.planCardSelected]}
            onPress={() => setSelectedPlan(key)}
          >
            <Text style={styles.planTitle}>{plan.title}</Text>
            <Text style={styles.planPrice}>
              R$ {prices[selectedDuration][key].toFixed(2)} / {durations.find(d => d.id === selectedDuration).label.toLowerCase()}
            </Text>
            <Text style={styles.planDescription}>{plan.description}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.subscribeButton} onPress={handleSubscribe}>
        <Text style={styles.subscribeText}>Assinar Agora</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>Voltar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f9fc',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#1f2937',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#374151',
  },
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  option: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    flex: 1,
    minWidth: 80,
    alignItems: 'center',
  },
  optionSelected: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  optionText: {
    fontSize: 14,
    color: '#374151',
  },
  optionTextSelected: {
    color: '#2563eb',
    fontWeight: 'bold',
  },
  planCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  planCardSelected: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  planTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  planPrice: {
    fontSize: 16,
    color: '#2563eb',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  planDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  subscribeButton: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  subscribeText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    alignItems: 'center',
  },
  backText: {
    color: '#6b7280',
    fontSize: 14,
  },
});