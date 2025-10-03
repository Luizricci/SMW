import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { attendance } from '../data/mockData';

const AttendancePage = () => {
    const { user, school } = useAuth();
    const navigation = useNavigation();

    // Buscar dados de frequência do aluno atual
    const studentAttendance = attendance.find(att => att.studentId === user.id);

    const getAttendanceColor = (rate) => {
        if (rate >= 95) return '#10b981'; // Verde
        if (rate >= 85) return '#f59e0b'; // Amarelo
        return '#ef4444'; // Vermelho
    };

    const getAttendanceStatus = (rate) => {
        if (rate >= 75) return 'Regular';
        return 'Irregular';
    };

    if (!studentAttendance) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity 
                        style={styles.backButton} 
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.backButtonText}>← Voltar</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Frequência</Text>
                </View>
                
                <View style={styles.noDataContainer}>
                    <Text style={styles.noDataIcon}>📊</Text>
                    <Text style={styles.noDataTitle}>Dados não encontrados</Text>
                    <Text style={styles.noDataText}>
                        Não foi possível encontrar dados de frequência para este aluno.
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
                <Text style={styles.headerTitle}>Frequência Escolar</Text>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Student Info */}
                <View style={styles.studentCard}>
                    <Text style={styles.studentName}>{user?.name}</Text>
                    <Text style={styles.studentClass}>{user?.class}</Text>
                    <Text style={styles.schoolName}>{school?.name}</Text>
                </View>

                {/* Attendance Summary */}
                <View style={styles.summaryCard}>
                    <Text style={styles.summaryTitle}>Resumo de Frequência</Text>
                    
                    <View style={styles.attendanceCircle}>
                        <Text style={[
                            styles.attendancePercentage,
                            { color: getAttendanceColor(studentAttendance.attendanceRate) }
                        ]}>
                            {studentAttendance.attendanceRate}%
                        </Text>
                        <Text style={styles.attendanceLabel}>Frequência</Text>
                    </View>

                    <View style={styles.statsGrid}>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{studentAttendance.totalClasses}</Text>
                            <Text style={styles.statLabel}>Total de Aulas</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={[styles.statValue, { color: '#10b981' }]}>
                                {studentAttendance.attendedClasses}
                            </Text>
                            <Text style={styles.statLabel}>Presenças</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={[styles.statValue, { color: '#ef4444' }]}>
                                {studentAttendance.absences}
                            </Text>
                            <Text style={styles.statLabel}>Faltas</Text>
                        </View>
                    </View>

                    <View style={styles.statusSection}>
                        <Text style={styles.statusLabel}>Situação:</Text>
                        <Text style={[
                            styles.statusValue,
                            { 
                                color: getAttendanceColor(studentAttendance.attendanceRate),
                                backgroundColor: getAttendanceColor(studentAttendance.attendanceRate) + '20'
                            }
                        ]}>
                            {getAttendanceStatus(studentAttendance.attendanceRate)}
                        </Text>
                    </View>
                </View>

                {/* Progress Bar */}
                <View style={styles.progressCard}>
                    <Text style={styles.progressTitle}>Progresso Visual</Text>
                    
                    <View style={styles.progressContainer}>
                        <View style={styles.progressBackground}>
                            <View style={[
                                styles.progressFill,
                                { 
                                    width: `${studentAttendance.attendanceRate}%`,
                                    backgroundColor: getAttendanceColor(studentAttendance.attendanceRate)
                                }
                            ]} />
                        </View>
                        <Text style={styles.progressText}>
                            {studentAttendance.attendedClasses} de {studentAttendance.totalClasses} aulas
                        </Text>
                    </View>
                </View>

                {/* Alerts and Warnings */}
                {studentAttendance.attendanceRate < 85 && (
                    <View style={styles.warningCard}>
                        <Text style={styles.warningIcon}>⚠️</Text>
                        <View style={styles.warningContent}>
                            <Text style={styles.warningTitle}>Atenção!</Text>
                            <Text style={styles.warningText}>
                                {studentAttendance.attendanceRate < 75 
                                    ? 'Sua frequência está abaixo do mínimo exigido (75%). É necessário melhorar a assiduidade para evitar reprova'
                                    : 'Sua frequência está baixa. Procure manter uma presença mais regular nas aulas.'
                                }
                            </Text>
                        </View>
                    </View>
                )}

                {/* Information Cards */}
                <View style={styles.infoSection}>
                    <View style={styles.infoCard}>
                        <Text style={styles.infoTitle}>📋 Informações Importantes</Text>
                        <Text style={styles.infoText}>
                            • Frequência mínima exigida: 75%{'\n'}
                            • Faltas justificadas devem ser apresentadas na secretaria{'\n'}
                            • Atestados médicos têm prazo de 48h para entrega{'\n'}
                            • Acompanhe sua frequência regularmente
                        </Text>
                    </View>

                    <View style={styles.infoCard}>
                        <Text style={styles.infoTitle}>💡 Dicas</Text>
                        <Text style={styles.infoText}>
                            • Chegue sempre no horário das aulas{'\n'}
                            • Comunique faltas antecipadamente{'\n'}
                            • Mantenha contato com os professores{'\n'}
                            • Organize sua agenda para não perder aulas importantes
                        </Text>
                    </View>
                </View>

                {/* Legend */}
                <View style={styles.legendCard}>
                    <Text style={styles.legendTitle}>Legenda de Status</Text>
                    <View style={styles.legendGrid}>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendColor, { backgroundColor: '#10b981' }]} />
                            <Text style={styles.legendText}>95% ou mais: Excelente</Text>
                        </View>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendColor, { backgroundColor: '#f59e0b' }]} />
                            <Text style={styles.legendText}>85% - 94%: Atenção</Text>
                        </View>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendColor, { backgroundColor: '#ef4444' }]} />
                            <Text style={styles.legendText}>Abaixo de 85%: Crítico</Text>
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
    summaryCard: {
        backgroundColor: 'white',
        padding: 24,
        borderRadius: 16,
        marginBottom: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        alignItems: 'center',
    },
    summaryTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1e3a5f',
        marginBottom: 20,
    },
    attendanceCircle: {
        alignItems: 'center',
        marginBottom: 24,
    },
    attendancePercentage: {
        fontSize: 48,
        fontWeight: 'bold',
    },
    attendanceLabel: {
        fontSize: 16,
        color: '#64748b',
        marginTop: 4,
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 20,
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1e3a5f',
    },
    statLabel: {
        fontSize: 12,
        color: '#64748b',
        marginTop: 4,
        textAlign: 'center',
    },
    statusSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    statusLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1e3a5f',
    },
    statusValue: {
        fontSize: 16,
        fontWeight: 'bold',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
    },
    progressCard: {
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
    progressTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1e3a5f',
        marginBottom: 16,
    },
    progressContainer: {
        alignItems: 'center',
    },
    progressBackground: {
        width: '100%',
        height: 8,
        backgroundColor: '#e5e7eb',
        borderRadius: 4,
        marginBottom: 8,
    },
    progressFill: {
        height: '100%',
        borderRadius: 4,
    },
    progressText: {
        fontSize: 14,
        color: '#64748b',
    },
    warningCard: {
        backgroundColor: '#fef3c7',
        padding: 16,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 20,
        borderLeftWidth: 4,
        borderLeftColor: '#f59e0b',
    },
    warningIcon: {
        fontSize: 24,
        marginRight: 12,
    },
    warningContent: {
        flex: 1,
    },
    warningTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#92400e',
        marginBottom: 4,
    },
    warningText: {
        fontSize: 14,
        color: '#92400e',
        lineHeight: 20,
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
    legendCard: {
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
    legendTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1e3a5f',
        marginBottom: 16,
    },
    legendGrid: {
        gap: 12,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    legendColor: {
        width: 16,
        height: 16,
        borderRadius: 8,
        marginRight: 12,
    },
    legendText: {
        fontSize: 14,
        color: '#64748b',
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

export default AttendancePage;