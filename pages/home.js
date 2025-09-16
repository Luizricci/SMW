import { View, StatusBar, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native'
import Card from '../components/Card'

export default function Home() {    
    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#1e3a5f" />
            
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <View style={styles.logoSection}>
                        <Text style={styles.logoIcon}>🎓</Text>
                        <View style={styles.headerTexts}>
                            <Text style={styles.welcomeText}>Bem-vindo!</Text>
                            <Text style={styles.schoolName}>Sistema Escolar</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.profileButton}>
                        <Text style={styles.profileIcon}>👤</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Content */}
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.quickActionsContainer}>
                    <Text style={styles.sectionTitle}>Acesso Rápido</Text>
                    <View style={styles.quickActions}>
                        <TouchableOpacity style={styles.quickActionCard}>
                            <Text style={styles.quickActionIcon}>📚</Text>
                            <Text style={styles.quickActionText}>Notas</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.quickActionCard}>
                            <Text style={styles.quickActionIcon}>📅</Text>
                            <Text style={styles.quickActionText}>Horários</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.quickActionCard}>
                            <Text style={styles.quickActionIcon}>📋</Text>
                            <Text style={styles.quickActionText}>Tarefas</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.quickActionCard}>
                            <Text style={styles.quickActionIcon}>💬</Text>
                            <Text style={styles.quickActionText}>Mensagens</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.cardsContainer}>
                    <Text style={styles.sectionTitle}>Informações</Text>
                    <Card 
                        title="Bem-vindo ao Sistema Escolar" 
                        content="Aqui você pode acessar suas informações acadêmicas, notas e muito mais." 
                    />
                    <Card 
                        title="Próximos Eventos" 
                        content="• Prova de Matemática - 20/09/2025
• Reunião de Pais - 25/09/2025
• Festival de Ciências - 30/09/2025" 
                    />
                    <Card 
                        title="Notificações" 
                        content="Você tem 2 novas mensagens dos professores e 1 comunicado da direção." 
                    />
                </View>
            </ScrollView>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    header: {
        backgroundColor: '#1e3a5f',
        paddingTop: 50,
        paddingBottom: 25,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    logoSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    logoIcon: {
        fontSize: 32,
        marginRight: 12,
    },
    headerTexts: {
        flex: 1,
    },
    welcomeText: {
        fontSize: 16,
        color: '#cbd5e1',
        fontWeight: '300',
    },
    schoolName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    profileButton: {
        width: 40,
        height: 40,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileIcon: {
        fontSize: 20,
        color: '#ffffff',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    quickActionsContainer: {
        marginTop: 25,
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1e3a5f',
        marginBottom: 16,
    },
    quickActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    },
    quickActionCard: {
        backgroundColor: '#ffffff',
        width: '22%',
        aspectRatio: 1,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        marginBottom: 10,
    },
    quickActionIcon: {
        fontSize: 24,
        marginBottom: 8,
    },
    quickActionText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#1e3a5f',
        textAlign: 'center',
    },
    cardsContainer: {
        paddingBottom: 30,
    },
});


