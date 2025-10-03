import React, { createContext, useContext, useState, useEffect } from 'react';
import { users, schools, userPermissions, schoolSettings } from '../data/mockData';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { validateLoginInput, validatePasswordInput, logSecurityEvent } from '../utils/security';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [school, setSchool] = useState(null);
  const [permissions, setPermissions] = useState(null);
  const [schoolConfig, setSchoolConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  // Carregar dados persistidos na inicialização
  useEffect(() => {
    loadPersistedAuth();
  }, []);

  const loadPersistedAuth = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        await setUserData(parsedUser);
      }
    } catch (error) {
      console.error('Erro ao carregar dados de autenticação:', error);
    } finally {
      setLoading(false);
    }
  };

  const setUserData = async (userData) => {
    // Buscar escola do usuário
    const userSchool = schools.find(s => s.id === userData.schoolId);
    
    // Buscar permissões do tipo de usuário
    const userPerms = userPermissions[userData.type] || {};
    
    // Buscar configurações da escola
    const schoolConf = schoolSettings.find(s => s.schoolId === userData.schoolId);

    setUser(userData);
    setSchool(userSchool);
    setPermissions(userPerms);
    setSchoolConfig(schoolConf);

    // Persistir dados
    await AsyncStorage.setItem('user', JSON.stringify(userData));
  };

  const login = async (username, password) => {
    try {
      // Validação de segurança dos inputs
      const usernameValidation = validateLoginInput(username);
      const passwordValidation = validatePasswordInput(password);

      // Se algum input for inválido, rejeita login
      if (!usernameValidation.isValid) {
        logSecurityEvent('invalid_username_attempt', username);
        return { 
          success: false, 
          error: usernameValidation.error || 'Usuário inválido.' 
        };
      }

      if (!passwordValidation.isValid) {
        logSecurityEvent('invalid_password_attempt', password, username);
        return { 
          success: false, 
          error: passwordValidation.error || 'Senha inválida.' 
        };
      }

      // Usa os valores sanitizados para buscar o usuário
      const sanitizedUsername = usernameValidation.sanitized;
      const sanitizedPassword = passwordValidation.sanitized;

      // Buscar usuário nas credenciais mockadas
      const foundUser = users.find(u => 
        u.username === sanitizedUsername && u.password === sanitizedPassword
      );
      
      if (foundUser) {
        await setUserData(foundUser);
        
        // Log de login bem-sucedido
        console.log('✅ Login bem-sucedido:', {
          userId: foundUser.id,
          userType: foundUser.type,
          timestamp: new Date().toISOString()
        });
        
        return { success: true, user: foundUser };
      } else {
        // Log de tentativa de login falhada
        logSecurityEvent('failed_login_attempt', sanitizedUsername);
        
        return { 
          success: false, 
          error: 'Credenciais inválidas. Verifique seu usuário e senha.' 
        };
      }
    } catch (error) {
      // Log de erro interno
      logSecurityEvent('login_system_error', `${username}:${error.message}`);
      
      return { 
        success: false, 
        error: 'Erro ao fazer login. Tente novamente.' 
      };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      setUser(null);
      setSchool(null);
      setPermissions(null);
      setSchoolConfig(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  // Função para verificar se usuário tem permissão para acessar algo
  const hasPermission = (action) => {
    if (!permissions) return false;
    return permissions.canView?.includes(action) || 
           permissions.canAccess?.includes(action) ||
           permissions.canControl?.includes(action);
  };

  // Função para verificar se boletim está liberado
  const isBulletinReleased = () => {
    return schoolConfig?.bulletinReleased || false;
  };

  // Função para verificar se matrícula está aberta
  const isEnrollmentOpen = () => {
    return schoolConfig?.enrollmentOpen || false;
  };

  // Função para obter informações do usuário logado
  const getUserInfo = () => {
    return {
      id: user?.id,
      name: user?.name,
      type: user?.type,
      school: school?.name,
      class: user?.class,
      registration: user?.registration,
      email: user?.email
    };
  };

  // Função para obter filhos (para usuários do tipo parent)
  const getChildren = () => {
    if (user?.type !== 'parent') return [];
    
    return users.filter(u => 
      user.childrenIds?.includes(u.id)
    );
  };

  const value = {
    user,
    school,
    permissions,
    schoolConfig,
    loading,
    login,
    logout,
    hasPermission,
    isBulletinReleased,
    isEnrollmentOpen,
    getUserInfo,
    getChildren,
    
    // Estados úteis para componentes
    isLoggedIn: !!user,
    isStudent: user?.type === 'student',
    isParent: user?.type === 'parent',
    isDirector: user?.type === 'director'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};