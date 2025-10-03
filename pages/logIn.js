import { View, Text, TouchableOpacity, TextInput, StyleSheet, StatusBar, Alert } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLoginValidation } from '../hooks/useInputValidation';

export default function Login() {
    const navigation = useNavigation();
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    
    // Hook de validação segura para login
    const {
        loginData,
        loginErrors,
        validateLogin,
        updateLoginField
    } = useLoginValidation();

    const handleLogin = async () => {
        // Validação com proteção contra SQL injection
        const validation = validateLogin(loginData.username, loginData.password);
        
        if (!validation.isValid) {
            // Mostra o primeiro erro encontrado
            const firstError = Object.values(validation.errors)[0];
            Alert.alert('Erro de Validação', firstError);
            return;
        }

        setLoading(true);
        
        try {
            // Usa os dados sanitizados para o login
            const result = await login(
                validation.sanitized.username.toLowerCase(), 
                validation.sanitized.password
            );
            
            if (result.success) {
                navigation.navigate('Home');
            } else {
                Alert.alert('Erro de Login', result.error);
            }
        } catch (error) {
            Alert.alert('Erro', 'Erro inesperado. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#1e3a5f" />
            
            {/* Header com logo da escola */}
            <View style={styles.header}>
                <View style={styles.logoContainer}>
                    <Text style={styles.logoText}>🎓</Text>
                    <Text style={styles.schoolName}>Sistema Escolar</Text>
                </View>
                <Text style={styles.subtitle}>Portal do Estudante</Text>
            </View>

            {/* Formulário de login */}
            <View style={styles.formContainer}>
                <Text style={styles.welcomeText}>Bem-vindo de volta!</Text>
                <Text style={styles.instructionText}>Faça login para acessar sua conta</Text>
                
                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Usuário ou Email</Text>
                    <TextInput 
                        placeholder="Digite seu usuário ou email" 
                        style={[
                            styles.input,
                            loginErrors.username && styles.inputError
                        ]}
                        placeholderTextColor="#9ca3af"
                        autoCapitalize="none"
                        keyboardType="email-address"
                        value={loginData.username}
                        onChangeText={(text) => updateLoginField('username', text)}
                    />
                    {loginErrors.username && (
                        <Text style={styles.errorText}>{loginErrors.username}</Text>
                    )}
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Senha</Text>
                    <TextInput 
                        placeholder="Digite sua senha" 
                        secureTextEntry={true} 
                        style={[
                            styles.input,
                            loginErrors.password && styles.inputError
                        ]}
                        placeholderTextColor="#9ca3af"
                        value={loginData.password}
                        onChangeText={(text) => updateLoginField('password', text)}
                    />
                    {loginErrors.password && (
                        <Text style={styles.errorText}>{loginErrors.password}</Text>
                    )}
                </View>

                <TouchableOpacity style={styles.forgotPassword}>
                    <Text style={styles.forgotPasswordText}>Esqueceu sua senha?</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[styles.loginButton, loading && styles.loginButtonDisabled]} 
                    onPress={handleLogin}
                    disabled={loading}
                >
                    <Text style={styles.loginButtonText}>
                        {loading ? 'Entrando...' : 'Entrar'}
                    </Text>
                </TouchableOpacity>

                {/* Dicas de login para teste */}
                <View style={styles.testCredentials}>
                    <Text style={styles.testTitle}>Credenciais para teste:</Text>
                    <Text style={styles.testText}>Aluno: joao.silva / 123456</Text>
                    <Text style={styles.testText}>Pais: carlos.silva / 123456</Text>
                    <Text style={styles.testText}>Diretor: diretor.sp / 123456</Text>
                </View>
            </View>
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
        paddingTop: 60,
        paddingBottom: 40,
        paddingHorizontal: 20,
        alignItems: 'center',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 10,
    },
    logoText: {
        fontSize: 48,
        marginBottom: 8,
    },
    schoolName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#ffffff',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#cbd5e1',
        fontWeight: '300',
    },
    formContainer: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 40,
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1e3a5f',
        textAlign: 'center',
        marginBottom: 8,
    },
    instructionText: {
        fontSize: 16,
        color: '#64748b',
        textAlign: 'center',
        marginBottom: 32,
    },
    inputContainer: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
        marginLeft: 4,
    },
    input: {
        height: 52,
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#374151',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    forgotPassword: {
        alignItems: 'flex-end',
        marginBottom: 24,
    },
    forgotPasswordText: {
        fontSize: 14,
        color: '#3b82f6',
        fontWeight: '500',
    },
    loginButton: {
        backgroundColor: '#1e3a5f',
        height: 52,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        elevation: 4,
        shadowColor: '#1e3a5f',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    loginButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: '#e5e7eb',
    },
    dividerText: {
        marginHorizontal: 16,
        fontSize: 14,
        color: '#9ca3af',
        fontWeight: '500',
    },
    signupButton: {
        backgroundColor: '#ffffff',
        height: 52,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#1e3a5f',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 32,
    },
    signupButtonText: {
        color: '#1e3a5f',
        fontSize: 16,
        fontWeight: 'bold',
    },
    footer: {
        alignItems: 'center',
        paddingBottom: 20,
    },
    footerText: {
        fontSize: 12,
        color: '#9ca3af',
        textAlign: 'center',
        lineHeight: 18,
    },
    loginButtonDisabled: {
        backgroundColor: '#9ca3af',
        elevation: 2,
    },
    testCredentials: {
        backgroundColor: '#f3f4f6',
        borderRadius: 8,
        padding: 16,
        marginTop: 20,
        borderLeftWidth: 4,
        borderLeftColor: '#3b82f6',
    },
    testTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1e3a5f',
        marginBottom: 8,
    },
    testText: {
        fontSize: 12,
        color: '#64748b',
        marginBottom: 4,
        fontFamily: 'monospace',
    },
    inputError: {
        borderColor: '#ef4444',
        borderWidth: 2,
    },
    errorText: {
        fontSize: 12,
        color: '#ef4444',
        marginTop: 4,
        marginLeft: 4,
        fontWeight: '500',
    },
});