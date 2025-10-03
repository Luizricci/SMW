import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { validateNumericInput } from '../utils/security';

/**
 * Componente de input numérico seguro
 * @param {object} props - Propriedades do componente
 * @param {function} props.onChangeValue - Callback com valor numérico validado
 * @param {number} props.value - Valor atual
 * @param {object} props.validationOptions - Opções de validação { min, max, integer }
 * @param {string} props.placeholder - Placeholder do input
 * @param {object} props.style - Estilos personalizados
 */
export const SecureNumericInput = ({
    onChangeValue,
    value,
    validationOptions = {},
    placeholder = "Digite um número",
    style,
    ...props
}) => {
    const [error, setError] = useState(null);
    const [localValue, setLocalValue] = useState(value?.toString() || '');

    const handleChangeText = (text) => {
        setLocalValue(text);
        
        if (!text.trim()) {
            setError(null);
            if (onChangeValue) {
                onChangeValue(null);
            }
            return;
        }

        const validation = validateNumericInput(text, validationOptions);
        
        if (validation.isValid) {
            setError(null);
            if (onChangeValue) {
                onChangeValue(validation.value);
            }
        } else {
            setError(validation.error);
            if (onChangeValue) {
                onChangeValue(null);
            }
        }
    };

    return (
        <View style={[styles.container, style]}>
            <TextInput
                style={[
                    styles.input,
                    error && styles.inputError
                ]}
                placeholder={placeholder}
                placeholderTextColor="#9ca3af"
                value={localValue}
                onChangeText={handleChangeText}
                keyboardType="numeric"
                maxLength={20}
                {...props}
            />
            {error && (
                <Text style={styles.errorText}>{error}</Text>
            )}
        </View>
    );
};

/**
 * Componente de range de datas seguro
 */
export const SecureDateRangeInput = ({
    startDate,
    endDate,
    onStartDateChange,
    onEndDateChange,
    style
}) => {
    const [startError, setStartError] = useState(null);
    const [endError, setEndError] = useState(null);

    const validateDate = (dateString) => {
        if (!dateString) return { isValid: true, date: null };
        
        // Aceita formato DD/MM/YYYY
        const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
        const match = dateString.match(dateRegex);
        
        if (!match) {
            return { isValid: false, error: 'Formato inválido (DD/MM/YYYY)' };
        }

        const [, day, month, year] = match;
        const date = new Date(year, month - 1, day);
        
        if (date.getDate() != day || date.getMonth() != month - 1 || date.getFullYear() != year) {
            return { isValid: false, error: 'Data inválida' };
        }

        return { isValid: true, date };
    };

    const handleStartDateChange = (text) => {
        const validation = validateDate(text);
        
        if (validation.isValid) {
            setStartError(null);
            if (onStartDateChange) {
                onStartDateChange(validation.date);
            }
        } else {
            setStartError(validation.error);
        }
    };

    const handleEndDateChange = (text) => {
        const validation = validateDate(text);
        
        if (validation.isValid) {
            setEndError(null);
            if (onEndDateChange) {
                onEndDateChange(validation.date);
            }
        } else {
            setEndError(validation.error);
        }
    };

    return (
        <View style={[styles.dateRangeContainer, style]}>
            <View style={styles.dateInputContainer}>
                <Text style={styles.dateLabel}>Data Inicial</Text>
                <TextInput
                    style={[
                        styles.dateInput,
                        startError && styles.inputError
                    ]}
                    placeholder="DD/MM/YYYY"
                    placeholderTextColor="#9ca3af"
                    value={startDate}
                    onChangeText={handleStartDateChange}
                    keyboardType="numeric"
                    maxLength={10}
                />
                {startError && (
                    <Text style={styles.errorText}>{startError}</Text>
                )}
            </View>

            <View style={styles.dateInputContainer}>
                <Text style={styles.dateLabel}>Data Final</Text>
                <TextInput
                    style={[
                        styles.dateInput,
                        endError && styles.inputError
                    ]}
                    placeholder="DD/MM/YYYY"
                    placeholderTextColor="#9ca3af"
                    value={endDate}
                    onChangeText={handleEndDateChange}
                    keyboardType="numeric"
                    maxLength={10}
                />
                {endError && (
                    <Text style={styles.errorText}>{endError}</Text>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 8,
    },
    input: {
        height: 44,
        backgroundColor: '#ffffff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        paddingHorizontal: 12,
        fontSize: 16,
        color: '#374151',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
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
    dateRangeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    dateInputContainer: {
        flex: 1,
    },
    dateLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 4,
    },
    dateInput: {
        height: 44,
        backgroundColor: '#ffffff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        paddingHorizontal: 12,
        fontSize: 16,
        color: '#374151',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
});

export default SecureNumericInput;