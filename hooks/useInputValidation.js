import { useState, useCallback } from 'react';
import { Text } from 'react-native';
import {
  validateLoginInput,
  validatePasswordInput,
  validateSearchInput,
  validateNumericInput,
  validateInputs,
  logSecurityEvent
} from '../utils/security';

/**
 * Custom hook para validação e sanitização de inputs
 * Facilita o uso das funções de segurança nos componentes React Native
 */
export const useInputValidation = () => {
  const [errors, setErrors] = useState({});
  const [isValidating, setIsValidating] = useState(false);

  /**
   * Valida um único campo
   * @param {string} field - Nome do campo
   * @param {string} value - Valor a ser validado
   * @param {string} type - Tipo de validação ('login', 'password', 'search', 'numeric')
   * @param {object} options - Opções para validação numérica
   */
  const validateField = useCallback((field, value, type = 'text', options = {}) => {
    let validation;

    switch (type) {
      case 'login':
        validation = validateLoginInput(value);
        break;
      case 'password':
        validation = validatePasswordInput(value);
        break;
      case 'search':
        validation = validateSearchInput(value);
        break;
      case 'numeric':
        validation = validateNumericInput(value, options);
        break;
      default:
        validation = { isValid: true, sanitized: value };
    }

    setErrors(prev => ({
      ...prev,
      [field]: validation.error || null
    }));

    return validation;
  }, []);

  /**
   * Valida múltiplos campos de uma vez
   * @param {object} inputs - Objeto com os inputs { campo: valor }
   * @param {object} validators - Objeto com validadores { campo: função }
   */
  const validateFields = useCallback((inputs, validators) => {
    setIsValidating(true);
    
    const result = validateInputs(inputs, validators);
    
    setErrors(result.errors);
    setIsValidating(false);
    
    return result;
  }, []);

  /**
   * Limpa erros de um campo específico
   * @param {string} field - Nome do campo
   */
  const clearFieldError = useCallback((field) => {
    setErrors(prev => ({
      ...prev,
      [field]: null
    }));
  }, []);

  /**
   * Limpa todos os erros
   */
  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  /**
   * Verifica se há erros
   * @returns {boolean}
   */
  const hasErrors = useCallback(() => {
    return Object.values(errors).some(error => error !== null);
  }, [errors]);

  /**
   * Hook específico para validação de login
   */
  const useLoginValidation = () => {
    const [loginData, setLoginData] = useState({ username: '', password: '' });
    const [loginErrors, setLoginErrors] = useState({});

    const validateLogin = useCallback((username, password) => {
      const usernameValidation = validateLoginInput(username);
      const passwordValidation = validatePasswordInput(password);

      const newErrors = {};
      if (!usernameValidation.isValid) {
        newErrors.username = usernameValidation.error;
      }
      if (!passwordValidation.isValid) {
        newErrors.password = passwordValidation.error;
      }

      setLoginErrors(newErrors);

      // Log tentativas suspeitas
      if (!usernameValidation.isValid && usernameValidation.error === 'Caracteres não permitidos') {
        logSecurityEvent('login_sql_injection_attempt', username);
      }
      if (!passwordValidation.isValid && passwordValidation.error === 'Caracteres não permitidos') {
        logSecurityEvent('login_sql_injection_attempt', password);
      }

      return {
        isValid: usernameValidation.isValid && passwordValidation.isValid,
        sanitized: {
          username: usernameValidation.sanitized,
          password: passwordValidation.sanitized
        },
        errors: newErrors
      };
    }, []);

    const updateLoginField = useCallback((field, value) => {
      setLoginData(prev => ({
        ...prev,
        [field]: value
      }));

      // Limpa erro quando usuário começa a digitar
      if (loginErrors[field]) {
        setLoginErrors(prev => ({
          ...prev,
          [field]: null
        }));
      }
    }, [loginErrors]);

    return {
      loginData,
      loginErrors,
      validateLogin,
      updateLoginField,
      clearLoginErrors: () => setLoginErrors({})
    };
  };

  /**
   * Hook específico para validação de pesquisa
   */
  const useSearchValidation = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchError, setSearchError] = useState(null);

    const validateSearch = useCallback((term) => {
      const validation = validateSearchInput(term);
      
      setSearchError(validation.error || null);
      
      if (!validation.isValid && validation.error === 'Caracteres não permitidos') {
        logSecurityEvent('search_sql_injection_attempt', term);
      }

      return validation;
    }, []);

    const updateSearchTerm = useCallback((term) => {
      setSearchTerm(term);
      
      // Limpa erro quando usuário começa a digitar
      if (searchError) {
        setSearchError(null);
      }
    }, [searchError]);

    return {
      searchTerm,
      searchError,
      validateSearch,
      updateSearchTerm,
      clearSearchError: () => setSearchError(null)
    };
  };

  return {
    errors,
    isValidating,
    validateField,
    validateFields,
    clearFieldError,
    clearAllErrors,
    hasErrors,
    useLoginValidation,
    useSearchValidation
  };
};

/**
 * Hook simplificado para validação de login
 */
export const useLoginValidation = () => {
  const { useLoginValidation } = useInputValidation();
  return useLoginValidation();
};

/**
 * Hook simplificado para validação de pesquisa
 */
export const useSearchValidation = () => {
  const { useSearchValidation } = useInputValidation();
  return useSearchValidation();
};

/**
 * HOC para adicionar validação a componentes TextInput
 */
export const withInputValidation = (Component) => {
  return (props) => {
    const { validateField } = useInputValidation();
    const [localError, setLocalError] = useState(null);

    const handleChangeText = (text) => {
      if (props.validationType) {
        const validation = validateField(
          props.fieldName || 'field',
          text,
          props.validationType,
          props.validationOptions
        );
        
        setLocalError(validation.error || null);
        
        if (props.onChangeText) {
          props.onChangeText(validation.sanitized || text);
        }
      } else {
        if (props.onChangeText) {
          props.onChangeText(text);
        }
      }
    };

    return (
      <>
        <Component
          {...props}
          onChangeText={handleChangeText}
          style={[
            props.style,
            localError && { borderColor: '#ef4444', borderWidth: 1 }
          ]}
        />
        {localError && (
          <Text style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>
            {localError}
          </Text>
        )}
      </>
    );
  };
};

export default useInputValidation;