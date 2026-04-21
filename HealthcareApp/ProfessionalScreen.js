import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function ProfessionalScreen({ navigation, route }) {
    const professional = route.params?.professional || 'Dra. Ana Souza';
    const clients = route.params?.clients || [];
    const balance = route.params?.balance || 0;

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Painel do Profissional</Text>
            <Text style={styles.professionalName}>{professional}</Text>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Saldo Disponível</Text>
                <Text style={styles.balance}>R$ {balance.toFixed(2)}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Clientes Assinados</Text>
                {clients.length > 0 ? (
                    clients.map((client, index) => (
                        <View key={index} style={styles.clientCard}>
                            <Text style={styles.clientName}>{client.name}</Text>
                            <Text style={styles.clientPlan}>{client.plan} - {client.duration}</Text>
                        </View>
                    ))
                ) : (
                    <Text style={styles.noClients}>Nenhum cliente assinado ainda.</Text>
                )}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Ações</Text>
                <Text style={styles.actionText}>Aqui você pode gerenciar consultas, responder chats, etc.</Text>
            </View>
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
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
        color: '#1f2937',
    },
    professionalName: {
        fontSize: 18,
        textAlign: 'center',
        color: '#4b5563',
        marginBottom: 30,
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
    balance: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#059669',
        textAlign: 'center',
    },
    clientCard: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    clientName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1f2937',
    },
    clientPlan: {
        fontSize: 14,
        color: '#6b7280',
    },
    noClients: {
        fontSize: 16,
        color: '#9ca3af',
        textAlign: 'center',
    },
    actionText: {
        fontSize: 14,
        color: '#6b7280',
        lineHeight: 20,
    },
});