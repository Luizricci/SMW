import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { users } from '../data/mockData';
import { SecureFilterSelect } from '../components/SecureSearchInput';
import { validateSearchInput } from '../utils/security';

const SendAnnouncementsPage = () => {
    const { user, school } = useAuth();
    const navigation = useNavigation();
    
    // Estados para o formulário de comunicado
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [priority, setPriority] = useState('medium');
    const [targetAudience, setTargetAudience] = useState([]);
    const [sendEmail, setSendEmail] = useState(true);
    const [sendSms, setSendSms] = useState(false);
    const [scheduleDate, setScheduleDate] = useState('');
    
    // Estados para validação
    const [titleError, setTitleError] = useState('');
    const [contentError, setContentError] = useState('');
    
    // Opções de público-alvo
    const audienceOptions = [
        { value: 'student', label: 'Alunos', count: users.filter(u => u.type === 'student' && u.schoolId === user.schoolId).length },
        { value: 'parent', label: 'Pais/Responsáveis', count: users.filter(u => u.type === 'parent' && u.schoolId === user.schoolId).length },
        { value: 'teacher', label: 'Professores', count: 5 }, // Simulado
        { value: 'staff', label: 'Funcionários', count: 8 }, // Simulado
    ];

    const handleTitleChange = (text) => {
        const validation = validateSearchInput(text);
        if (validation.isValid) {
            setTitle(validation.sanitized);
            setTitleError('');
        } else {
            setTitleError(validation.error);
        }
    };

    const handleContentChange = (text) => {
        const validation = validateSearchInput(text);
        if (validation.isValid) {
            setContent(validation.sanitized);
            setContentError('');
        } else {
            setContentError(validation.error);
        }
    };

    const toggleAudience = (audienceType) => {
        setTargetAudience(prev => {
            if (prev.includes(audienceType)) {
                return prev.filter(a => a !== audienceType);
            } else {
                return [...prev, audienceType];
            }
        });
    };

    const getTotalRecipients = () => {
        return targetAudience.reduce((total, audience) => {
            const option = audienceOptions.find(o => o.value === audience);
            return total + (option ? option.count : 0);
        }, 0);
    };

    const validateForm = () => {
        let isValid = true;
        
        if (!title.trim()) {
            setTitleError('Título é obrigatório');
            isValid = false;
        }
        
        if (!content.trim()) {
            setContentError('Conteúdo é obrigatório');
            isValid = false;
        }
        
        if (targetAudience.length === 0) {
            Alert.alert('Erro', 'Selecione pelo menos um público-alvo');
            isValid = false;
        }
        
        return isValid;
    };

    const handleSendAnnouncement = () => {
        if (!validateForm()) return;
        
        const announcement = {
            title: title.trim(),
            content: content.trim(),
            priority,
            targetAudience,
            sendEmail,
            sendSms,
            scheduleDate: scheduleDate || null,
            author: user.name,
            recipients: getTotalRecipients(),
            schoolId: user.schoolId
        };
        
        Alert.alert(
            'Enviar Comunicado',
            `Enviar para ${announcement.recipients} pessoas?\\n\\nTítulo: ${announcement.title}\\nPrioridade: ${priority.toUpperCase()}\\n\\nEsta funcionalidade estará disponível em breve.`,
            [
                { text: 'Cancelar', style: 'cancel' },
                { 
                    text: 'Enviar', 
                    onPress: () => {
                        // Resetar formulário
                        setTitle('');
                        setContent('');
                        setPriority('medium');
                        setTargetAudience([]);
                        setSendEmail(true);
                        setSendSms(false);
                        setScheduleDate('');
                        
                        Alert.alert('Sucesso', 'Comunicado enviado com sucesso!');
                        navigation.goBack();
                    }
                }
            ]
        );
    };

    const handleSaveDraft = () => {
        if (!title.trim() && !content.trim()) {
            Alert.alert('Erro', 'Adicione pelo menos um título ou conteúdo para salvar o rascunho');
            return;
        }
        
        Alert.alert(
            'Rascunho Salvo',
            'Seu comunicado foi salvo como rascunho e pode ser editado posteriormente.\\n\\nEsta funcionalidade estará disponível em breve.',
            [{ text: 'OK' }]
        );
    };

    const getPriorityColor = (priorityLevel) => {
        switch (priorityLevel) {
            case 'high': return '#ef4444';
            case 'medium': return '#f59e0b';
            case 'low': return '#10b981';
            default: return '#64748b';
        }
    };

    const getPriorityLabel = (priorityLevel) => {
        switch (priorityLevel) {
            case 'high': return 'URGENTE';
            case 'medium': return 'IMPORTANTE';
            case 'low': return 'INFORMATIVO';
            default: return 'NORMAL';
        }
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
                <Text style={styles.headerTitle}>Enviar Comunicados</Text>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* School Info */}
                <View style={styles.schoolCard}>
                    <Text style={styles.schoolName}>{school?.name}</Text>
                    <Text style={styles.userRole}>Portal da Direção - Comunicados</Text>
                    <Text style={styles.authorText}>Autor: {user?.name}</Text>
                </View>

                {/* Formulário */}
                <View style={styles.formSection}>
                    <Text style={styles.sectionTitle}>✉️ Novo Comunicado</Text>
                    
                    {/* Título */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Título *</Text>
                        <TextInput
                            style={[styles.textInput, titleError && styles.inputError]}
                            placeholder="Digite o título do comunicado..."
                            placeholderTextColor="#9ca3af"
                            value={title}
                            onChangeText={handleTitleChange}
                            maxLength={100}
                        />
                        {titleError ? (
                            <Text style={styles.errorText}>{titleError}</Text>
                        ) : null}
                        <Text style={styles.charCount}>{title.length}/100 caracteres</Text>
                    </View>

                    {/* Conteúdo */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Conteúdo *</Text>
                        <TextInput
                            style={[styles.textAreaInput, contentError && styles.inputError]}
                            placeholder="Digite o conteúdo do comunicado..."
                            placeholderTextColor="#9ca3af"
                            value={content}
                            onChangeText={handleContentChange}
                            multiline={true}
                            numberOfLines={6}
                            textAlignVertical="top"
                            maxLength={1000}
                        />
                        {contentError ? (
                            <Text style={styles.errorText}>{contentError}</Text>
                        ) : null}
                        <Text style={styles.charCount}>{content.length}/1000 caracteres</Text>
                    </View>

                    {/* Prioridade */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Prioridade</Text>
                        <SecureFilterSelect
                            placeholder="Selecione a prioridade"
                            value={priority}
                            onSelect={setPriority}
                            options={[
                                { value: 'low', label: 'Informativo (Baixa)' },
                                { value: 'medium', label: 'Importante (Média)' },
                                { value: 'high', label: 'Urgente (Alta)' }
                            ]}
                        />
                        <View style={styles.priorityPreview}>
                            <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(priority) }]}>
                                <Text style={styles.priorityText}>{getPriorityLabel(priority)}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Público-alvo */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Público-alvo *</Text>
                        <Text style={styles.inputDescription}>
                            Selecione quem receberá este comunicado:
                        </Text>
                        
                        {audienceOptions.map((option) => (
                            <TouchableOpacity
                                key={option.value}
                                style={[
                                    styles.audienceOption,
                                    targetAudience.includes(option.value) && styles.audienceOptionSelected
                                ]}
                                onPress={() => toggleAudience(option.value)}
                            >
                                <View style={styles.audienceInfo}>
                                    <Text style={[
                                        styles.audienceLabel,
                                        targetAudience.includes(option.value) && styles.audienceLabelSelected
                                    ]}>
                                        {targetAudience.includes(option.value) ? '✅' : '⬜'} {option.label}
                                    </Text>
                                    <Text style={styles.audienceCount}>
                                        {option.count} pessoas
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                        
                        {targetAudience.length > 0 && (
                            <View style={styles.recipientsPreview}>
                                <Text style={styles.recipientsText}>
                                    📊 Total de destinatários: {getTotalRecipients()} pessoas
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* Opções de Envio */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Canais de Envio</Text>
                        
                        <TouchableOpacity
                            style={[styles.channelOption, sendEmail && styles.channelOptionSelected]}
                            onPress={() => setSendEmail(!sendEmail)}
                        >
                            <Text style={styles.channelLabel}>
                                {sendEmail ? '✅' : '⬜'} 📧 Enviar por Email
                            </Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                            style={[styles.channelOption, sendSms && styles.channelOptionSelected]}
                            onPress={() => setSendSms(!sendSms)}
                        >
                            <Text style={styles.channelLabel}>
                                {sendSms ? '✅' : '⬜'} 📱 Enviar por SMS
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Preview */}
                    {(title || content) && (
                        <View style={styles.previewSection}>
                            <Text style={styles.sectionTitle}>👁️ Preview</Text>
                            <View style={styles.previewCard}>
                                {title && (
                                    <View style={styles.previewHeader}>
                                        <Text style={styles.previewTitle}>{title}</Text>
                                        <View style={[styles.previewPriority, { backgroundColor: getPriorityColor(priority) }]}>
                                            <Text style={styles.previewPriorityText}>{getPriorityLabel(priority)}</Text>
                                        </View>
                                    </View>
                                )}
                                {content && (
                                    <Text style={styles.previewContent}>{content}</Text>
                                )}
                                <Text style={styles.previewFooter}>
                                    {school?.name} - {new Date().toLocaleDateString('pt-BR')}
                                </Text>
                            </View>
                        </View>
                    )}
                </View>

                {/* Ações */}
                <View style={styles.actionsSection}>
                    <TouchableOpacity
                        style={styles.draftButton}
                        onPress={handleSaveDraft}
                    >
                        <Text style={styles.draftButtonText}>💾 Salvar Rascunho</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                        style={styles.sendButton}
                        onPress={handleSendAnnouncement}
                    >
                        <Text style={styles.sendButtonText}>📤 Enviar Comunicado</Text>
                    </TouchableOpacity>
                </View>

                {/* Informações */}
                <View style={styles.infoSection}>
                    <Text style={styles.infoTitle}>ℹ️ Dicas Importantes</Text>
                    <Text style={styles.infoText}>
                        • Use títulos claros e objetivos{'\n'}
                        • Mantenha o conteúdo conciso{'\n'}
                        • Verifique o público-alvo antes de enviar{'\n'}
                        • Comunicados urgentes são destacados{'\n'}
                        • Todos os envios são registrados
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
        marginBottom: 4,
    },
    authorText: {
        fontSize: 14,
        color: '#3b82f6',
        fontWeight: '600',
    },
    formSection: {
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
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1e3a5f',
        marginBottom: 16,
    },
    inputGroup: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    inputDescription: {
        fontSize: 12,
        color: '#64748b',
        marginBottom: 8,
    },
    textInput: {
        height: 44,
        backgroundColor: '#f8fafc',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        paddingHorizontal: 12,
        fontSize: 16,
        color: '#374151',
    },
    textAreaInput: {
        minHeight: 120,
        backgroundColor: '#f8fafc',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        paddingHorizontal: 12,
        paddingVertical: 12,
        fontSize: 16,
        color: '#374151',
    },
    inputError: {
        borderColor: '#ef4444',
        borderWidth: 2,
    },
    errorText: {
        fontSize: 12,
        color: '#ef4444',
        marginTop: 4,
        fontWeight: '500',
    },
    charCount: {
        fontSize: 12,
        color: '#9ca3af',
        textAlign: 'right',
        marginTop: 4,
    },
    priorityPreview: {
        alignItems: 'flex-start',
        marginTop: 8,
    },
    priorityBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    priorityText: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: '600',
    },
    audienceOption: {
        backgroundColor: '#f8fafc',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        padding: 12,
        marginBottom: 8,
    },
    audienceOptionSelected: {
        backgroundColor: '#eff6ff',
        borderColor: '#3b82f6',
    },
    audienceInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    audienceLabel: {
        fontSize: 14,
        color: '#374151',
        fontWeight: '500',
    },
    audienceLabelSelected: {
        color: '#1d4ed8',
    },
    audienceCount: {
        fontSize: 12,
        color: '#64748b',
    },
    recipientsPreview: {
        backgroundColor: '#f0f9ff',
        padding: 12,
        borderRadius: 8,
        marginTop: 8,
    },
    recipientsText: {
        fontSize: 14,
        color: '#1d4ed8',
        fontWeight: '600',
    },
    channelOption: {
        backgroundColor: '#f8fafc',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        padding: 12,
        marginBottom: 8,
    },
    channelOptionSelected: {
        backgroundColor: '#f0fdf4',
        borderColor: '#22c55e',
    },
    channelLabel: {
        fontSize: 14,
        color: '#374151',
        fontWeight: '500',
    },
    previewSection: {
        marginTop: 16,
    },
    previewCard: {
        backgroundColor: '#f8fafc',
        borderRadius: 12,
        padding: 16,
        borderLeftWidth: 4,
        borderLeftColor: '#3b82f6',
    },
    previewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    previewTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1e3a5f',
        flex: 1,
        marginRight: 8,
    },
    previewPriority: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
    },
    previewPriorityText: {
        color: '#ffffff',
        fontSize: 10,
        fontWeight: '600',
    },
    previewContent: {
        fontSize: 14,
        color: '#374151',
        lineHeight: 20,
        marginBottom: 12,
    },
    previewFooter: {
        fontSize: 12,
        color: '#9ca3af',
        fontStyle: 'italic',
    },
    actionsSection: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
    },
    draftButton: {
        flex: 1,
        backgroundColor: '#f3f4f6',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#d1d5db',
    },
    draftButtonText: {
        fontSize: 16,
        color: '#374151',
        fontWeight: '600',
    },
    sendButton: {
        flex: 1,
        backgroundColor: '#1e3a5f',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#1e3a5f',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    sendButtonText: {
        fontSize: 16,
        color: '#ffffff',
        fontWeight: 'bold',
    },
    infoSection: {
        backgroundColor: '#f0f9ff',
        padding: 16,
        borderRadius: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#3b82f6',
        marginBottom: 16,
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

export default SendAnnouncementsPage;