import { View, StatusBar, StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import StudentDashboard from '../components/dashboards/StudentDashboard';
import ParentDashboard from '../components/dashboards/ParentDashboard';
import DirectorDashboard from '../components/dashboards/DirectorDashboard';

export default function Home() {
    const { user, school, logout, loading } = useAuth();
    const navigation = useNavigation();

    const handleLogout = async () => {
        await logout();
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#1e3a5f" />
                <Text style={styles.loadingText}>Carregando...</Text>
            </View>
        );
    }

    if (!user) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Erro ao carregar dados do usuário</Text>
                <TouchableOpacity style={styles.retryButton} onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.retryButtonText}>Voltar ao Login</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const renderDashboard = () => {
        switch (user.type) {
            case 'student':
                return <StudentDashboard />;
            case 'parent':
                return <ParentDashboard />;
            case 'director':
                return <DirectorDashboard />;
            default:
                return (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>Tipo de usuário não reconhecido</Text>
                    </View>
                );
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#1e3a5f" />
            
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <View style={styles.logoSection}>
                        <Text style={styles.logoIcon}>{school?.logo || '🎓'}</Text>
                        <View style={styles.headerTexts}>
                            <Text style={styles.welcomeText}>
                                {user.type === 'student' && 'Aluno'}
                                {user.type === 'parent' && 'Pais'}
                                {user.type === 'director' && 'Direção'}
                            </Text>
                            <Text style={styles.schoolName}>{school?.name || 'Sistema Escolar'}</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.profileButton} onPress={handleLogout}>
                        <Text style={styles.profileIcon}>🚪</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Dynamic Dashboard Content */}
            {renderDashboard()}
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#64748b',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        paddingHorizontal: 20,
    },
    errorText: {
        fontSize: 16,
        color: '#ef4444',
        textAlign: 'center',
        marginBottom: 20,
    },
    retryButton: {
        backgroundColor: '#1e3a5f',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
    },
    retryButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
    },
});


