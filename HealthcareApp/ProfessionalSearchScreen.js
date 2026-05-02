import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, useColorScheme, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usersAPI } from './api';

function getPlanLabel(plan) {
    if (!plan) return 'Nenhum';
    const normalized = String(plan).toLowerCase();
    if (normalized.includes('test') || normalized.includes('prem')) return 'Premium';
    if (normalized.includes('inter')) return 'Intermediário';
    if (normalized.includes('basic')) return 'Básico';
    return plan;
}

function ProfessionalSearchScreen() {
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
        card: isDark ? '#1e293b' : '#ffffff',
        cardHover: isDark ? '#334155' : '#f9fafb',
        inputBg: isDark ? '#0f172a' : '#f8fafc',
        inputBorder: isDark ? '#334155' : '#e2e8f0',
        success: '#10b981',
        warning: '#f59e0b',
    };

    const [patients, setPatients] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('todos');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPatients = async () => {
            try {
                setLoading(true);
                const response = await usersAPI.getAll('patient');
                const normalized = response.data.map((patient) => ({
                    id: patient._id || patient.id,
                    name: patient.name || 'Paciente',
                    plan: patient.plan || 'Nenhum',
                    status: patient.status || 'Ativo',
                    consultations: `${patient.consultationsLeft || 0}/3`,
                }));
                setPatients(normalized);
            } catch (error) {
                console.error('Erro ao buscar pacientes:', error);
            } finally {
                setLoading(false);
            }
        };

        loadPatients();
    }, []);

    const filters = [
        { id: 'todos', label: 'Todos', icon: 'people' },
        { id: 'ativo', label: 'Ativos', icon: 'checkmark-circle' },
        { id: 'inativo', label: 'Inativos', icon: 'close-circle' },
        { id: 'premium', label: 'Premium', icon: 'star' },
    ];

    const filteredPatients = patients.filter((patient) => {
        const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase());
        const normalizedPlan = getPlanLabel(patient.plan);
        let matchesFilter = true;

        if (selectedFilter === 'ativo') matchesFilter = patient.status === 'Ativo';
        if (selectedFilter === 'inativo') matchesFilter = patient.status === 'Inativo';
        if (selectedFilter === 'premium') matchesFilter = normalizedPlan === 'Premium';

        return matchesSearch && matchesFilter;
    });

    const getPlanColor = (plan) => {
        if (plan === 'Premium') return colors.primary;
        if (plan === 'Intermediário') return colors.warning;
        return colors.textTertiary;
    };

    const getStatusColor = (status) => {
        return status === 'Ativo' ? colors.success : colors.textTertiary;
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { backgroundColor: colors.containerBg, borderBottomColor: colors.border, borderBottomWidth: 1 }]}>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Buscar Pacientes</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {/* Barra de Busca */}
                <View style={[styles.searchContainer, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, borderWidth: 1 }]}>
                    <Ionicons name="search" size={20} color={colors.textTertiary} />
                    <TextInput
                        style={[styles.searchInput, { color: colors.text }]}
                        placeholder="Procurar paciente..."
                        placeholderTextColor={colors.textTertiary}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery && (
                        <Pressable onPress={() => setSearchQuery('')}>
                            <Ionicons name="close-circle" size={20} color={colors.textTertiary} />
                        </Pressable>
                    )}
                </View>

                {/* Filtros */}
                <View style={styles.filtersSection}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
                        {filters.map((filter) => (
                            <Pressable
                                key={filter.id}
                                onPress={() => setSelectedFilter(filter.id)}
                                style={[
                                    styles.filterButton,
                                    {
                                        backgroundColor: selectedFilter === filter.id ? colors.primary : colors.card,
                                        borderColor: colors.border,
                                        borderWidth: 1,
                                    },
                                ]}
                            >
                                <Ionicons
                                    name={filter.icon}
                                    size={16}
                                    color={selectedFilter === filter.id ? 'white' : colors.primary}
                                />
                                <Text
                                    style={[
                                        styles.filterText,
                                        { color: selectedFilter === filter.id ? 'white' : colors.text },
                                    ]}
                                >
                                    {filter.label}
                                </Text>
                            </Pressable>
                        ))}
                    </ScrollView>
                </View>

                {/* Lista de Pacientes */}
                <View style={styles.patientsSection}>
                    <Text style={[styles.sectionLabel, { color: colors.textTertiary }]}>
                        {filteredPatients.length} paciente(s) encontrado(s)
                    </Text>

                    {filteredPatients.length > 0 ? (
                        filteredPatients.map((patient) => (
                            <Pressable
                                key={patient.id}
                                style={[styles.patientCard, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }]}
                            >
                                <View style={[styles.patientAvatar, { backgroundColor: colors.cardHover }]}>
                                    <Ionicons name="person" size={24} color={colors.primary} />
                                </View>

                                <View style={styles.patientInfo}>
                                    <View style={styles.patientHeader}>
                                        <Text style={[styles.patientName, { color: colors.text }]}>{patient.name}</Text>
                                        <View style={[styles.planBadge, { backgroundColor: `${getPlanColor(getPlanLabel(patient.plan))}20` }]}>
                                            <Ionicons name="star" size={12} color={getPlanColor(getPlanLabel(patient.plan))} />
                                            <Text style={[styles.planText, { color: getPlanColor(getPlanLabel(patient.plan)) }]}>
                                                {getPlanLabel(patient.plan)}
                                            </Text>
                                        </View>
                                    </View>

                                    <View style={styles.patientDetails}>
                                        <View style={styles.detailItem}>
                                            <Ionicons name="calendar" size={14} color={colors.textTertiary} />
                                            <Text style={[styles.detailText, { color: colors.textSecondary }]}>
                                                {patient.consultations}
                                            </Text>
                                        </View>

                                        <View style={styles.detailDivider} />

                                        <View style={styles.detailItem}>
                                            <Ionicons
                                                name={patient.status === 'Ativo' ? 'checkmark-circle' : 'close-circle'}
                                                size={14}
                                                color={getStatusColor(patient.status)}
                                            />
                                            <Text style={[styles.detailText, { color: getStatusColor(patient.status) }]}>
                                                {patient.status}
                                            </Text>
                                        </View>
                                    </View>
                                </View>

                                <Pressable style={[styles.actionButton, { backgroundColor: colors.primary }]}>
                                    <Ionicons name="arrow-forward" size={18} color="white" />
                                </Pressable>
                            </Pressable>
                        ))
                    ) : (
                        <View style={[styles.emptyState, { backgroundColor: colors.cardHover }]}>
                            <Ionicons name="search-outline" size={48} color={colors.textTertiary} />
                            <Text style={[styles.emptyStateTitle, { color: colors.text }]}>Nenhum paciente encontrado</Text>
                            <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
                                Tente ajustar os filtros ou verifique o nome
                            </Text>
                        </View>
                    )}
                </View>

                {/* Resumo */}
                <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }]}>
                    <View style={styles.summaryItem}>
                        <Text style={[styles.summaryLabel, { color: colors.textTertiary }]}>Pacientes</Text>
                        <Text style={[styles.summaryValue, { color: colors.text }]}>{patients.length}</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.summaryItem}>
                        <Text style={[styles.summaryLabel, { color: colors.textTertiary }]}>Ativos</Text>
                        <Text style={[styles.summaryValue, { color: colors.success }]}>
                            {patients.filter((p) => p.status === 'Ativo').length}
                        </Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.summaryItem}>
                        <Text style={[styles.summaryLabel, { color: colors.textTertiary }]}>Premium</Text>
                        <Text style={[styles.summaryValue, { color: colors.primary }]}>
                            {patients.filter((p) => p.plan === 'Premium').length}
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '700',
    },
    content: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 32,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        borderRadius: 12,
        marginBottom: 16,
        gap: 8,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 12,
        fontSize: 14,
    },
    filtersSection: {
        marginBottom: 20,
    },
    filterScroll: {
        marginHorizontal: -16,
        paddingHorizontal: 16,
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
        gap: 6,
    },
    filterText: {
        fontSize: 13,
        fontWeight: '600',
    },
    patientsSection: {
        marginBottom: 24,
    },
    sectionLabel: {
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 12,
    },
    patientCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 12,
        marginBottom: 12,
        gap: 12,
    },
    patientAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    patientInfo: {
        flex: 1,
    },
    patientHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    patientName: {
        fontSize: 14,
        fontWeight: '600',
    },
    planBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        gap: 4,
    },
    planText: {
        fontSize: 11,
        fontWeight: '600',
    },
    patientDetails: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    detailText: {
        fontSize: 12,
    },
    detailDivider: {
        width: 1,
        height: 12,
        backgroundColor: '#e2e8f0',
    },
    actionButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
        borderRadius: 12,
    },
    emptyStateTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 16,
        marginBottom: 8,
    },
    emptyStateText: {
        fontSize: 13,
        textAlign: 'center',
    },
    summaryCard: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 16,
        borderRadius: 12,
    },
    summaryItem: {
        flex: 1,
        alignItems: 'center',
    },
    summaryLabel: {
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 4,
    },
    summaryValue: {
        fontSize: 20,
        fontWeight: '700',
    },
    divider: {
        width: 1,
        height: 40,
        backgroundColor: '#e2e8f0',
    },
});

export default ProfessionalSearchScreen;
