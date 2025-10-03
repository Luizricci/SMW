import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { schedules } from '../data/mockData';

const SchedulePage = () => {
    const { user, school } = useAuth();
    const navigation = useNavigation();

    // Buscar horário do aluno atual
    const studentSchedule = schedules.find(schedule => schedule.studentId === user.id);

    const groupScheduleByDay = () => {
        if (!studentSchedule) return {};
        
        const grouped = {};
        studentSchedule.schedule.forEach(item => {
            if (!grouped[item.day]) {
                grouped[item.day] = [];
            }
            grouped[item.day].push(item);
        });
        return grouped;
    };

    const getDayColor = (day) => {
        const colors = {
            'Segunda-feira': '#3b82f6',
            'Terça-feira': '#10b981',
            'Quarta-feira': '#f59e0b',
            'Quinta-feira': '#8b5cf6',
            'Sexta-feira': '#ef4444'
        };
        return colors[day] || '#64748b';
    };

    const groupedSchedule = groupScheduleByDay();

    if (!studentSchedule) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity 
                        style={styles.backButton} 
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.backButtonText}>← Voltar</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Grade de Horários</Text>
                </View>
                
                <View style={styles.noDataContainer}>
                    <Text style={styles.noDataIcon}>📅</Text>
                    <Text style={styles.noDataTitle}>Horários não encontrados</Text>
                    <Text style={styles.noDataText}>
                        Não foi possível encontrar a grade de horários para este aluno.
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton} 
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.backButtonText}>← Voltar</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Grade de Horários</Text>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Student Info */}
                <View style={styles.studentCard}>
                    <Text style={styles.studentName}>{user?.name}</Text>
                    <Text style={styles.studentClass}>{studentSchedule.className}</Text>
                    <Text style={styles.schoolName}>{school?.name}</Text>
                </View>

                {/* Schedule by Day */}
                <View style={styles.scheduleSection}>
                    <Text style={styles.sectionTitle}>Horários por Dia</Text>
                    
                    {Object.keys(groupedSchedule).map(day => (
                        <View key={day} style={styles.dayContainer}>
                            <View style={[styles.dayHeader, { backgroundColor: getDayColor(day) }]}>
                                <Text style={styles.dayTitle}>{day}</Text>
                            </View>
                            
                            <View style={styles.classesContainer}>
                                {groupedSchedule[day].map((classItem, index) => (
                                    <View key={index} style={styles.classCard}>
                                        <View style={styles.timeContainer}>
                                            <Text style={styles.timeText}>{classItem.time}</Text>
                                        </View>
                                        <View style={styles.classInfo}>
                                            <Text style={styles.subjectName}>{classItem.subject}</Text>
                                            <Text style={styles.teacherName}>{classItem.teacher}</Text>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </View>
                    ))}
                </View>

                {/* Quick Info */}
                <View style={styles.infoSection}>
                    <View style={styles.infoCard}>
                        <Text style={styles.infoTitle}>📚 Informações Gerais</Text>
                        <Text style={styles.infoText}>
                            • Horário de funcionamento: 7h30 às 11h10{'\n'}
                            • Intervalo: 9h10 às 9h30{'\n'}
                            • Aulas têm duração de 50 minutos{'\n'}
                            • Tolerância para atraso: 10 minutos
                        </Text>
                    </View>

                    <View style={styles.infoCard}>
                        <Text style={styles.infoTitle}>⚠️ Lembretes</Text>
                        <Text style={styles.infoText}>
                            • Sempre chegue com antecedência{'\n'}
                            • Traga todo material necessário{'\n'}
                            • Respeite os horários de entrada e saída{'\n'}
                            • Comunique ausências antecipadamente
                        </Text>
                    </View>
                </View>

                {/* Weekly Summary */}
                <View style={styles.summaryCard}>
                    <Text style={styles.summaryTitle}>Resumo Semanal</Text>
                    <View style={styles.summaryGrid}>
                        <View style={styles.summaryItem}>
                            <Text style={styles.summaryValue}>
                                {Object.values(groupedSchedule).flat().length}
                            </Text>
                            <Text style={styles.summaryLabel}>Aulas por Semana</Text>
                        </View>
                        <View style={styles.summaryItem}>
                            <Text style={styles.summaryValue}>
                                {Object.keys(groupedSchedule).length}
                            </Text>
                            <Text style={styles.summaryLabel}>Dias Letivos</Text>
                        </View>
                        <View style={styles.summaryItem}>
                            <Text style={styles.summaryValue}>7h30</Text>
                            <Text style={styles.summaryLabel}>Primeira Aula</Text>
                        </View>
                        <View style={styles.summaryItem}>
                            <Text style={styles.summaryValue}>11h10</Text>
                            <Text style={styles.summaryLabel}>Última Aula</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    header: {
        backgroundColor: '#1e3a5f',
        paddingTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        marginRight: 16,
    },
    backButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '500',
    },
    headerTitle: {
        color: '#ffffff',
        fontSize: 20,
        fontWeight: 'bold',
        flex: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    studentCard: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 16,
        marginBottom: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    studentName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1e3a5f',
        marginBottom: 4,
    },
    studentClass: {
        fontSize: 16,
        color: '#64748b',
        marginBottom: 2,
    },
    schoolName: {
        fontSize: 14,
        color: '#94a3b8',
    },
    scheduleSection: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1e3a5f',
        marginBottom: 16,
    },
    dayContainer: {
        marginBottom: 20,
        backgroundColor: 'white',
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    dayHeader: {
        padding: 16,
        alignItems: 'center',
    },
    dayTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    classesContainer: {
        padding: 16,
    },
    classCard: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    timeContainer: {
        width: 80,
        marginRight: 16,
    },
    timeText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#64748b',
        textAlign: 'center',
    },
    classInfo: {
        flex: 1,
    },
    subjectName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1e3a5f',
        marginBottom: 2,
    },
    teacherName: {
        fontSize: 14,
        color: '#64748b',
    },
    summaryCard: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 16,
        marginBottom: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    summaryTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1e3a5f',
        marginBottom: 16,
        textAlign: 'center',
    },
    summaryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    summaryItem: {
        width: '48%',
        alignItems: 'center',
        marginBottom: 16,
    },
    summaryValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#3b82f6',
        marginBottom: 4,
    },
    summaryLabel: {
        fontSize: 12,
        color: '#64748b',
        textAlign: 'center',
    },
    infoSection: {
        marginBottom: 20,
    },
    infoCard: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 16,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1e3a5f',
        marginBottom: 12,
    },
    infoText: {
        fontSize: 14,
        color: '#64748b',
        lineHeight: 20,
    },
    noDataContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    noDataIcon: {
        fontSize: 64,
        marginBottom: 20,
    },
    noDataTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1e3a5f',
        marginBottom: 16,
        textAlign: 'center',
    },
    noDataText: {
        fontSize: 16,
        color: '#64748b',
        textAlign: 'center',
        lineHeight: 24,
    },
});

export default SchedulePage;