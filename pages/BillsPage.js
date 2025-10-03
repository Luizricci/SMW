import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Clipboard } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { bills, users } from '../data/mockData';

const BillsPage = () => {
    const { user, school, getChildren } = useAuth();
    const navigation = useNavigation();
    const children = getChildren();

    // Buscar boletos dos filhos do usuário
    const childrenIds = children.map(child => child.id);
    const familyBills = bills.filter(bill => childrenIds.includes(bill.studentId));

    const getStatusColor = (status) => {
        switch (status) {
            case 'paid': return '#10b981';
            case 'pending': return '#f59e0b';
            case 'overdue': return '#ef4444';
            case 'not_applicable': return '#64748b';
            default: return '#64748b';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'paid': return 'PAGO';
            case 'pending': return 'PENDENTE';
            case 'overdue': return 'VENCIDO';
            case 'not_applicable': return 'N/A';
            default: return 'DESCONHECIDO';
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    };

    const copyBarCode = (barCode) => {
        Clipboard.setString(barCode);
        Alert.alert('Copiado!', 'Código de barras copiado para a área de transferência.');
    };

    const payBill = (bill) => {
        Alert.alert(
            'Pagamento de Boleto',
            `Deseja pagar o boleto de ${bill.month}?\nValor: ${formatCurrency(bill.amount)}`,
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Pagar', onPress: () => {
                    Alert.alert('Sucesso!', 'Redirecionando para o sistema de pagamento...');
                }}
            ]
        );
    };

    const getChildName = (studentId) => {
        const child = children.find(c => c.id === studentId);
        return child ? child.name : 'Aluno não encontrado';
    };

    const groupBillsByStatus = () => {
        return {
            pending: familyBills.filter(bill => bill.status === 'pending'),
            overdue: familyBills.filter(bill => bill.status === 'overdue'),
            paid: familyBills.filter(bill => bill.status === 'paid'),
            not_applicable: familyBills.filter(bill => bill.status === 'not_applicable')
        };
    };

    const groupedBills = groupBillsByStatus();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton} 
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.backButtonText}>← Voltar</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Boletos e Mensalidades</Text>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Summary Card */}
                <View style={styles.summaryCard}>
                    <Text style={styles.summaryTitle}>Resumo Financeiro</Text>
                    <View style={styles.summaryGrid}>
                        <View style={styles.summaryItem}>
                            <Text style={[styles.summaryValue, { color: '#ef4444' }]}>
                                {groupedBills.pending.length + groupedBills.overdue.length}
                            </Text>
                            <Text style={styles.summaryLabel}>Pendentes</Text>
                        </View>
                        <View style={styles.summaryItem}>
                            <Text style={[styles.summaryValue, { color: '#10b981' }]}>
                                {groupedBills.paid.length}
                            </Text>
                            <Text style={styles.summaryLabel}>Pagos</Text>
                        </View>
                        <View style={styles.summaryItem}>
                            <Text style={[styles.summaryValue, { color: '#1e3a5f' }]}>
                                {formatCurrency(
                                    [...groupedBills.pending, ...groupedBills.overdue]
                                        .reduce((total, bill) => total + bill.amount, 0)
                                )}
                            </Text>
                            <Text style={styles.summaryLabel}>Total Pendente</Text>
                        </View>
                    </View>
                </View>

                {/* Overdue Bills */}
                {groupedBills.overdue.length > 0 && (
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: '#ef4444' }]}>
                            ⚠️ Boletos Vencidos ({groupedBills.overdue.length})
                        </Text>
                        {groupedBills.overdue.map(bill => (
                            <View key={bill.id} style={[styles.billCard, styles.overdueBill]}>
                                <View style={styles.billHeader}>
                                    <View>
                                        <Text style={styles.billMonth}>{bill.month}</Text>
                                        <Text style={styles.studentName}>{getChildName(bill.studentId)}</Text>
                                    </View>
                                    <View style={styles.billAmount}>
                                        <Text style={[styles.amountValue, { color: '#ef4444' }]}>
                                            {formatCurrency(bill.amount)}
                                        </Text>
                                        <View style={[styles.statusBadge, { backgroundColor: '#ef444420' }]}>
                                            <Text style={[styles.statusText, { color: '#ef4444' }]}>
                                                {getStatusLabel(bill.status)}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                                <Text style={styles.billDescription}>{bill.description}</Text>
                                <Text style={styles.dueDate}>
                                    Vencimento: {formatDate(bill.dueDate)}
                                </Text>
                                <View style={styles.billActions}>
                                    <TouchableOpacity 
                                        style={styles.payButton}
                                        onPress={() => payBill(bill)}
                                    >
                                        <Text style={styles.payButtonText}>Pagar Agora</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        style={styles.copyButton}
                                        onPress={() => copyBarCode(bill.barCode)}
                                    >
                                        <Text style={styles.copyButtonText}>Copiar Código</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </View>
                )}

                {/* Pending Bills */}
                {groupedBills.pending.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>
                            💳 Boletos Pendentes ({groupedBills.pending.length})
                        </Text>
                        {groupedBills.pending.map(bill => (
                            <View key={bill.id} style={styles.billCard}>
                                <View style={styles.billHeader}>
                                    <View>
                                        <Text style={styles.billMonth}>{bill.month}</Text>
                                        <Text style={styles.studentName}>{getChildName(bill.studentId)}</Text>
                                    </View>
                                    <View style={styles.billAmount}>
                                        <Text style={styles.amountValue}>
                                            {formatCurrency(bill.amount)}
                                        </Text>
                                        <View style={[styles.statusBadge, { backgroundColor: '#f59e0b20' }]}>
                                            <Text style={[styles.statusText, { color: '#f59e0b' }]}>
                                                {getStatusLabel(bill.status)}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                                <Text style={styles.billDescription}>{bill.description}</Text>
                                <Text style={styles.dueDate}>
                                    Vencimento: {formatDate(bill.dueDate)}
                                </Text>
                                <View style={styles.billActions}>
                                    <TouchableOpacity 
                                        style={styles.payButton}
                                        onPress={() => payBill(bill)}
                                    >
                                        <Text style={styles.payButtonText}>Pagar</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        style={styles.copyButton}
                                        onPress={() => copyBarCode(bill.barCode)}
                                    >
                                        <Text style={styles.copyButtonText}>Copiar Código</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </View>
                )}

                {/* Paid Bills */}
                {groupedBills.paid.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>
                            ✅ Boletos Pagos ({groupedBills.paid.length})
                        </Text>
                        {groupedBills.paid.slice(0, 3).map(bill => (
                            <View key={bill.id} style={[styles.billCard, styles.paidBill]}>
                                <View style={styles.billHeader}>
                                    <View>
                                        <Text style={styles.billMonth}>{bill.month}</Text>
                                        <Text style={styles.studentName}>{getChildName(bill.studentId)}</Text>
                                    </View>
                                    <View style={styles.billAmount}>
                                        <Text style={styles.amountValue}>
                                            {formatCurrency(bill.amount)}
                                        </Text>
                                        <View style={[styles.statusBadge, { backgroundColor: '#10b98120' }]}>
                                            <Text style={[styles.statusText, { color: '#10b981' }]}>
                                                {getStatusLabel(bill.status)}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                                <Text style={styles.billDescription}>{bill.description}</Text>
                                <Text style={styles.paidDate}>
                                    Pago em: {formatDate(bill.paidDate)}
                                </Text>
                            </View>
                        ))}
                        {groupedBills.paid.length > 3 && (
                            <TouchableOpacity style={styles.viewMoreButton}>
                                <Text style={styles.viewMoreText}>
                                    Ver mais {groupedBills.paid.length - 3} boletos pagos
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}

                {/* No Bills */}
                {familyBills.length === 0 && (
                    <View style={styles.noBillsCard}>
                        <Text style={styles.noBillsIcon}>💳</Text>
                        <Text style={styles.noBillsTitle}>Nenhum boleto encontrado</Text>
                        <Text style={styles.noBillsText}>
                            Não há boletos disponíveis para seus filhos no momento.
                        </Text>
                    </View>
                )}

                {/* Information Cards */}
                <View style={styles.infoSection}>
                    <View style={styles.infoCard}>
                        <Text style={styles.infoTitle}>💡 Dicas de Pagamento</Text>
                        <Text style={styles.infoText}>
                            • Pague sempre antes do vencimento{'\n'}
                            • Use o código de barras para pagamento automático{'\n'}
                            • Guarde o comprovante de pagamento{'\n'}
                            • Em caso de dúvidas, entre em contato com a secretaria
                        </Text>
                    </View>

                    <View style={styles.infoCard}>
                        <Text style={styles.infoTitle}>📞 Contato Financeiro</Text>
                        <Text style={styles.infoText}>
                            Escola: {school?.name}{'\n'}
                            Telefone: {school?.phone}{'\n'}
                            Email: {school?.email}{'\n'}
                            Horário: Segunda a Sexta, 8h às 17h
                        </Text>
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
        justifyContent: 'space-around',
    },
    summaryItem: {
        alignItems: 'center',
    },
    summaryValue: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    summaryLabel: {
        fontSize: 12,
        color: '#64748b',
        textAlign: 'center',
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1e3a5f',
        marginBottom: 16,
    },
    billCard: {
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
    overdueBill: {
        borderLeftWidth: 4,
        borderLeftColor: '#ef4444',
    },
    paidBill: {
        opacity: 0.7,
    },
    billHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    billMonth: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1e3a5f',
    },
    studentName: {
        fontSize: 14,
        color: '#64748b',
        marginTop: 2,
    },
    billAmount: {
        alignItems: 'flex-end',
    },
    amountValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1e3a5f',
        marginBottom: 4,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    billDescription: {
        fontSize: 14,
        color: '#64748b',
        marginBottom: 8,
    },
    dueDate: {
        fontSize: 12,
        color: '#94a3b8',
        marginBottom: 12,
    },
    paidDate: {
        fontSize: 12,
        color: '#10b981',
        fontWeight: '500',
    },
    billActions: {
        flexDirection: 'row',
        gap: 8,
    },
    payButton: {
        backgroundColor: '#10b981',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        flex: 1,
    },
    payButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
    },
    copyButton: {
        backgroundColor: '#3b82f6',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        flex: 1,
    },
    copyButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
    },
    viewMoreButton: {
        backgroundColor: '#f1f5f9',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    viewMoreText: {
        color: '#64748b',
        fontSize: 14,
        fontWeight: '500',
    },
    noBillsCard: {
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
    noBillsIcon: {
        fontSize: 64,
        marginBottom: 16,
    },
    noBillsTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1e3a5f',
        marginBottom: 8,
    },
    noBillsText: {
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
});

export default BillsPage;