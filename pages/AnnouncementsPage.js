import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { announcements } from '../data/mockData';
import { SecureSearchInput, SecureFilterSelect } from '../components/SecureSearchInput';

const AnnouncementsPage = () => {
    const { user, school } = useAuth();
    const navigation = useNavigation();
    
    // Estados para busca e filtros seguros
    const [searchTerm, setSearchTerm] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('');

    // Filtrar comunicados da escola do usuário e por tipo de usuário
    let userAnnouncements = announcements.filter(announcement => 
        announcement.schoolId === user.schoolId && 
        announcement.targetAudience.includes(user.type)
    );

    // Aplicar busca segura
    if (searchTerm) {
        userAnnouncements = userAnnouncements.filter(announcement =>
            announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            announcement.content.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    // Aplicar filtro de prioridade
    if (priorityFilter) {
        userAnnouncements = userAnnouncements.filter(announcement =>
            announcement.priority === priorityFilter
        );
    }

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return '#ef4444';
            case 'medium': return '#f59e0b';
            case 'low': return '#10b981';
            default: return '#64748b';
        }
    };

    const getPriorityLabel = (priority) => {
        switch (priority) {
            case 'high': return 'URGENTE';
            case 'medium': return 'IMPORTANTE';
            case 'low': return 'INFORMATIVO';
            default: return 'GERAL';
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const getTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) return 'Ontem';
        if (diffDays <= 7) return `${diffDays} dias atrás`;
        if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} semanas atrás`;
        return `${Math.ceil(diffDays / 30)} meses atrás`;
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton} 
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.backButtonText}>← Voltar</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Comunicados</Text>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* School Info */}
                <View style={styles.schoolCard}>
                    <Text style={styles.schoolName}>{school?.name}</Text>
                    <Text style={styles.userRole}>
                        {user.type === 'student' && 'Portal do Aluno'}
                        {user.type === 'parent' && 'Portal dos Pais'}
                        {user.type === 'director' && 'Portal da Direção'}
                    </Text>
                </View>

                {/* Filtros de Busca Seguros */}
                <View style={styles.filtersSection}>
                    <SecureSearchInput
                        placeholder="Buscar comunicados..."
                        value={searchTerm}
                        onChangeText={setSearchTerm}
                        autoSearch={true}
                        onSearch={setSearchTerm}
                        style={styles.searchInput}
                    />
                    
                    <SecureFilterSelect
                        placeholder="Filtrar por prioridade"
                        value={priorityFilter}
                        onSelect={setPriorityFilter}
                        options={[
                            { value: '', label: 'Todas as prioridades' },
                            { value: 'high', label: 'Urgente' },
                            { value: 'medium', label: 'Importante' },
                            { value: 'low', label: 'Informativo' }
                        ]}
                        style={styles.filterSelect}
                    />
                </View>

                {/* Announcements */}
                <View style={styles.announcementsSection}>
                    <Text style={styles.sectionTitle}>
                        Comunicados ({userAnnouncements.length})
                    </Text>
                    
                    {userAnnouncements.length === 0 ? (
                        <View style={styles.noAnnouncementsCard}>
                            <Text style={styles.noAnnouncementsIcon}>📢</Text>
                            <Text style={styles.noAnnouncementsTitle}>Nenhum comunicado</Text>
                            <Text style={styles.noAnnouncementsText}>
                                Não há comunicados disponíveis no momento.
                            </Text>
                        </View>
                    ) : (
                        userAnnouncements
                            .sort((a, b) => new Date(b.date) - new Date(a.date))
                            .map(announcement => (
                            <View key={announcement.id} style={styles.announcementCard}>
                                <View style={styles.announcementHeader}>
                                    <View style={[
                                        styles.priorityBadge,
                                        { backgroundColor: getPriorityColor(announcement.priority) + '20' }
                                    ]}>
                                        <Text style={[
                                            styles.priorityText,
                                            { color: getPriorityColor(announcement.priority) }
                                        ]}>
                                            {getPriorityLabel(announcement.priority)}
                                        </Text>
                                    </View>
                                    <Text style={styles.dateText}>
                                        {formatDate(announcement.date)}
                                    </Text>
                                </View>
                                
                                <Text style={styles.announcementTitle}>
                                    {announcement.title}
                                </Text>
                                
                                <Text style={styles.announcementContent}>
                                    {announcement.content}
                                </Text>
                                
                                <View style={styles.announcementFooter}>
                                    <Text style={styles.authorText}>
                                        Por: {announcement.author}
                                    </Text>
                                    <Text style={styles.timeAgoText}>
                                        {getTimeAgo(announcement.date)}
                                    </Text>
                                </View>
                            </View>
                        ))
                    )}
                </View>

                {/* Information Cards */}
                <View style={styles.infoSection}>
                    <View style={styles.infoCard}>
                        <Text style={styles.infoTitle}>📱 Como receber notificações</Text>
                        <Text style={styles.infoText}>
                            • Mantenha o app sempre atualizado{'\n'}
                            • Ative as notificações push{'\n'}
                            • Verifique regularmente os comunicados{'\n'}
                            • Compartilhe informações importantes com a família
                        </Text>
                    </View>

                    <View style={styles.infoCard}>
                        <Text style={styles.infoTitle}>ℹ️ Tipos de Comunicados</Text>
                        <View style={styles.legendGrid}>
                            <View style={styles.legendItem}>
                                <View style={[styles.legendColor, { backgroundColor: '#ef4444' }]} />
                                <Text style={styles.legendText}>Urgente: Requer ação imediata</Text>
                            </View>
                            <View style={styles.legendItem}>
                                <View style={[styles.legendColor, { backgroundColor: '#f59e0b' }]} />
                                <Text style={styles.legendText}>Importante: Eventos e datas</Text>
                            </View>
                            <View style={styles.legendItem}>
                                <View style={[styles.legendColor, { backgroundColor: '#10b981' }]} />
                                <Text style={styles.legendText}>Informativo: Avisos gerais</Text>
                            </View>
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
    schoolCard: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 16,
        marginBottom: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        alignItems: 'center',
    },
    schoolName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1e3a5f',
        marginBottom: 4,
    },
    userRole: {
        fontSize: 16,
        color: '#64748b',
    },
    announcementsSection: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1e3a5f',
        marginBottom: 16,
    },
    announcementCard: {
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
    announcementHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    priorityBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    priorityText: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    dateText: {
        fontSize: 12,
        color: '#64748b',
    },
    announcementTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1e3a5f',
        marginBottom: 8,
    },
    announcementContent: {
        fontSize: 14,
        color: '#64748b',
        lineHeight: 20,
        marginBottom: 12,
    },
    announcementFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
    },
    authorText: {
        fontSize: 12,
        color: '#94a3b8',
        fontWeight: '500',
    },
    timeAgoText: {
        fontSize: 12,
        color: '#94a3b8',
    },
    noAnnouncementsCard: {
        backgroundColor: 'white',
        padding: 40,
        borderRadius: 16,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    noAnnouncementsIcon: {
        fontSize: 64,
        marginBottom: 16,
    },
    noAnnouncementsTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1e3a5f',
        marginBottom: 8,
    },
    noAnnouncementsText: {
        fontSize: 14,
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
    filtersSection: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 16,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        zIndex: 1,
        position: 'relative',
    },
    searchInput: {
        marginBottom: 12,
    },
    filterSelect: {
        marginBottom: 0,
    },
});

export default AnnouncementsPage;