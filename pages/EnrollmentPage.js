import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { users, schools } from '../data/mockData';
import { SecureSearchInput, SecureFilterSelect } from '../components/SecureSearchInput';

const EnrollmentPage = () => {
    const { user, school, isEnrollmentOpen } = useAuth();
    const navigation = useNavigation();
    
    // Estados para busca e filtros seguros
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    
    // Filhos do usuário (pais)
    const children = users.filter(u => 
        user.childrenIds?.includes(u.id)
    );

    // Status de matrícula mockado
    const enrollmentData = children.map(child => ({
        ...child,
        enrollmentStatus: child.id === 'student-001' ? 'enrolled' : 'pending',
        enrollmentDate: '2025-01-15',
        grade: child.grade || '6º Ano',
        documents: {
            birth_certificate: true,
            address_proof: true,
            vaccination_card: false,
            medical_certificate: true,
            photos: true
        }
    }));

    let filteredEnrollments = enrollmentData;

    // Aplicar busca segura
    if (searchTerm) {
        filteredEnrollments = filteredEnrollments.filter(enrollment =>
            enrollment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            enrollment.grade.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    // Aplicar filtro de status
    if (statusFilter) {
        filteredEnrollments = filteredEnrollments.filter(enrollment =>
            enrollment.enrollmentStatus === statusFilter
        );
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'enrolled': return '#10b981';
            case 'pending': return '#f59e0b';
            case 'rejected': return '#ef4444';
            default: return '#64748b';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'enrolled': return 'Matriculado';
            case 'pending': return 'Pendente';
            case 'rejected': return 'Rejeitado';
            default: return 'Desconhecido';
        }
    };

    const handleNewEnrollment = () => {
        if (!isEnrollmentOpen()) {
            Alert.alert(
                'Período Fechado',
                'O período de matrículas está fechado no momento.',
                [{ text: 'OK' }]
            );
            return;
        }
        
        Alert.alert(
            'Nova Matrícula',
            'Esta funcionalidade estará disponível em breve.',
            [{ text: 'OK' }]
        );
    };

    const handleDocumentUpload = (studentId, docType) => {
        Alert.alert(
            'Upload de Documento',
            `Funcionalidade de upload para ${docType} estará disponível em breve.`,
            [{ text: 'OK' }]
        );
    };

    if (!isEnrollmentOpen()) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity 
                        style={styles.backButton} 
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.backButtonText}>← Voltar</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Matrículas</Text>
                </View>

                <View style={styles.closedContainer}>
                    <Text style={styles.closedIcon}>🔒</Text>
                    <Text style={styles.closedTitle}>Período de Matrículas Fechado</Text>
                    <Text style={styles.closedText}>
                        O período de matrículas para o próximo ano letivo está fechado no momento.
                        Entre em contato com a secretaria da escola para mais informações.
                    </Text>
                    
                    <TouchableOpacity style={styles.contactButton}>
                        <Text style={styles.contactButtonText}>Contatar Secretaria</Text>
                    </TouchableOpacity>
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
                <Text style={styles.headerTitle}>Matrículas</Text>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* School Info */}
                <View style={styles.schoolCard}>
                    <Text style={styles.schoolName}>{school?.name}</Text>
                    <Text style={styles.userRole}>Portal dos Pais - Matrículas</Text>
                    <Text style={styles.enrollmentStatus}>
                        ✅ Período de matrículas: ABERTO
                    </Text>
                </View>

                {/* Filtros de Busca Seguros */}
                <View style={styles.filtersSection}>
                    <SecureSearchInput
                        placeholder="Buscar por nome ou série..."
                        value={searchTerm}
                        onChangeText={setSearchTerm}
                        autoSearch={true}
                        onSearch={setSearchTerm}
                        style={styles.searchInput}
                    />
                    
                    <SecureFilterSelect
                        placeholder="Filtrar por status"
                        value={statusFilter}
                        onSelect={setStatusFilter}
                        options={[
                            { value: '', label: 'Todos os status' },
                            { value: 'enrolled', label: 'Matriculado' },
                            { value: 'pending', label: 'Pendente' },
                            { value: 'rejected', label: 'Rejeitado' }
                        ]}
                        style={styles.filterSelect}
                    />
                </View>

                {/* Nova Matrícula */}
                <TouchableOpacity 
                    style={styles.newEnrollmentCard}
                    onPress={handleNewEnrollment}
                >
                    <Text style={styles.newEnrollmentIcon}>➕</Text>
                    <Text style={styles.newEnrollmentTitle}>Nova Matrícula</Text>
                    <Text style={styles.newEnrollmentText}>
                        Iniciar processo de matrícula para novo aluno
                    </Text>
                </TouchableOpacity>

                {/* Lista de Matrículas */}
                <View style={styles.enrollmentsSection}>
                    <Text style={styles.sectionTitle}>
                        Matrículas dos Filhos ({filteredEnrollments.length})
                    </Text>
                    
                    {filteredEnrollments.map((enrollment) => (
                        <View key={enrollment.id} style={styles.enrollmentCard}>
                            <View style={styles.enrollmentHeader}>
                                <View style={styles.studentInfo}>
                                    <Text style={styles.studentName}>{enrollment.name}</Text>
                                    <Text style={styles.studentGrade}>{enrollment.grade}</Text>
                                </View>
                                <View style={[
                                    styles.statusBadge,
                                    { backgroundColor: getStatusColor(enrollment.enrollmentStatus) }
                                ]}>
                                    <Text style={styles.statusText}>
                                        {getStatusLabel(enrollment.enrollmentStatus)}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.enrollmentDetails}>
                                <Text style={styles.detailLabel}>Data da Matrícula:</Text>
                                <Text style={styles.detailValue}>
                                    {new Date(enrollment.enrollmentDate).toLocaleDateString('pt-BR')}
                                </Text>
                            </View>

                            {/* Documentos */}
                            <View style={styles.documentsSection}>
                                <Text style={styles.documentsTitle}>Documentos Necessários:</Text>
                                
                                {Object.entries(enrollment.documents).map(([docType, uploaded]) => (
                                    <View key={docType} style={styles.documentItem}>
                                        <View style={styles.documentInfo}>
                                            <Text style={styles.documentIcon}>
                                                {uploaded ? '✅' : '❌'}
                                            </Text>
                                            <Text style={styles.documentName}>
                                                {docType.replace('_', ' ').toUpperCase()}
                                            </Text>
                                        </View>
                                        {!uploaded && (
                                            <TouchableOpacity 
                                                style={styles.uploadButton}
                                                onPress={() => handleDocumentUpload(enrollment.id, docType)}
                                            >
                                                <Text style={styles.uploadButtonText}>Upload</Text>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                ))}
                            </View>

                            {enrollment.enrollmentStatus === 'pending' && (
                                <View style={styles.pendingActions}>
                                    <TouchableOpacity style={styles.actionButton}>
                                        <Text style={styles.actionButtonText}>Editar Matrícula</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.actionButton, styles.cancelButton]}>
                                        <Text style={[styles.actionButtonText, styles.cancelButtonText]}>
                                            Cancelar
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    ))}
                </View>

                {/* Informações Importantes */}
                <View style={styles.infoSection}>
                    <Text style={styles.infoTitle}>ℹ️ Informações Importantes</Text>
                    <Text style={styles.infoText}>
                        • O período de matrículas vai até 31/12/2025{'\n'}
                        • Todos os documentos devem ser enviados{'\n'}
                        • Confirmação será enviada por email{'\n'}
                        • Taxa de matrícula: R$ 150,00
                    </Text>
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
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
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
    },
    content: {
        flex: 1,
        padding: 16,
    },
    schoolCard: {
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
    schoolName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1e3a5f',
        marginBottom: 4,
    },
    userRole: {
        fontSize: 14,
        color: '#64748b',
        marginBottom: 8,
    },
    enrollmentStatus: {
        fontSize: 14,
        color: '#10b981',
        fontWeight: '600',
    },
    closedContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    closedIcon: {
        fontSize: 64,
        marginBottom: 16,
    },
    closedTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1e3a5f',
        textAlign: 'center',
        marginBottom: 16,
    },
    closedText: {
        fontSize: 16,
        color: '#64748b',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 32,
    },
    contactButton: {
        backgroundColor: '#1e3a5f',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    contactButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
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
    },
    searchInput: {
        marginBottom: 12,
    },
    filterSelect: {
        marginBottom: 0,
    },
    newEnrollmentCard: {
        backgroundColor: '#eff6ff',
        padding: 20,
        borderRadius: 16,
        marginBottom: 16,
        borderWidth: 2,
        borderColor: '#3b82f6',
        borderStyle: 'dashed',
        alignItems: 'center',
    },
    newEnrollmentIcon: {
        fontSize: 32,
        marginBottom: 8,
    },
    newEnrollmentTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1e3a5f',
        marginBottom: 4,
    },
    newEnrollmentText: {
        fontSize: 14,
        color: '#64748b',
        textAlign: 'center',
    },
    enrollmentsSection: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1e3a5f',
        marginBottom: 12,
    },
    enrollmentCard: {
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
    enrollmentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    studentInfo: {
        flex: 1,
    },
    studentName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1e3a5f',
    },
    studentGrade: {
        fontSize: 14,
        color: '#64748b',
        marginTop: 2,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: '600',
    },
    enrollmentDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    detailLabel: {
        fontSize: 14,
        color: '#64748b',
    },
    detailValue: {
        fontSize: 14,
        color: '#1e3a5f',
        fontWeight: '600',
    },
    documentsSection: {
        marginBottom: 16,
    },
    documentsTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1e3a5f',
        marginBottom: 8,
    },
    documentItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 4,
    },
    documentInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    documentIcon: {
        fontSize: 16,
        marginRight: 8,
    },
    documentName: {
        fontSize: 12,
        color: '#64748b',
    },
    uploadButton: {
        backgroundColor: '#3b82f6',
        paddingHorizontal: 12,    paddingVertical: 4,
        borderRadius: 6,
    },
    uploadButtonText: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: '600',
    },
    pendingActions: {
        flexDirection: 'row',
        gap: 8,
    },
    actionButton: {
        flex: 1,
        backgroundColor: '#3b82f6',
        paddingVertical: 8,
        borderRadius: 6,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#ef4444',
    },
    actionButtonText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '600',
    },
    cancelButtonText: {
        color: '#ffffff',
    },
    infoSection: {
        backgroundColor: '#f0f9ff',
        padding: 16,
        borderRadius: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#3b82f6',
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1e3a5f',
        marginBottom: 8,
    },
    infoText: {
        fontSize: 14,
        color: '#64748b',
        lineHeight: 20,
    },
});

export default EnrollmentPage;