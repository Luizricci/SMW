import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import Card from '../Card';

const StudentDashboard = () => {
    const { user, school, isBulletinReleased } = useAuth();
    const navigation = useNavigation();

    const quickActions = [
        {
            id: 1,
            icon: '📚',
            title: 'Boletim',
            subtitle: isBulletinReleased() ? 'Disponível' : 'Aguardando liberação',
            onPress: () => isBulletinReleased() && navigation.navigate('Bulletin'),
            disabled: !isBulletinReleased()
        },
        {
            id: 2,
            icon: '📊',
            title: 'Faltas',
            subtitle: 'Ver frequência',
            onPress: () => navigation.navigate('Attendance')
        },
        {
            id: 3,
            icon: '📅',
            title: 'Horários',
            subtitle: 'Grade curricular',
            onPress: () => navigation.navigate('Schedule')
        },
        {
            id: 4,
            icon: '📢',
            title: 'Avisos',
            subtitle: 'Comunicados',
            onPress: () => navigation.navigate('Announcements')
        }
    ];

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Welcome Section */}
            <View style={styles.welcomeSection}>
                <Text style={styles.welcomeTitle}>Olá, {user?.name}! 👋</Text>
                <View style={styles.studentInfo}>
                    <Text style={styles.studentClass}>{user?.class}</Text>
                    <Text style={styles.studentSchool}>{school?.name}</Text>
                    <Text style={styles.studentRegistration}>Matrícula: {user?.registration}</Text>
                </View>
            </View>

            {/* Quick Actions */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Acesso Rápido</Text>
                <View style={styles.quickActions}>
                    {quickActions.map(action => (
                        <TouchableOpacity
                            key={action.id}
                            style={[
                                styles.quickActionCard,
                                action.disabled && styles.quickActionDisabled
                            ]}
                            onPress={action.onPress}
                            disabled={action.disabled}
                        >
                            <Text style={styles.quickActionIcon}>{action.icon}</Text>
                            <Text style={[
                                styles.quickActionTitle,
                                action.disabled && styles.quickActionTitleDisabled
                            ]}>
                                {action.title}
                            </Text>
                            <Text style={[
                                styles.quickActionSubtitle,
                                action.disabled && styles.quickActionSubtitleDisabled
                            ]}>
                                {action.subtitle}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Information Cards */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Informações</Text>
                
                <Card
                    title="Bem-vindo ao Portal do Aluno"
                    content="Aqui você pode acessar suas notas, verificar sua frequência e acompanhar os comunicados da escola."
                />

                {!isBulletinReleased() && (
                    <Card
                        title="⚠️ Atenção"
                        content="O boletim do 1º bimestre ainda não foi liberado pela direção. Você será notificado quando estiver disponível."
                    />
                )}

                <Card
                    title="📅 Próximos Eventos"
                    content="• Avaliação de Matemática - 05/10/2025
• Feira de Ciências - 12/10/2025  
• Reunião de Pais - 20/10/2025"
                />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    welcomeSection: {
        backgroundColor: 'white',
        margin: 16,
        padding: 20,
        borderRadius: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    welcomeTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1e3a5f',
        marginBottom: 12,
    },
    studentInfo: {
        backgroundColor: '#f1f5f9',
        padding: 16,
        borderRadius: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#3b82f6',
    },
    studentClass: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1e3a5f',
    },
    studentSchool: {
        fontSize: 14,
        color: '#64748b',
        marginTop: 4,
    },
    studentRegistration: {
        fontSize: 12,
        color: '#94a3b8',
        marginTop: 4,
        fontFamily: 'monospace',
    },
    section: {
        marginHorizontal: 16,
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1e3a5f',
        marginBottom: 16,
    },
    quickActions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    quickActionCard: {
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
    quickActionDisabled: {
        backgroundColor: '#f8fafc',
        opacity: 0.6,
    },
    quickActionIcon: {
        fontSize: 32,
        marginBottom: 8,
    },
    quickActionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1e3a5f',
        textAlign: 'center',
        marginBottom: 4,
    },
    quickActionTitleDisabled: {
        color: '#94a3b8',
    },
    quickActionSubtitle: {
        fontSize: 12,
        color: '#64748b',
        textAlign: 'center',
    },
    quickActionSubtitleDisabled: {
        color: '#cbd5e1',
    },
});

export default StudentDashboard;