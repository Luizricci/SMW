/**
 * Módulo de Segurança - Proteção contra SQL Injection e outras vulnerabilidades
 * 
 * Este módulo fornece funções para sanitizar e validar inputs do usuário,
 * protegendo contra SQL injection, XSS e outros ataques comuns.
 */

// Caracteres perigosos que podem indicar tentativas de SQL injection
const SQL_INJECTION_PATTERNS = [
  /(\%27)|(\')|(\-\-)|(\%23)|(#)/i, // SQL meta-characters
  /((\%3D)|(=))[^\n]*((\%27)|(\')|(\-\-)|(\%3B)|(;))/i, // Typical SQL injection
  /\w*((\%27)|(\'))((\%6F)|o|(\%4F))((\%72)|r|(\%52))/i, // union+select
  /((\%27)|(\'))union/i, // union+select
  /exec(\s|\+)+(s|x)p\w+/i, // Stored procedure calls
  /UNION(?:\s+ALL)?\s+SELECT/i, // UNION SELECT
  /INSERT\s+INTO/i, // INSERT statements
  /DELETE\s+FROM/i, // DELETE statements
  /UPDATE\s+\w+\s+SET/i, // UPDATE statements
  /DROP\s+(TABLE|DATABASE)/i, // DROP statements
  /CREATE\s+(TABLE|DATABASE)/i, // CREATE statements
  /ALTER\s+TABLE/i, // ALTER statements
  /TRUNCATE\s+TABLE/i, // TRUNCATE statements
  /(script|javascript|vbscript|onload|onerror|onclick)/i, // XSS patterns
];

// Caracteres especiais que devem ser escapados
const SPECIAL_CHARS = {
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
  '&': '&amp;',
  '`': '&#96;',
  '=': '&#x3D;'
};

/**
 * Remove caracteres potencialmente perigosos de uma string
 * @param {string} input - String de entrada
 * @returns {string} - String sanitizada
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    // Remove caracteres de controle
    .replace(/[\x00-\x1F\x7F]/g, '')
    // Remove múltiplos espaços
    .replace(/\s+/g, ' ')
    // Limita o tamanho (máximo 1000 caracteres)
    .slice(0, 1000);
};

/**
 * Escapa caracteres HTML/JS para prevenir XSS
 * @param {string} input - String de entrada
 * @returns {string} - String com caracteres escapados
 */
export const escapeHtml = (input) => {
  if (typeof input !== 'string') return '';
  
  return input.replace(/[<>"'\/&`=]/g, (match) => SPECIAL_CHARS[match] || match);
};

/**
 * Verifica se a string contém padrões suspeitos de SQL injection
 * @param {string} input - String a ser verificada
 * @returns {boolean} - true se detectar padrões suspeitos
 */
export const detectSqlInjection = (input) => {
  if (typeof input !== 'string') return false;
  
  const normalizedInput = input.toLowerCase().replace(/\s+/g, ' ');
  
  return SQL_INJECTION_PATTERNS.some(pattern => pattern.test(normalizedInput));
};

/**
 * Valida e sanitiza um input de login (username/email)
 * @param {string} input - Input do usuário
 * @returns {object} - { isValid: boolean, sanitized: string, error?: string }
 */
export const validateLoginInput = (input) => {
  if (!input || typeof input !== 'string') {
    return { isValid: false, sanitized: '', error: 'Campo obrigatório' };
  }

  const sanitized = sanitizeInput(input);
  
  if (sanitized.length < 3) {
    return { isValid: false, sanitized, error: 'Mínimo 3 caracteres' };
  }

  if (sanitized.length > 100) {
    return { isValid: false, sanitized, error: 'Máximo 100 caracteres' };
  }

  if (detectSqlInjection(sanitized)) {
    return { isValid: false, sanitized: '', error: 'Caracteres não permitidos' };
  }

  // Valida formato de email ou username
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const usernamePattern = /^[a-zA-Z0-9._-]+$/;
  
  if (!emailPattern.test(sanitized) && !usernamePattern.test(sanitized)) {
    return { isValid: false, sanitized, error: 'Formato inválido' };
  }

  return { isValid: true, sanitized };
};

/**
 * Valida e sanitiza um input de senha
 * @param {string} input - Senha do usuário
 * @returns {object} - { isValid: boolean, sanitized: string, error?: string }
 */
export const validatePasswordInput = (input) => {
  if (!input || typeof input !== 'string') {
    return { isValid: false, sanitized: '', error: 'Campo obrigatório' };
  }

  const sanitized = sanitizeInput(input);
  
  if (sanitized.length < 3) { // Em produção seria mais rigoroso
    return { isValid: false, sanitized, error: 'Mínimo 3 caracteres' };
  }

  if (sanitized.length > 128) {
    return { isValid: false, sanitized, error: 'Máximo 128 caracteres' };
  }

  if (detectSqlInjection(sanitized)) {
    return { isValid: false, sanitized: '', error: 'Caracteres não permitidos' };
  }

  return { isValid: true, sanitized };
};

/**
 * Valida e sanitiza inputs de pesquisa/filtro
 * @param {string} input - Termo de pesquisa
 * @returns {object} - { isValid: boolean, sanitized: string, error?: string }
 */
export const validateSearchInput = (input) => {
  if (!input || typeof input !== 'string') {
    return { isValid: true, sanitized: '' }; // Pesquisa vazia é válida
  }

  const sanitized = sanitizeInput(input);
  
  if (sanitized.length > 200) {
    return { isValid: false, sanitized, error: 'Termo muito longo' };
  }

  if (detectSqlInjection(sanitized)) {
    return { isValid: false, sanitized: '', error: 'Caracteres não permitidos' };
  }

  // Remove caracteres especiais mas mantém acentos e espaços
  const cleanSearch = sanitized.replace(/[^\w\s\u00C0-\u024F\u1E00-\u1EFF-]/g, '');
  
  return { isValid: true, sanitized: cleanSearch };
};

/**
 * Valida inputs numéricos (IDs, valores, etc.)
 * @param {string|number} input - Valor numérico
 * @param {object} options - { min?, max?, integer? }
 * @returns {object} - { isValid: boolean, value: number, error?: string }
 */
export const validateNumericInput = (input, options = {}) => {
  const { min = -Infinity, max = Infinity, integer = false } = options;
  
  if (input === null || input === undefined || input === '') {
    return { isValid: false, value: null, error: 'Campo obrigatório' };
  }

  const numValue = Number(input);
  
  if (isNaN(numValue)) {
    return { isValid: false, value: null, error: 'Deve ser um número' };
  }

  if (integer && !Number.isInteger(numValue)) {
    return { isValid: false, value: null, error: 'Deve ser um número inteiro' };
  }

  if (numValue < min) {
    return { isValid: false, value: numValue, error: `Valor mínimo: ${min}` };
  }

  if (numValue > max) {
    return { isValid: false, value: numValue, error: `Valor máximo: ${max}` };
  }

  return { isValid: true, value: numValue };
};

/**
 * Limpa e valida arrays de IDs
 * @param {array} ids - Array de IDs
 * @returns {array} - Array de IDs válidos
 */
export const sanitizeIdArray = (ids) => {
  if (!Array.isArray(ids)) return [];
  
  return ids
    .filter(id => id != null)
    .map(id => String(id).trim())
    .filter(id => id.length > 0 && /^[a-zA-Z0-9_-]+$/.test(id))
    .slice(0, 100); // Limita a 100 IDs por segurança
};

/**
 * Log de tentativas suspeitas (em produção enviaria para sistema de monitoramento)
 * @param {string} type - Tipo de ataque detectado
 * @param {string} input - Input suspeito
 * @param {string} userId - ID do usuário (se disponível)
 */
export const logSecurityEvent = (type, input, userId = null) => {
  const event = {
    timestamp: new Date().toISOString(),
    type,
    input: input?.substring(0, 200), // Limita o log
    userId,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown'
  };
  
  // Em desenvolvimento, apenas console.warn
  console.warn('🚨 Tentativa de ataque detectada:', event);
  
  // Em produção, enviaria para sistema de monitoramento:
  // - Sentry, LogRocket, ou similar
  // - Sistema de alertas
  // - Bloqueio temporário do IP/usuário
};

/**
 * Middleware para validação geral de inputs
 * @param {object} inputs - Objeto com inputs do usuário
 * @param {object} validators - Objeto com funções de validação
 * @returns {object} - { isValid: boolean, sanitized: object, errors: object }
 */
export const validateInputs = (inputs, validators) => {
  const results = {};
  const errors = {};
  let isValid = true;

  for (const [key, value] of Object.entries(inputs)) {
    if (validators[key]) {
      const validation = validators[key](value);
      results[key] = validation.sanitized || validation.value || '';
      
      if (!validation.isValid) {
        errors[key] = validation.error;
        isValid = false;
        
        // Log tentativas suspeitas
        if (validation.error === 'Caracteres não permitidos') {
          logSecurityEvent('sql_injection_attempt', value);
        }
      }
    } else {
      results[key] = sanitizeInput(value);
    }
  }

  return { isValid, sanitized: results, errors };
};

export default {
  sanitizeInput,
  escapeHtml,
  detectSqlInjection,
  validateLoginInput,
  validatePasswordInput,
  validateSearchInput,
  validateNumericInput,
  sanitizeIdArray,
  logSecurityEvent,
  validateInputs
};