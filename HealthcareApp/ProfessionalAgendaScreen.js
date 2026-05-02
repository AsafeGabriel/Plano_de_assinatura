import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, useColorScheme, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

function ProfessionalAgendaScreen({ navigation }) {
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
        success: '#10b981',
        warning: '#f59e0b',
    };

    const [currentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(1);
    const [viewMode, setViewMode] = useState('month'); // 'month' or 'week'

    const getDaysInMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = Array(firstDay).fill(null).concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));

    const appointments = {
        5: [
            { id: 1, patient: 'João Silva', time: '09:00', type: 'Consulta', status: 'Confirmado' },
            { id: 2, patient: 'Maria Santos', time: '10:30', type: 'Follow-up', status: 'Confirmado' },
        ],
        12: [
            { id: 3, patient: 'Pedro Oliveira', time: '14:00', type: 'Avaliação', status: 'Pendente' },
        ],
        18: [
            { id: 4, patient: 'Ana Costa', time: '11:00', type: 'Consulta', status: 'Confirmado' },
            { id: 5, patient: 'Carlos Mendes', time: '15:30', type: 'Consulta', status: 'Confirmado' },
        ],
    };

    const monthName = currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    const dayAppointments = appointments[selectedDate] || [];

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { backgroundColor: colors.containerBg, borderBottomColor: colors.border, borderBottomWidth: 1 }]}>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Agenda</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Calendário */}
                <View style={[styles.calendarCard, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }]}>
                    <View style={styles.monthHeader}>
                        <Pressable onPress={() => { }}>
                            <Ionicons name="chevron-back" size={24} color={colors.primary} />
                        </Pressable>
                        <Text style={[styles.monthTitle, { color: colors.text }]}>
                            {monthName.charAt(0).toUpperCase() + monthName.slice(1)}
                        </Text>
                        <Pressable onPress={() => { }}>
                            <Ionicons name="chevron-forward" size={24} color={colors.primary} />
                        </Pressable>
                    </View>

                    {/* Dias da semana */}
                    <View style={styles.weekDays}>
                        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'].map((day, idx) => (
                            <Text key={idx} style={[styles.weekDay, { color: colors.textTertiary }]}>
                                {day}
                            </Text>
                        ))}
                    </View>

                    {/* Grid de dias */}
                    <View style={styles.calendarGrid}>
                        {days.map((day, idx) => (
                            <Pressable
                                key={idx}
                                onPress={() => day && setSelectedDate(day)}
                                style={[
                                    styles.dayButton,
                                    !day && styles.emptyDay,
                                    day === selectedDate && [styles.selectedDay, { backgroundColor: colors.primary }],
                                    day && day !== selectedDate && [styles.dayButtonDefault, { backgroundColor: colors.cardHover, borderColor: colors.border }],
                                ]}
                            >
                                {day ? (
                                    <>
                                        <Text
                                            style={[
                                                styles.dayText,
                                                day === selectedDate ? { color: 'white', fontWeight: '700' } : { color: colors.text },
                                            ]}
                                        >
                                            {day}
                                        </Text>
                                        {appointments[day] && (
                                            <View style={[styles.dayIndicator, day === selectedDate ? { backgroundColor: 'white' } : { backgroundColor: colors.primary }]} />
                                        )}
                                    </>
                                ) : null}
                            </Pressable>
                        ))}
                    </View>
                </View>

                {/* Detalhes do dia selecionado */}
                <View style={styles.appointmentsSection}>
                    <View style={styles.appointmentsHeader}>
                        <Text style={[styles.appointmentsTitle, { color: colors.text }]}>
                            Consultas - {selectedDate} de {monthName.split(' ')[0]}
                        </Text>
                        <Pressable style={[styles.addButton, { backgroundColor: colors.primary }]}>
                            <Ionicons name="add" size={20} color="white" />
                        </Pressable>
                    </View>

                    {dayAppointments.length > 0 ? (
                        dayAppointments.map((apt) => (
                            <View key={apt.id} style={[styles.appointmentCard, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }]}>
                                <View style={styles.appointmentLeft}>
                                    <View style={[styles.timeBox, { backgroundColor: colors.cardHover }]}>
                                        <Text style={[styles.time, { color: colors.primary }]}>{apt.time}</Text>
                                    </View>
                                    <View style={styles.appointmentInfo}>
                                        <Text style={[styles.patientName, { color: colors.text }]}>{apt.patient}</Text>
                                        <Text style={[styles.appointmentType, { color: colors.textSecondary }]}>{apt.type}</Text>
                                    </View>
                                </View>
                                <View style={[styles.statusBadge, { backgroundColor: apt.status === 'Confirmado' ? `${colors.success}20` : `${colors.warning}20` }]}>
                                    <Text style={[styles.statusText, { color: apt.status === 'Confirmado' ? colors.success : colors.warning }]}>
                                        {apt.status}
                                    </Text>
                                </View>
                            </View>
                        ))
                    ) : (
                        <View style={[styles.emptyState, { backgroundColor: colors.cardHover }]}>
                            <Ionicons name="calendar-outline" size={48} color={colors.textTertiary} />
                            <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>Nenhuma consulta neste dia</Text>
                        </View>
                    )}
                </View>

                {/* Ações da Agenda */}
                <View style={styles.actionsSection}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Ações</Text>
                    <View style={styles.actionGrid}>
                        <Pressable style={[styles.actionCard, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }]}>
                            <Ionicons name="videocam" size={24} color={colors.primary} />
                            <Text style={[styles.actionText, { color: colors.text }]}>Iniciar Consulta</Text>
                        </Pressable>
                        <Pressable style={[styles.actionCard, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }]}>
                            <Ionicons name="document" size={24} color={colors.primary} />
                            <Text style={[styles.actionText, { color: colors.text }]}>Prontuário</Text>
                        </Pressable>
                        <Pressable style={[styles.actionCard, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }]}>
                            <Ionicons name="notifications" size={24} color={colors.warning} />
                            <Text style={[styles.actionText, { color: colors.text }]}>Notificar</Text>
                        </Pressable>
                        <Pressable style={[styles.actionCard, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }]}>
                            <Ionicons name="time" size={24} color={colors.success} />
                            <Text style={[styles.actionText, { color: colors.text }]}>Horários</Text>
                        </Pressable>
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
    calendarCard: {
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
    },
    monthHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    monthTitle: {
        fontSize: 16,
        fontWeight: '700',
    },
    weekDays: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    weekDay: {
        fontSize: 12,
        fontWeight: '600',
        width: '14.28%',
        textAlign: 'center',
    },
    calendarGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    dayButton: {
        width: '14.28%',
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        marginBottom: 4,
        position: 'relative',
    },
    emptyDay: {
        backgroundColor: 'transparent',
    },
    dayButtonDefault: {
        borderWidth: 1,
    },
    selectedDay: {
        borderRadius: 8,
    },
    dayText: {
        fontSize: 14,
        fontWeight: '600',
    },
    dayIndicator: {
        width: 4,
        height: 4,
        borderRadius: 2,
        position: 'absolute',
        bottom: 4,
    },
    appointmentsSection: {
        marginBottom: 24,
    },
    appointmentsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    appointmentsTitle: {
        fontSize: 16,
        fontWeight: '700',
    },
    addButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    appointmentCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        borderRadius: 12,
        marginBottom: 8,
    },
    appointmentLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 12,
    },
    timeBox: {
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderRadius: 6,
    },
    time: {
        fontSize: 13,
        fontWeight: '700',
    },
    appointmentInfo: {
        flex: 1,
    },
    patientName: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 2,
    },
    appointmentType: {
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
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
        borderRadius: 12,
    },
    emptyStateText: {
        fontSize: 14,
        marginTop: 8,
    },
    actionsSection: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
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
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        gap: 8,
    },
    actionText: {
        fontSize: 12,
        fontWeight: '600',
        textAlign: 'center',
    },
});

export default ProfessionalAgendaScreen;
