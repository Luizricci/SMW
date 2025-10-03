import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import { users } from '../data/mockData';

const StudentDetailsPage = () => {
    const { user, school } = useAuth();
    const navigation = useNavigation();
    const route = useRoute();
    const { studentId } = route.params;

    // Buscar dados do estudante
    const student = users.find(u => u.id === studentId);

    if (!student) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity 
                        style={styles.backButton} 
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.backButtonText}>← Voltar</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Detalhes do Aluno</Text>
                </View>
                
                <View style={styles.errorContainer}>
                    <Text style={styles.errorIcon}>👤</Text>
                    <Text style={styles.errorTitle}>Aluno não encontrado</Text>
                    <Text style={styles.errorText}>
                        Não foi possível encontrar os dados deste aluno.
                    </Text>
                </View>
            </View>
        );
    }

    const quickActions = [
        {
            id: 1,
            icon: '📚',
            title: 'Ver Boletim',
            onPress: () => navigation.navigate('Bulletin')
        },
        {
            id: 2,
            icon: '📊',
            title: 'Ver Frequência',
            onPress: () => navigation.navigate('Attendance')
        },
        {
            id: 3,
            icon: '💰',
            title: 'Ver Boletos',
            onPress: () => navigation.navigate('Bills')
        },
        {
            id: 4,
            icon: '📅',
            title: 'Ver Horários',
            onPress: () => navigation.navigate('Schedule')
        }
    ];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton} 
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.backButtonText}>← Voltar</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Detalhes do Aluno</Text>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Student Profile */}
                <View style={styles.profileCard}>
                    <View style={styles.profileHeader}>
                        <View style={styles.avatarContainer}>
                            <Text style={styles.avatarText}>
                                {student.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </Text>
                        </View>
                        <View style={styles.profileInfo}>
                            <Text style={styles.studentName}>{student.name}</Text>
                            <Text style={styles.studentClass}>{student.class}</Text>
                            <Text style={styles.schoolName}>{school?.name}</Text>
                        </View>
                    </View>
                    
                    <View style={styles.profileDetails}>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Matrícula:</Text>
                            <Text style={styles.detailValue}>{student.registration}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Email:</Text>
                            <Text style={styles.detailValue}>{student.email}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Data de Nascimento:</Text>
                            <Text style={styles.detailValue}>
                                {new Date(student.birthDate).toLocaleDateString('pt-BR')}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Quick Actions */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Acesso Rápido</Text>
                    <View style={styles.actionsGrid}>
                        {quickActions.map(action => (
                            <TouchableOpacity
                                key={action.id}
                                style={styles.actionCard}
                                onPress={action.onPress}
                            >
                                <Text style={styles.actionIcon}>{action.icon}</Text>
                                <Text style={styles.actionTitle}>{action.title}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Information Cards */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Informações</Text>
                    
                    <View style={styles.infoCard}>
                        <Text style={styles.infoTitle}>📋 Sobre este Aluno</Text>
                        <Text style={styles.infoText}>
                            {student.name} está matriculado(a) na turma {student.class} da {school?.name}. 
                            Como responsável, você pode acompanhar todo o desenvolvimento acadêmico, 
                            financeiro e administrativo através deste portal.
                        </Text>
                    </View>

                    <View style={styles.infoCard}>
                        <Text style={styles.infoTitle}>📞 Contato de Emergência</Text>
                        <Text style={styles.infoText}>
                            Em caso de emergência, a escola entrará em contato através dos dados 
                            cadastrados. Mantenha sempre suas informações atualizadas na secretaria.
                        </Text>
                    </View>
                </View>

                {/* Parent Info */}
                <View style={styles.parentCard}>
                    <Text style={styles.parentTitle}>Responsável</Text>
                    <Text style={styles.parentName}>{user.name}</Text>
                    <Text style={styles.parentContact}>{user.email}</Text>
                    <Text style={styles.parentContact}>{user.phone}</Text>
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
    profileCard: {
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
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    avatarContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#3b82f6',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    avatarText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    profileInfo: {
        flex: 1,
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
    profileDetails: {
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
        paddingTop: 16,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    detailLabel: {
        fontSize: 14,
        color: '#64748b',
        fontWeight: '500',
    },
    detailValue: {
        fontSize: 14,
        color: '#1e3a5f',
        fontWeight: '600',
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1e3a5f',
        marginBottom: 16,
    },
    actionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    actionCard: {
        backgroundColor: 'white',
        width: '48%',
        padding: 20,
        borderRadius: 16,
        alignItems: 'center',
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    actionIcon: {
        fontSize: 32,
        marginBottom: 8,
    },
    actionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1e3a5f',
        textAlign: 'center',
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
    parentCard: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 16,
        marginBottom: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        borderLeftWidth: 4,
        borderLeftColor: '#10b981',
    },
    parentTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1e3a5f',
        marginBottom: 8,
    },
    parentName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#10b981',
        marginBottom: 4,
    },
    parentContact: {
        fontSize: 14,
        color: '#64748b',
        marginBottom: 2,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    errorIcon: {
        fontSize: 64,
        marginBottom: 20,
    },
    errorTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1e3a5f',
        marginBottom: 16,
        textAlign: 'center',
    },
    errorText: {
        fontSize: 16,
        color: '#64748b',
        textAlign: 'center',
        lineHeight: 24,
    },
});

export default StudentDetailsPage;