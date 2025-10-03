import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { grades } from '../data/mockData';
import { SecureFilterSelect } from '../components/SecureSearchInput';

const BulletinPage = () => {
    const { user, school, isBulletinReleased } = useAuth();
    const navigation = useNavigation();
    
    // Estados para filtros seguros
    const [subjectFilter, setSubjectFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const getGradeColor = (grade) => {
        if (grade >= 9.0) return '#10b981'; // Verde
        if (grade >= 7.0) return '#3b82f6'; // Azul
        if (grade >= 5.0) return '#f59e0b'; // Amarelo
        return '#ef4444'; // Vermelho
    };

    const getGradeStatus = (grade) => {
        if (grade >= 7.0) return 'Aprovado';
        if (grade >= 5.0) return 'Recuperação';
        return 'Reprovado';
    };

    // Buscar notas do aluno atual ou do filho selecionado
    let studentGrades = grades.filter(grade => grade.studentId === user.id);

    // Aplicar filtros seguros
    if (subjectFilter) {
        studentGrades = studentGrades.filter(grade => 
            grade.subject === subjectFilter
        );
    }

    if (statusFilter) {
        studentGrades = studentGrades.filter(grade => {
            const status = getGradeStatus(grade.grade);
            return status === statusFilter;
        });
    }

    const calculateAverage = () => {
        if (studentGrades.length === 0) return 0;
        const sum = studentGrades.reduce((acc, grade) => acc + grade.grade, 0);
        return (sum / studentGrades.length).toFixed(1);
    };

    if (!isBulletinReleased()) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity 
                        style={styles.backButton} 
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.backButtonText}>← Voltar</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Boletim Escolar</Text>
                </View>
                
                <View style={styles.notReleasedContainer}>
                    <Text style={styles.notReleasedIcon}>⏳</Text>
                    <Text style={styles.notReleasedTitle}>Boletim não liberado</Text>
                    <Text style={styles.notReleasedText}>
                        As notas do 1º bimestre ainda estão sendo finalizadas pelos professores. 
                        O boletim será liberado em breve pela direção.
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
                <Text style={styles.headerTitle}>Boletim Escolar</Text>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Student Info */}
                <View style={styles.studentCard}>
                    <Text style={styles.studentName}>{user?.name}</Text>
                    <Text style={styles.studentClass}>{user?.class}</Text>
                    <Text style={styles.schoolName}>{school?.name}</Text>
                    <View style={styles.divider} />
                    <View style={styles.averageSection}>
                        <Text style={styles.averageLabel}>Média Geral:</Text>
                        <Text style={[
                            styles.averageValue,
                            { color: getGradeColor(parseFloat(calculateAverage())) }
                        ]}>
                            {calculateAverage()}
                        </Text>
                    </View>
                </View>

                {/* Grades */}
                <View style={styles.gradesSection}>
                    <Text style={styles.sectionTitle}>Notas - 1º Bimestre 2025</Text>
                    
                    {studentGrades.length === 0 ? (
                        <View style={styles.noGradesCard}>
                            <Text style={styles.noGradesText}>Nenhuma nota encontrada</Text>
                        </View>
                    ) : (
                        studentGrades.map((gradeItem, index) => (
                            <View key={index} style={styles.gradeCard}>
                                <View style={styles.gradeHeader}>
                                    <Text style={styles.subjectName}>{gradeItem.subject}</Text>
                                    <View style={[
                                        styles.gradeChip,
                                        { backgroundColor: getGradeColor(gradeItem.grade) + '20' }
                                    ]}>
                                        <Text style={[
                                            styles.gradeValue,
                                            { color: getGradeColor(gradeItem.grade) }
                                        ]}>
                                            {gradeItem.grade.toFixed(1)}
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.gradeDetails}>
                                    <Text style={styles.gradeQuarter}>{gradeItem.quarter}</Text>
                                    <Text style={[
                                        styles.gradeStatus,
                                        { color: getGradeColor(gradeItem.grade) }
                                    ]}>
                                        {getGradeStatus(gradeItem.grade)}
                                    </Text>
                                </View>
                            </View>
                        ))
                    )}
                </View>

                {/* Legend */}
                <View style={styles.legendSection}>
                    <Text style={styles.legendTitle}>Legenda</Text>
                    <View style={styles.legendGrid}>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendColor, { backgroundColor: '#10b981' }]} />
                            <Text style={styles.legendText}>9.0 - 10.0: Excelente</Text>
                        </View>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendColor, { backgroundColor: '#3b82f6' }]} />
                            <Text style={styles.legendText}>7.0 - 8.9: Bom</Text>
                        </View>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendColor, { backgroundColor: '#f59e0b' }]} />
                            <Text style={styles.legendText}>5.0 - 6.9: Recuperação</Text>
                        </View>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendColor, { backgroundColor: '#ef4444' }]} />
                            <Text style={styles.legendText}>0.0 - 4.9: Insuficiente</Text>
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
        marginBottom: 16,
    },
    divider: {
        height: 1,
        backgroundColor: '#e5e7eb',
        marginBottom: 16,
    },
    averageSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    averageLabel: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1e3a5f',
    },
    averageValue: {
        fontSize: 32,
        fontWeight: 'bold',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1e3a5f',
        marginBottom: 16,
    },
    gradesSection: {
        marginBottom: 24,
    },
    gradeCard: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    gradeHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    subjectName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1e3a5f',
        flex: 1,
    },
    gradeChip: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
    },
    gradeValue: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    gradeDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    gradeQuarter: {
        fontSize: 14,
        color: '#64748b',
    },
    gradeStatus: {
        fontSize: 14,
        fontWeight: '600',
    },
    noGradesCard: {
        backgroundColor: 'white',
        padding: 40,
        borderRadius: 12,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    noGradesText: {
        fontSize: 16,
        color: '#64748b',
        textAlign: 'center',
    },
    notReleasedContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    notReleasedIcon: {
        fontSize: 64,
        marginBottom: 20,
    },
    notReleasedTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1e3a5f',
        marginBottom: 16,
        textAlign: 'center',
    },
    notReleasedText: {
        fontSize: 16,
        color: '#64748b',
        textAlign: 'center',
        lineHeight: 24,
    },
    legendSection: {
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
});

export default BulletinPage;