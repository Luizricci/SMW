import React from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSearchValidation } from '../hooks/useInputValidation';

/**
 * Componente de busca seguro com proteção contra SQL injection
 * @param {object} props - Propriedades do componente
 * @param {string} props.placeholder - Placeholder do input
 * @param {function} props.onSearch - Callback chamada quando há uma busca válida
 * @param {string} props.value - Valor controlado do input
 * @param {function} props.onChangeText - Callback para mudanças no texto
 * @param {object} props.style - Estilos personalizados
 * @param {boolean} props.autoSearch - Se deve fazer busca automática ao digitar
 * @param {number} props.debounceMs - Tempo de debounce para busca automática
 */
export const SecureSearchInput = ({
    placeholder = "Digite para pesquisar...",
    onSearch,
    value,
    onChangeText,
    style,
    autoSearch = false,
    debounceMs = 500,
    ...props
}) => {
    const {
        searchTerm,
        searchError,
        validateSearch,
        updateSearchTerm
    } = useSearchValidation();

    // Timer para debounce
    const [searchTimer, setSearchTimer] = React.useState(null);

    // Usa valor controlado se fornecido, senão usa estado interno
    const currentValue = value !== undefined ? value : searchTerm;
    const handleChangeText = value !== undefined ? onChangeText : updateSearchTerm;

    const handleSearch = () => {
        const validation = validateSearch(currentValue);
        
        if (validation.isValid && onSearch) {
            onSearch(validation.sanitized);
        }
    };

    const handleTextChange = (text) => {
        handleChangeText(text);
        
        if (autoSearch && onSearch) {
            // Limpa timer anterior
            if (searchTimer) {
                clearTimeout(searchTimer);
            }
            
            // Define novo timer
            const timer = setTimeout(() => {
                const validation = validateSearch(text);
                if (validation.isValid) {
                    onSearch(validation.sanitized);
                }
            }, debounceMs);
            
            setSearchTimer(timer);
        }
    };

    // Cleanup do timer
    React.useEffect(() => {
        return () => {
            if (searchTimer) {
                clearTimeout(searchTimer);
            }
        };
    }, [searchTimer]);

    return (
        <View style={[styles.container, style]}>
            <View style={styles.inputContainer}>
                <TextInput
                    style={[
                        styles.input,
                        searchError && styles.inputError
                    ]}
                    placeholder={placeholder}
                    placeholderTextColor="#9ca3af"
                    value={currentValue}
                    onChangeText={handleTextChange}
                    autoCapitalize="none"
                    autoCorrect={false}
                    maxLength={200}
                    {...props}
                />
                {!autoSearch && (
                    <TouchableOpacity
                        style={styles.searchButton}
                        onPress={handleSearch}
                    >
                        <Text style={styles.searchButtonText}>🔍</Text>
                    </TouchableOpacity>
                )}
            </View>
            {searchError && (
                <Text style={styles.errorText}>{searchError}</Text>
            )}
        </View>
    );
};

/**
 * Componente de filtro seguro para dropdown/seleção
 */
export const SecureFilterSelect = ({
    options = [],
    value,
    onSelect,
    placeholder = "Selecione...",
    style
}) => {
    const [isOpen, setIsOpen] = React.useState(false);

    const handleSelect = (selectedValue) => {
        // Validar se o valor selecionado está nas opções permitidas
        const isValidOption = options.some(option => 
            option.value === selectedValue
        );
        
        if (isValidOption && onSelect) {
            onSelect(selectedValue);
        }
        setIsOpen(false);
    };

    const selectedOption = options.find(option => option.value === value);

    return (
        <View style={[styles.filterContainer, style]}>
            <TouchableOpacity
                style={styles.filterButton}
                onPress={() => setIsOpen(!isOpen)}
            >
                <Text style={styles.filterButtonText}>
                    {selectedOption ? selectedOption.label : placeholder}
                </Text>
                <Text style={styles.filterArrow}>
                    {isOpen ? '▲' : '▼'}
                </Text>
            </TouchableOpacity>
            
            {isOpen && (
                <View style={styles.optionsContainer}>
                    {options.map((option) => (
                        <TouchableOpacity
                            key={option.value}
                            style={[
                                styles.option,
                                option.value === value && styles.selectedOption
                            ]}
                            onPress={() => handleSelect(option.value)}
                        >
                            <Text style={[
                                styles.optionText,
                                option.value === value && styles.selectedOptionText
                            ]}>
                                {option.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        paddingHorizontal: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    input: {
        flex: 1,
        height: 44,
        fontSize: 16,
        color: '#374151',
        paddingVertical: 8,
    },
    inputError: {
        borderColor: '#ef4444',
        borderWidth: 2,
    },
    searchButton: {
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    searchButtonText: {
        fontSize: 18,
    },
    errorText: {
        fontSize: 12,
        color: '#ef4444',
        marginTop: 4,
        marginLeft: 4,
        fontWeight: '500',
    },
    filterContainer: {
        position: 'relative',
        marginVertical: 8,
        zIndex: 1000,
    },
    filterButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        paddingHorizontal: 12,
        paddingVertical: 12,
        height: 44,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    filterButtonText: {
        fontSize: 16,
        color: '#374151',
    },
    filterArrow: {
        fontSize: 12,
        color: '#9ca3af',
    },
    optionsContainer: {
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        backgroundColor: '#ffffff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        marginTop: 4,
        maxHeight: 200,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        zIndex: 1001,
    },
    option: {
        paddingHorizontal: 12,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    selectedOption: {
        backgroundColor: '#eff6ff',
    },
    optionText: {
        fontSize: 16,
        color: '#374151',
    },
    selectedOptionText: {
        color: '#1d4ed8',
        fontWeight: '500',
    },
});

export default SecureSearchInput;