import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

const DirectorDashboard = () => {
    const { user, school, schoolConfig } = useAuth();
    const navigation = useNavigation();
    const [bulletinReleased, setBulletinReleased] = useState(schoolConfig?.bulletinReleased || false);
    const [enrollmentOpen, setEnrollmentOpen] = useState(schoolConfig?.enrollmentOpen || false);

    const quickStats = [
        {
            title: 'Total de Alunos',
            value: '847',
            icon: '👥',
            color: '#3b82f6'
        },
        {
            title: 'Mensalidades em Atraso',
            value: '23',
            icon: '⚠️',
            color: '#ef4444'
        },
        {
            title: 'Novas Matrículas',
            value: '156',
            icon: '📝',
            color: '#10b981'
        },
        {
            title: 'Taxa de Frequência',
            value: '96.5%',
            icon: '📊',
            color: '#8b5cf6'
        }
    ];

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Welcome Section */}
            <View style={styles.welcomeSection}>
                <Text style={styles.welcomeTitle}>Painel do Diretor 👨‍💼</Text>
                <View style={styles.directorInfo}>
                    <Text style={styles.directorName}>{user?.name}</Text>
                    <Text style={styles.schoolName}>{school?.name}</Text>
                    <Text style={styles.roleText}>Direção Acadêmica</Text>
                </View>
            </View>

            {/* Quick Stats */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Resumo Geral</Text>
                <View style={styles.statsGrid}>
                    {quickStats.map((stat, index) => (
                        <View key={index} style={styles.statCard}>
                            <View style={[styles.statIcon, { backgroundColor: stat.color + '20' }]}>
                                <Text style={[styles.statIconText, { color: stat.color }]}>
                                    {stat.icon}
                                </Text>
                            </View>
                            <Text style={styles.statValue}>{stat.value}</Text>
                            <Text style={styles.statTitle}>{stat.title}</Text>
                        </View>
                    ))}
                </View>
            </View>

            {/* Control Panel */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Controles do Sistema</Text>
                
                <View style={styles.controlCard}>
                    <View style={styles.controlItem}>
                        <View style={styles.controlInfo}>
                            <Text style={styles.controlTitle}>Liberação do Boletim</Text>
                            <Text style={styles.controlDescription}>
                                {bulletinReleased ? 'Boletim liberado para visualização' : 'Boletim bloqueado para os alunos'}
                            </Text>
                        </View>
                        <Switch
                            value={bulletinReleased}
                            onValueChange={setBulletinReleased}
                            trackColor={{ false: '#cbd5e1', true: '#3b82f6' }}
                            thumbColor={bulletinReleased ? '#ffffff' : '#ffffff'}
                        />
                    </View>
                    
                    <View style={[styles.controlItem, styles.controlItemBorder]}>
                        <View style={styles.controlInfo}>
                            <Text style={styles.controlTitle}>Período de Rematrícula</Text>
                            <Text style={styles.controlDescription}>
                                {enrollmentOpen ? 'Rematrículas abertas para 2026' : 'Período de rematrícula fechado'}
                            </Text>
                        </View>
                        <Switch
                            value={enrollmentOpen}
                            onValueChange={setEnrollmentOpen}
                            trackColor={{ false: '#cbd5e1', true: '#10b981' }}
                            thumbColor={enrollmentOpen ? '#ffffff' : '#ffffff'}
                        />
                    </View>
                </View>
            </View>

            {/* Communications Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Comunicação</Text>
                <TouchableOpacity
                    style={styles.communicationCard}
                    onPress={() => navigation.navigate('SendAnnouncements')}
                >
                    <Text style={styles.communicationIcon}>📢</Text>
                    <Text style={styles.communicationTitle}>Comunicados</Text>
                    <Text style={styles.communicationSubtitle}>Enviar avisos</Text>
                </TouchableOpacity>
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
    directorInfo: {
        backgroundColor: '#f1f5f9',
        padding: 16,
        borderRadius: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#8b5cf6',
    },
    directorName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1e3a5f',
    },
    schoolName: {
        fontSize: 14,
        color: '#64748b',
        marginTop: 2,
    },
    roleText: {
        fontSize: 12,
        color: '#8b5cf6',
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
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    statCard: {
        backgroundColor: 'white',
        width: '48%',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    statIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    statIconText: {
        fontSize: 20,
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1e3a5f',
        marginBottom: 4,
    },
    statTitle: {
        fontSize: 12,
        color: '#64748b',
        textAlign: 'center',
    },
    controlCard: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    controlItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
    },
    controlItemBorder: {
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
        marginTop: 12,
        paddingTop: 20,
    },
    controlInfo: {
        flex: 1,
        marginRight: 16,
    },
    controlTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1e3a5f',
        marginBottom: 4,
    },
    controlDescription: {
        fontSize: 14,
        color: '#64748b',
    },
    communicationCard: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 16,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    communicationIcon: {
        fontSize: 32,
        marginBottom: 12,
    },
    communicationTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1e3a5f',
        textAlign: 'center',
        marginBottom: 4,
    },
    communicationSubtitle: {
        fontSize: 12,
        color: '#64748b',
        textAlign: 'center',
    },
});

export default DirectorDashboard;