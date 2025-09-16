import { View, Text, TouchableOpacity, TextInput, StyleSheet, StatusBar, Alert } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';

export default function Login() {
    const navigation = useNavigation();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        if (!username || !password) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos.');
            return;
        }
        if (username.trim() && password.trim()) {
            navigation.navigate('Home');
        } else {
            Alert.alert('Erro', 'Credenciais inválidas. Tente novamente.');
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
                        style={styles.input}
                        placeholderTextColor="#9ca3af"
                        autoCapitalize="none"
                        keyboardType="email-address"
                        value={username}
                        onChangeText={setUsername}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Senha</Text>
                    <TextInput 
                        placeholder="Digite sua senha" 
                        secureTextEntry={true} 
                        style={styles.input}
                        placeholderTextColor="#9ca3af"
                        value={password}
                        onChangeText={setPassword}
                    />
                </View>

                <TouchableOpacity style={styles.forgotPassword}>
                    <Text style={styles.forgotPasswordText}>Esqueceu sua senha?</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                    <Text style={styles.loginButtonText}>Entrar</Text>
                </TouchableOpacity>

                <View style={styles.divider}>
                    <View style={styles.line}></View>
                    <Text style={styles.dividerText}>OU</Text>
                    <View style={styles.line}></View>
                </View>

                <TouchableOpacity style={styles.signupButton}>
                    <Text style={styles.signupButtonText}>Criar Nova Conta</Text>
                </TouchableOpacity>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        Não tem uma conta? Entre em contato com a secretaria
                    </Text>
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
});