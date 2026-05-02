import React, { useContext } from 'react';
import { ScrollView, StyleSheet, Text, View, Pressable, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from './src/context/AuthContext';

function getGreeting() {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Bom dia';
    if (hour >= 12 && hour < 18) return 'Boa tarde';
    return 'Boa noite';
}

export default function ProfessionalScreen({ navigation }) {
    const { user } = useContext(AuthContext);
    const systemColorScheme = useColorScheme();
    const isDark = systemColorScheme === 'dark';

    const colors = {
        background: isDark ? '#050f1c' : '#f3f4f6',
        containerBg: isDark ? '#0f172a' : '#ffffff',
        text: isDark ? '#f1f5f9' : '#0f172a',
        textSecondary: isDark ? '#cbd5e1' : '#475569',
        textTertiary: isDark ? '#94a3b8' : '#94a3b8',
        border: isDark ? '#1e293b' : '#e2e8f0',
        primary: '#2563eb',
        primaryLight: '#3b82f6',
        card: isDark ? '#1e293b' : '#ffffff',
        cardHover: isDark ? '#334155' : '#f9fafb',
        success: '#10b981',
        warning: '#f59e0b',
    };

    const professionalName = user?.name || 'Profissional';
    const greeting = getGreeting();
    const patients = [
        { id: 1, name: 'João Silva', time: '09:00', status: 'Confirmado' },
        { id: 2, name: 'Maria Santos', time: '10:30', status: 'Confirmado' },
        { id: 3, name: 'Pedro Oliveira', time: '14:00', status: 'Pendente' },
    ];

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={{ paddingBottom: 100 }}>
            {/* Cabeçalho */}
            <View style={[styles.header, { backgroundColor: colors.containerBg, borderBottomColor: colors.border, borderBottomWidth: 1 }]}>
                <View style={styles.headerContent}>
                    <Text style={[styles.greeting, { color: colors.textTertiary }]}>{greeting},</Text>
                    <Text style={[styles.professionalNameHeader, { color: colors.text }]}>{professionalName}</Text>
                    <Text style={[styles.role, { color: colors.primary }]}>Profissional de Saúde</Text>
                </View>
                <View style={[styles.avatarContainer, { backgroundColor: colors.primary }]}>
                    <Ionicons name="person" size={28} color="white" />
                </View>
            </View>

            {/* Resumo do Dia */}
            <View style={[styles.summaryCard, { backgroundColor: colors.primary }]}>
                <View style={styles.summaryItem}>
                    <View style={[styles.summaryIcon, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                        <Ionicons name="videocam" size={24} color="white" />
                    </View>
                    <View>
                        <Text style={styles.summaryLabel}>Consultas Hoje</Text>
                        <Text style={styles.summaryValue}>3</Text>
                    </View>
                </View>
                <View style={styles.divider} />
                <View style={styles.summaryItem}>
                    <View style={[styles.summaryIcon, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                        <Ionicons name="people" size={24} color="white" />
                    </View>
                    <View>
                        <Text style={styles.summaryLabel}>Pacientes Ativos</Text>
                        <Text style={styles.summaryValue}>12</Text>
                    </View>
                </View>
                <View style={styles.divider} />
                <View style={styles.summaryItem}>
                    <View style={[styles.summaryIcon, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                        <Ionicons name="chatbubble" size={24} color="white" />
                    </View>
                    <View>
                        <Text style={styles.summaryLabel}>Mensagens</Text>
                        <Text style={styles.summaryValue}>5</Text>
                    </View>
                </View>
            </View>

            {/* Ações Rápidas */}
            <View style={styles.actionsSection}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Ações Rápidas</Text>
                <View style={styles.actionGrid}>
                    <Pressable
                        style={[styles.actionCard, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }]}
                        onPress={() => navigation.navigate('Video')}
                    >
                        <View style={[styles.actionIcon, { backgroundColor: `${colors.primary}20` }]}>
                            <Ionicons name="videocam" size={24} color={colors.primary} />
                        </View>
                        <Text style={[styles.actionTitle, { color: colors.text }]}>Iniciar Vídeo</Text>
                        <Text style={[styles.actionSubtitle, { color: colors.textSecondary }]}>Consulta agora</Text>
                    </Pressable>

                    <Pressable
                        style={[styles.actionCard, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }]}
                        onPress={() => navigation.navigate('ProfAgenda')}
                    >
                        <View style={[styles.actionIcon, { backgroundColor: `${colors.success}20` }]}>
                            <Ionicons name="calendar" size={24} color={colors.success} />
                        </View>
                        <Text style={[styles.actionTitle, { color: colors.text }]}>Agenda</Text>
                        <Text style={[styles.actionSubtitle, { color: colors.textSecondary }]}>Ver horários</Text>
                    </Pressable>

                    <Pressable style={[styles.actionCard, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }]}>
                        <View style={[styles.actionIcon, { backgroundColor: `${colors.warning}20` }]}>
                            <Ionicons name="clipboard" size={24} color={colors.warning} />
                        </View>
                        <Text style={[styles.actionTitle, { color: colors.text }]}>Relatórios</Text>
                        <Text style={[styles.actionSubtitle, { color: colors.textSecondary }]}>Ver desempenho</Text>
                    </Pressable>

                    <Pressable style={[styles.actionCard, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }]}>
                        <View style={[styles.actionIcon, { backgroundColor: `${colors.primary}20` }]}>
                            <Ionicons name="document" size={24} color={colors.primary} />
                        </View>
                        <Text style={[styles.actionTitle, { color: colors.text }]}>Prontuários</Text>
                        <Text style={[styles.actionSubtitle, { color: colors.textSecondary }]}>Pacientes</Text>
                    </Pressable>
                </View>
            </View>

            {/* Próximas Consultas */}
            <View style={styles.appointmentsSection}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Próximas Consultas</Text>
                {patients.map((patient) => (
                    <View key={patient.id} style={[styles.appointmentCard, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }]}>
                        <View style={[styles.appointmentIcon, { backgroundColor: colors.cardHover }]}>
                            <Ionicons name="person-circle" size={32} color={colors.primary} />
                        </View>
                        <Pressable style={styles.appointmentContent} onPress={() => navigation.navigate('Video', { patient })}>
                            <Text style={[styles.appointmentName, { color: colors.text }]}>{patient.name}</Text>
                            <Text style={[styles.appointmentTime, { color: colors.textTertiary }]}>
                                <Ionicons name="time-outline" size={12} /> {patient.time}
                            </Text>
                        </Pressable>
                        <View style={{ flexDirection: 'column', alignItems: 'flex-end' }}>
                            <Pressable
                                style={[styles.smallAction, { backgroundColor: colors.primary }]}
                                onPress={() => navigation.navigate('Video', { patient })}
                            >
                                <Ionicons name="videocam" size={16} color="white" />
                            </Pressable>
                            <Pressable
                                style={[styles.smallAction, { backgroundColor: colors.cardHover, marginTop: 8 }]}
                                onPress={() => navigation.navigate('ProfChat', { patient })}
                            >
                                <Ionicons name="chatbubble" size={16} color={colors.primary} />
                            </Pressable>
                            <View style={[styles.statusBadge, { backgroundColor: patient.status === 'Confirmado' ? `${colors.success}20` : `${colors.warning}20`, marginTop: 8 }]}>
                                <Text style={[styles.statusText, { color: patient.status === 'Confirmado' ? colors.success : colors.warning }]}>
                                    {patient.status}
                                </Text>
                            </View>
                        </View>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    headerContent: {
        flex: 1,
    },
    greeting: {
        fontSize: 14,
    },
    professionalNameHeader: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 2,
    },
    role: {
        fontSize: 12,
        fontWeight: '600',
    },
    avatarContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 16,
    },
    summaryCard: {
        marginHorizontal: 16,
        marginTop: 16,
        paddingHorizontal: 12,
        paddingVertical: 16,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    summaryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    summaryIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    summaryLabel: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.8)',
        fontWeight: '500',
    },
    summaryValue: {
        fontSize: 18,
        fontWeight: '700',
        color: 'white',
    },
    divider: {
        width: 1,
        height: 40,
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    actionsSection: {
        marginHorizontal: 16,
        marginTop: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 12,
    },
    actionGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    actionCard: {
        width: '48%',
        paddingHorizontal: 12,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionIcon: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    actionTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 2,
        textAlign: 'center',
    },
    actionSubtitle: {
        fontSize: 11,
        textAlign: 'center',
    },
    appointmentsSection: {
        marginHorizontal: 16,
        marginTop: 24,
    },
    appointmentCard: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 12,
        borderRadius: 12,
        marginBottom: 12,
    },
    appointmentIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    appointmentContent: {
        flex: 1,
    },
    appointmentName: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 2,
    },
    appointmentTime: {
        fontSize: 12,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    statusText: {
        fontSize: 11,
        fontWeight: '600',
    },
});