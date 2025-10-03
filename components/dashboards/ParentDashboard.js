import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import Card from '../Card';

const ParentDashboard = () => {
    const { user, school, getChildren, isBulletinReleased, isEnrollmentOpen } = useAuth();
    const navigation = useNavigation();
    const children = getChildren();

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
            title: 'Frequência',
            subtitle: 'Ver faltas',
            onPress: () => navigation.navigate('Attendance')
        },
        {
            id: 3,
            icon: '💰',
            title: 'Boletos',
            subtitle: 'Mensalidades',
            onPress: () => navigation.navigate('Bills')
        },
        {
            id: 4,
            icon: '📝',
            title: 'Rematrícula',
            subtitle: isEnrollmentOpen() ? 'Período aberto' : 'Fora do período',
            onPress: () => isEnrollmentOpen() && navigation.navigate('Enrollment'),
            disabled: !isEnrollmentOpen()
        },
        {
            id: 5,
            icon: '📅',
            title: 'Horários',
            subtitle: 'Grade curricular',
            onPress: () => navigation.navigate('Schedule')
        },
        {
            id: 6,
            icon: '📢',
            title: 'Comunicados',
            subtitle: 'Avisos da escola',
            onPress: () => navigation.navigate('Announcements')
        }
    ];

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Welcome Section */}
            <View style={styles.welcomeSection}>
                <Text style={styles.welcomeTitle}>Olá, {user?.name}! 👨‍👩‍👧‍👦</Text>
                <View style={styles.parentInfo}>
                    <Text style={styles.schoolName}>{school?.name}</Text>
                    <Text style={styles.roleText}>Portal dos Pais</Text>
                </View>
            </View>

            {/* Children Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Seus Filhos</Text>
                {children.map(child => (
                    <View key={child.id} style={styles.childCard}>
                        <View style={styles.childInfo}>
                            <Text style={styles.childName}>{child.name}</Text>
                            <Text style={styles.childClass}>{child.class}</Text>
                            <Text style={styles.childRegistration}>Matrícula: {child.registration}</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.viewChildButton}
                            onPress={() => navigation.navigate('StudentDetails', { studentId: child.id })}
                        >
                            <Text style={styles.viewChildButtonText}>Ver Detalhes</Text>
                        </TouchableOpacity>
                    </View>
                ))}
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
                    title="Portal dos Pais"
                    content="Acompanhe o desempenho escolar dos seus filhos, acesse boletos, realize rematrículas e mantenha-se informado sobre os comunicados da escola."
                />

                {!isBulletinReleased() && (
                    <Card
                        title="⏳ Boletim em Análise"
                        content="As notas do 1º bimestre estão sendo finalizadas pelos professores. O boletim será liberado em breve."
                    />
                )}

                <Card
                    title="💡 Dicas Importantes"
                    content="• Verifique regularmente os comunicados da escola
• Mantenha seus dados de contato atualizados  
• Acompanhe a frequência do seu filho
• Não deixe para renovar a matrícula no último dia"
                />

                {isEnrollmentOpen() && (
                    <Card
                        title="🎓 Rematrícula 2026"
                        content="O período de rematrícula para o ano letivo de 2026 está aberto! Garante já a vaga do seu filho para o próximo ano."
                    />
                )}
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
    parentInfo: {
        backgroundColor: '#f1f5f9',
        padding: 16,
        borderRadius: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#10b981',
    },
    schoolName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1e3a5f',
    },
    roleText: {
        fontSize: 14,
        color: '#10b981',
        marginTop: 4,
        fontWeight: '500',
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
    childCard: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    childInfo: {
        flex: 1,
    },
    childName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1e3a5f',
    },
    childClass: {
        fontSize: 14,
        color: '#64748b',
        marginTop: 4,
    },
    childRegistration: {
        fontSize: 12,
        color: '#94a3b8',
        marginTop: 2,
        fontFamily: 'monospace',
    },
    viewChildButton: {
        backgroundColor: '#3b82f6',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    viewChildButtonText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
    },
    quickActions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    quickActionCard: {
        backgroundColor: 'white',
        width: '48%',
        padding: 16,
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
        fontSize: 28,
        marginBottom: 8,
    },
    quickActionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1e3a5f',
        textAlign: 'center',
        marginBottom: 4,
    },
    quickActionTitleDisabled: {
        color: '#94a3b8',
    },
    quickActionSubtitle: {
        fontSize: 11,
        color: '#64748b',
        textAlign: 'center',
    },
    quickActionSubtitleDisabled: {
        color: '#cbd5e1',
    },
});

export default ParentDashboard;